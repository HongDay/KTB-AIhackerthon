// 회의록 상태
export type MeetingNoteStatus =
  | 'uploaded'
  | 'explanation_complete'
  | 'task_complete'
  | 'assignment_complete'
  | 'sync_complete'
  | 'failed';

// 태스크 분야
export type TaskCategory =
  | 'planning'
  | 'design'
  | 'frontend'
  | 'backend'
  | 'data'
  | 'pm'
  | 'other';

// 태스크 상태
export type TaskStatus = 'not_started' | 'in_progress' | 'completed';

// 태스크 신뢰도
export type TaskConfidence = 'meeting_based' | 'inferred';

// 동기화 타입
export type SyncType = 'explanation' | 'task';

// 동기화 결과
export type SyncResult = 'success' | 'failed';

// 팀원
export interface Member {
  id: string;
  name: string;
  role: TaskCategory;
  skillLevel?: 'junior' | 'mid' | 'senior';
  availableHours?: number;
  notionMapping?: string;
}

// 회의록
export interface MeetingNote {
  id: string;
  title: string;
  date: string;
  content: string;
  uploadedBy: string;
  status: MeetingNoteStatus;
  version: number;
  taskCount?: number;
  unassignedCount?: number;
  lastSyncResult?: SyncResult;
  lastSyncAt?: string;
}

// 설명 스크립트
export interface ExplanationScript {
  id: string;
  meetingNoteId: string;
  version: number;
  content: {
    purpose: string;
    scope: string;
    decisions: string;
    nextActions: string;
  };
  createdAt: string;
  references?: string[];
}

// Work 상태
export type WorkStatus = 'not_started' | 'in_progress' | 'completed';

// Work (기존 TaskGroup 대체)
export interface Work {
  id: string;
  title: string; // name -> title 변경
  description?: string; // 추가
  category: TaskCategory;
  assigneeId?: string; // 추가 (Work 단위 할당)
  status: WorkStatus; // 추가
  taskCount: number;
  objective?: string;
}

// 태스크
export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  workId: string; // groupId -> workId 변경
  // assigneeId 제거 (Work에 할당됨)
  status: TaskStatus;
  confidence: TaskConfidence;
  dependencies: string[];
  prerequisites: string[];
}

// 동기화 실행
export interface SyncRun {
  id: string;
  type: SyncType;
  meetingNoteId: string;
  version: number;
  result: SyncResult;
  diff: {
    added: number;
    modified: number;
    deleted: number;
  };
  log: string;
  createdAt: string;
  notionUrl?: string;
}

// 대시보드 KPI
export interface DashboardKPI {
  generatedTasks: number;
  inferredTasks: number;
  unassignedWorks: number;
  assignmentRate: number;
  syncDiff: {
    added: number;
    modified: number;
    deleted: number;
  };
  failedCount: number;
}

// 파이프라인 단계
export interface PipelineStep {
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp?: string;
  canRetry?: boolean;
}
