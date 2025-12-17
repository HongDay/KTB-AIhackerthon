import type {
  Member,
  MeetingNote,
  Task,
  Work,
  SyncRun,
  DashboardKPI,
  PipelineStep,
  ExplanationScript,
} from '../types';

// Mock 팀원 데이터
export const mockMembers: Member[] = [
  { id: '1', name: '김민준', role: 'pm', skillLevel: 'senior', availableHours: 40 },
  { id: '2', name: '이서연', role: 'design', skillLevel: 'mid', availableHours: 40 },
  { id: '3', name: '박준혁', role: 'frontend', skillLevel: 'senior', availableHours: 35 },
  { id: '4', name: '정하은', role: 'backend', skillLevel: 'mid', availableHours: 40 },
  { id: '5', name: '최지우', role: 'data', skillLevel: 'junior', availableHours: 30 },
];

// Mock 회의록 데이터
export const mockMeetingNotes: MeetingNote[] = [
  {
    id: '1',
    title: '2024 Q4 신규 프로젝트 킥오프',
    date: '2024-12-15T14:00:00',
    content: `프로젝트 개요: 사용자 맞춤형 추천 시스템 구축
목표: 사용자 행동 데이터 기반 개인화 추천 기능 개발
범위: 웹/모바일 앱 모두 지원
기술 스택: React, Node.js, Python (ML), PostgreSQL
일정: 3개월 (2024.12 - 2025.02)

주요 논의사항:
1. 데이터 수집 범위 확정
2. 추천 알고리즘 선정
3. UI/UX 디자인 방향
4. 성능 목표 설정 (응답시간 < 200ms)`,
    uploadedBy: '김민준',
    status: 'sync_complete',
    version: 1,
    taskCount: 24,
    unassignedCount: 3,
    lastSyncResult: 'success',
    lastSyncAt: '2024-12-15T16:30:00',
  },
  {
    id: '2',
    title: '디자인 시스템 수립 회의',
    date: '2024-12-10T10:00:00',
    content: `디자인 시스템 기본 방향 논의`,
    uploadedBy: '이서연',
    status: 'task_complete',
    version: 1,
    taskCount: 12,
    unassignedCount: 5,
  },
];

// Mock 태스크 그룹 (Works)
export const mockWorks: Work[] = [
  {
    id: 'g1',
    title: '데이터 파이프라인 구축',
    category: 'backend',
    taskCount: 6,
    objective: '사용자 행동 데이터 수집 및 전처리',
    assigneeId: '4', // 정하은
    status: 'in_progress'
  },
  {
    id: 'g2',
    title: '추천 알고리즘 개발',
    category: 'data',
    taskCount: 5,
    objective: 'ML 기반 추천 모델 구축',
    assigneeId: '5', // 최지우
    status: 'not_started'
  },
  {
    id: 'g3',
    title: 'UI 컴포넌트 개발',
    category: 'frontend',
    taskCount: 8,
    objective: '추천 결과 표시 컴포넌트',
    assigneeId: '3', // 박준혁
    status: 'not_started'
  },
  {
    id: 'g4',
    title: '디자인 시스템',
    category: 'design',
    taskCount: 5,
    objective: '일관된 디자인 가이드',
    assigneeId: '2', // 이서연
    status: 'completed'
  },
];

// Mock 태스크 데이터
export const mockTasks: Task[] = [
  {
    id: 't1',
    title: '사용자 행동 로깅 API 설계',
    description: '클릭, 스크롤, 체류시간 등 수집',
    category: 'backend',
    workId: 'g1',
    status: 'in_progress',
    confidence: 'meeting_based',
    dependencies: [],
    prerequisites: [],
  },
  {
    id: 't2',
    title: '데이터 전처리 파이프라인',
    description: '수집된 데이터 정제 및 변환',
    category: 'data',
    workId: 'g2',
    status: 'not_started',
    confidence: 'meeting_based',
    dependencies: ['t1'],
    prerequisites: ['t1'],
  },
  {
    id: 't3',
    title: '추천 카드 컴포넌트',
    description: '추천 항목 표시 UI',
    category: 'frontend',
    workId: 'g3',
    status: 'not_started',
    confidence: 'meeting_based',
    dependencies: [],
    prerequisites: [],
  },
  {
    id: 't4',
    title: '색상 팔레트 정의',
    description: '브랜드 컬러 시스템',
    category: 'design',
    workId: 'g4',
    status: 'completed',
    confidence: 'meeting_based',
    dependencies: [],
    prerequisites: [],
  },
  {
    id: 't5',
    title: '성능 모니터링 도구 구축',
    description: '응답시간 추적',
    category: 'backend',
    workId: 'g1',
    status: 'not_started',
    confidence: 'inferred',
    dependencies: [],
    prerequisites: [],
  },
  {
    id: 't6',
    title: '에러 핸들링 로직',
    description: 'API 실패 시 대응',
    category: 'frontend',
    workId: 'g3',
    status: 'not_started',
    confidence: 'inferred',
    dependencies: [],
    prerequisites: [],
  },
  {
    id: 't7',
    title: '단위 테스트 작성',
    description: '주요 컴포넌트 테스트',
    category: 'frontend',
    workId: 'g3',
    status: 'not_started',
    confidence: 'inferred',
    dependencies: ['t3'],
    prerequisites: [],
  },
];

