# Gemini Meeting Assistant

Gemini Meeting Assistant는 Google의 Gemini Pro 모델을 활용하여 회의록을 분석하는 FastAPI 기반 백엔드 애플리케이션입니다. 회의록을 분석하여 임원진을 위한 요약 및 리스크 분석과 개발팀을 위한 구조화된 WBS(작업 분할 구조)가 포함된 "Sprint Planning Report"를 자동으로 생성합니다. 분석된 데이터는 SQLAlchemy를 통해 관계형 데이터베이스에 저장됩니다.

## 주요 기능 (Features)

-   **AI 기반 분석**: Google의 `gemini-flash-latest` 모델을 사용하여 복잡한 기술 회의 내용을 해석합니다.
-   **구조화된 WBS 생성**: 기술 분야(BE, FE, AI 등)별로 분류된 계층적 작업 분할 구조(WBS)를 자동으로 생성합니다.
-   **리스크 분석**: 요약보고서(Executive Summary)에서 중요한 리스크와 누락된 요구사항을 식별합니다.
-   **데이터베이스 통합**: 회의 기록, 요약 및 구조화된 작업을 SQLAlchemy를 사용하여 데이터베이스에 저장합니다.
-   **REST API**: 분석 파이프라인을 실행하기 위한 간편한 `POST /generate` 엔드포인트를 제공합니다.

## 기술 스택 (Tech Stack)

-   **Language**: Python 3.x
-   **Framework**: FastAPI
-   **AI Model**: Google Generative AI (Gemini)
-   **Database ORM**: SQLAlchemy
-   **Validation**: Pydantic
-   **Environment Management**: python-dotenv

## 요구 사항 (Prerequisites)

-   Python 3.8 이상
-   Google Gemini API Key
-   데이터베이스 URL (예: PostgreSQL, MySQL, 또는 SQLite)

## 설치 방법 (Installation)

1.  **저장소 클론 (Clone Repository)**

2.  **의존성 패키지 설치**
    저장소에 `requirements.txt`가 포함되어 있지 않은 경우, 아래 명령어로 필요한 패키지를 수동으로 설치할 수 있습니다:
    ```bash
    pip install fastapi uvicorn google-generativeai sqlalchemy pydantic python-dotenv
    ```
    *(참고: `DATABASE_URL`에 따라 `psycopg2`나 `pymysql` 같은 데이터베이스 드라이버가 추가로 필요할 수 있습니다.)*

3.  **환경 설정**
    루트 디렉토리에 `.env` 파일을 생성하고 아래와 같이 설정을 추가하세요:
    ```env
    GEMINI_API_KEY=your_gemini_api_key_here
    DATABASE_URL=your_database_connection_string_here
    ```

## 사용법 (Usage)

1.  **서버 실행**
    ```bash
    uvicorn main:app --reload
    ```
    서버는 `http://127.0.0.1:8000`에서 시작됩니다.

2.  **API 문서 확인**
    `http://127.0.0.1:8000/docs`에 접속하여 자동 생성된 Swagger UI를 통해 엔드포인트를 테스트할 수 있습니다.

3.  **회의 보고서 생성**
    **Endpoint**: `POST /generate`
    
    **Request Body**:
    ```json
    {
      "teamid": 1,
      "title": "주간 회의",
      "record": "여기에 회의록 텍스트 내용을 입력하세요..."
    }
    ```

    **Response**:
    ```json
    {
      "message": "meeting script successfully exported to notion",
      "data": {
        "meetingid": 123
      }
    }
    ```

## 프로젝트 구조 (Project Structure)

-   `main.py`: FastAPI 애플리케이션의 진입점입니다. API 요청 처리, Gemini 연동, 응답 파싱을 담당합니다.
-   `models.py`: `Meeting`, `Works`, `TaskList` 테이블을 정의하는 SQLAlchemy 데이터베이스 모델입니다.
-   `database.py`: 데이터베이스 연결 및 세션 관리 설정 파일입니다.
-   `prompts.py`: Gemini 모델을 위한 시스템 프롬프트 및 지시사항을 구성하는 로직이 들어있습니다.
