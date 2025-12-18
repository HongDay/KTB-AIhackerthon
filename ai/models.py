
from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base

# 회의록 분석 결과를 저장할 테이블 모델 정의
# 회의록 분석 결과를 저장할 테이블 모델 정의
# 1. 회의록 메인 테이블
class Meeting(Base):
    __tablename__ = "meeting"

    id = Column(Integer, primary_key=True, index=True)
    record = Column(Text, nullable=True)  # request에서 받은 회의록 원본
    script = Column(Text, nullable=True)  # LLM이 생성한 요약본 (<summary> 내용)
    title = Column(Text, nullable=True)   # LLM이 생성한 제목 (<title> 내용)


# 2. Works 테이블 (대분류)
class Works(Base):
    __tablename__ = "works"

    id = Column(Integer, primary_key=True, index=True)
    field = Column(Text, nullable=True)   # LLM이 지정한 스택 (BE, FE, CL, AI...)
    title = Column(Text, nullable=True)   # LLM이 작성해준 works 이름
    level = Column(Integer, default=1)    # 난이도 (1~3)
    works_order = Column(Integer, default=0) # LLM이 지정해준 work 간의 순서


# 3. Task List 테이블 (세부 작업)
class TaskList(Base):
    __tablename__ = "task_list"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meeting.id")) # meeting 테이블의 id
    works_id = Column(Integer, ForeignKey("works.id"))     # works 테이블의 id
    title = Column(Text, nullable=True)   # LLM이 만들어준 task 이름
    task_order = Column(Integer, default=0) # works 내에서의 순서
    
