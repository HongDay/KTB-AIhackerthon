import os
import re
import json
import google.generativeai as genai
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from prompts import construct_prompt
from database import engine, get_db
import models

# 1. 환경 변수 로드 및 설정
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# 2. DB 테이블 초기화
models.Base.metadata.create_all(bind=engine)

# 3. Gemini 모델 초기화
model = genai.GenerativeModel("gemini-flash-latest")

# 4. FastAPI 애플리케이션 생성
app = FastAPI(title="Gemini Meeting Assistant")

# 5. 요청 데이터 구조 정의
class PromptRequest(BaseModel):
    title: str
    record: str  # record(회의록)

# 6. 서버 내부 상수
INTERNAL_INSTRUCTION = "우리는 지금 초기 기획에서 개발로 넘어가는 단계야. 개발에 대해서 기획에서 빠진게 있는지 꼼꼼하게 찾아줘. 답변이 길어지더라도 절대 중간에 끊지 말고 끝까지 출력해."
GENERATION_CONFIG = genai.types.GenerationConfig(
    temperature=1.0,
    max_output_tokens=8000,
    top_p=0.95,
    top_k=64,
)

# [Helper] AI 응답 파싱 함수
def parse_ai_response(text: str) -> dict:
    """
    AI 응답 텍스트에서 <tag>...</tag> 사이의 내용을 추출합니다.
    <wbs>는 JSON 문자열로 파싱합니다.
    """
    parsed = {"title": "", "summary": "", "wbs": []}
    
    # 1. Title 추출
    title_match = re.search(r"<title>(.*?)</title>", text, re.DOTALL)
    if title_match:
        parsed["title"] = title_match.group(1).strip()
        
    # 2. Summary 추출
    summary_match = re.search(r"<summary>(.*?)</summary>", text, re.DOTALL)
    if summary_match:
        parsed["summary"] = summary_match.group(1).strip()
        
    # 3. WBS (JSON) 추출
    wbs_match = re.search(r"<wbs>(.*?)</wbs>", text, re.DOTALL)
    if wbs_match:
        wbs_json_str = wbs_match.group(1).strip()
        try:
            wbs_data = json.loads(wbs_json_str)
            if isinstance(wbs_data, list):
                # Fallback: 만약 LLM이 예전처럼 리스트로 준다면 works만 있는 것으로 간주
                parsed["wbs"] = {"works": wbs_data, "general_tasks": []}
            else:
                # Dict 형태인 경우 default key 보장
                parsed["wbs"] = {
                    "works": wbs_data.get("works", []),
                    "general_tasks": wbs_data.get("general_tasks", [])
                }
        except json.JSONDecodeError:
            print("WBS JSON Parsing Failed")
            parsed["wbs"] = {"works": [], "general_tasks": []}
        
    return parsed

# 7. 텍스트 생성 엔드포인트
@app.post("/generate")
async def generate_content(request: PromptRequest, db: Session = Depends(get_db)):
    """
    회의록을 받아 분석하고, 3단 계층 구조(Meeting -> Works -> TaskList)로 DB에 저장합니다.
    """
    try:
        # request.record를 사용하여 프롬프트 구성
        final_prompt = construct_prompt(request.record, INTERNAL_INSTRUCTION)
        
        response = await model.generate_content_async(
            final_prompt,
            generation_config=GENERATION_CONFIG
        )
        
        # 1. AI 응답 텍스트 확보
        try:
            generated_text = response.text
        except ValueError:
            generated_text = "<title>Error</title><summary>응답 생성 실패</summary><wbs>{\"works\": [], \"general_tasks\": []}</wbs>"

        # 2. 파싱 (Parsing)
        parsed_data = parse_ai_response(generated_text)

        # 3. DB 저장 로직 (계층 구조)
        
        # (1) Meeting 저장
        db_meeting = models.Meeting(
            record=request.record,
            script=parsed_data["summary"],
            title=parsed_data["title"]
        )
        db.add(db_meeting)
        db.commit()
        db.refresh(db_meeting) # meeting_id 생성됨
        
        # (2) Works & TaskList 저장 Loop
        wbs_data = parsed_data["wbs"]
        
        # [A] Works 처리
        for i, work_item in enumerate(wbs_data.get("works", [])):
            # Works 저장
            db_work = models.Works(
                field=work_item.get("field", "Unknown"),
                title=work_item.get("title", "Untitled Work"),
                level=work_item.get("level", 1), # 기본값 1 (하)
                works_order=i + 1
            )
            db.add(db_work)
            db.commit()
            db.refresh(db_work) # works_id 생성됨
            
            # Task List 저장 (Works 소속)
            tasks = work_item.get("tasks", [])
            for j, task_title in enumerate(tasks):
                db_task = models.TaskList(
                    meeting_id=db_meeting.id,  # 외래키 연결
                    works_id=db_work.id,       # 외래키 연결
                    title=task_title,
                    task_order=j + 1
                )
                db.add(db_task)
        
        # [B] General Tasks 처리 (Works 없음)
        for k, general_task_title in enumerate(wbs_data.get("general_tasks", [])):
            db_gen_task = models.TaskList(
                meeting_id=db_meeting.id,
                works_id=None, # Works 없음
                title=general_task_title,
                task_order=k + 1
            )
            db.add(db_gen_task)

        db.commit() # Tasks 일괄 커밋

        # 4. 결과 반환 (Simplified Response)
        return {
            "message": "meeting script successfully exported to notion",
            "data": {
                "meetingid": db_meeting.id
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 서버 실행 여부 확인용
@app.get("/")
def read_root():
    return {"message": "Gemini AI Backend is running!"}