// Mock 동기화 실행 기록
export const mockSyncRuns: SyncRun[] = [
  {
    id: 's1',
    type: 'task',
    meetingNoteId: '1',
    version: 1,
    result: 'success',
    diff: { added: 5, modified: 2, deleted: 0 },
    log: '태스크 동기화 완료',
    createdAt: '2024-12-15T16:30:00',
    notionUrl: 'https://notion.so/project-tasks',
  },
  {
    id: 's2',
    type: 'explanation',
    meetingNoteId: '1',
    version: 1,
    result: 'success',
    diff: { added: 1, modified: 0, deleted: 0 },
    log: '설명 문서 생성 완료',
    createdAt: '2024-12-15T16:25:00',
    notionUrl: 'https://notion.so/project-explanation',
  },
  {
    id: 's3',
    type: 'task',
    meetingNoteId: '2',
    version: 1,
    result: 'failed',
    diff: { added: 0, modified: 0, deleted: 0 },
    log: 'Notion API 권한 오류',
    createdAt: '2024-12-10T11:00:00',
  },
];

// Mock 설명 스크립트
export const mockExplanationScripts: ExplanationScript[] = [
  {
    id: 'e1',
    meetingNoteId: '1',
    version: 1,
    content: {
      purpose: `이 프로젝트는 사용자의 행동 패턴을 분석하여 개인화된 콘텐츠 추천을 제공하는 시스템을 구축합니다. 
목표는 사용자 경험을 향상시키고 서비스 체류 시간을 20% 증가시키는 것입니다.`,
      scope: `범위: 웹과 모바일 앱 모두 지원하며, 초기 단계에서는 콘텐츠 추천에 집중합니다.
제약사항: 
- 개인정보 보호를 위해 익명화된 데이터만 사용
- 응답시간 200ms 이내 유지
- 기존 시스템과의 호환성 보장`,
      decisions: `1. 기술 스택: React(프론트), Node.js(백엔드), Python(ML), PostgreSQL(DB)
2. 추천 알고리즘: 협업 필터링 + 콘텐츠 기반 필터링 하이브리드 방식
3. 데이터 수집: 클릭, 스크롤, 체류시간, 검색어
4. 배포 방식: 점진적 롤아웃 (10% → 50% → 100%)`,
      nextActions: `1주차: 데이터 파이프라인 구축 및 로깅 시스템 개발
2주차: 추천 알고리즘 프로토타입 개발
3주차: UI 컴포넌트 개발 및 통합
4주차: 테스트 및 성능 최적화
다음 회의: 2024-12-22 (진행상황 체크)`,
    },
    createdAt: '2024-12-15T16:00:00',
  },
];

// Mock 대시보드 KPI
export const mockDashboardKPI: DashboardKPI = {
  generatedTasks: 24,
  inferredTasks: 7,
  unassignedWorks: 3,
  assignmentRate: 87.5,
  syncDiff: {
    added: 5,
    modified: 2,
    deleted: 0,
  },
  failedCount: 0,
};

// Mock 파이프라인 단계
export const mockPipelineSteps: PipelineStep[] = [
  { name: '회의록 업로드', status: 'completed', timestamp: '2024-12-15T15:00:00' },
  { name: '설명 생성', status: 'completed', timestamp: '2024-12-15T15:10:00' },
  { name: '태스크 추출', status: 'completed', timestamp: '2024-12-15T15:20:00' },
  { name: '업무 배정', status: 'completed', timestamp: '2024-12-15T15:30:00' },
  { name: 'Notion 동기화', status: 'completed', timestamp: '2024-12-15T16:30:00' },
];
