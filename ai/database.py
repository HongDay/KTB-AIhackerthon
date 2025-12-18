
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# .env 파일 로드 (DB 접속 정보 등 중요 환경변수)
load_dotenv()

# 환경변수에서 DATABASE_URL 가져오기
DATABASE_URL = os.getenv("DATABASE_URL")

# SQLAlchemy 엔진 생성
# create_engine: DB와의 실제 연결 통로를 생성하는 함수
engine = create_engine(DATABASE_URL)

# 세션 관리자 생성 (SessionLocal)
# - auto_commit=False: 트랜잭션 수동 커밋 (실수로 인한 데이터 변경 방지)
# - autoflush=False: 세션의 변경사항을 DB에 바로 반영하지 않음
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# SQLAlchemy 모델들의 공통 부모 클래스 선언
Base = declarative_base()

# FastAPI 의존성 주입(Dependency Injection)을 위한 DB 세션 생성기
# 요청이 들어올 때마다 세션을 열고, 처리가 끝나면 반드시 닫아준다.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
