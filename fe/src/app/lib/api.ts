// API 응답 타입
interface ApiResponse<T> {
  message: string;
  data: T | null;
}

// 회의록 업로드 요청
interface UploadMeetingRequest {
  title: string;
  record: string;
}

// 회의록 업로드 응답
interface UploadMeetingResponse {
  meetingid: number;
}

// 회의 목록 항목
interface MeetingListItem {
  meetingid: number;
  title: string;
}

// 회의 설명 응답
interface MeetingDescriptionResponse {
  script: string;
}

// API Base URL (환경변수에서 가져오거나 기본값 사용)
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * 회의록 업로드
 */
export async function uploadMeeting(
  title: string,
  record: string
): Promise<UploadMeetingResponse> {
  const response = await fetch(`${API_BASE_URL}/api/meetings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // 쿠키 포함
    body: JSON.stringify({
      title,
      record,
    }),
  });

  if (!response.ok) {
    const errorData: ApiResponse<null> = await response.json();
    throw new Error(errorData.message || '회의록 업로드에 실패했습니다');
  }

  const data: ApiResponse<UploadMeetingResponse> = await response.json();
  if (!data.data) {
    throw new Error('응답 데이터가 없습니다');
  }

  return data.data;
}

/**
 * 회의 목록 조회
 */
export async function getMeetingList(): Promise<MeetingListItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/meeting`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // 쿠키 포함
  });

  if (!response.ok) {
    const errorData: ApiResponse<null> = await response.json();
    throw new Error(errorData.message || '회의 목록 조회에 실패했습니다');
  }

  const data: ApiResponse<MeetingListItem[]> = await response.json();
  if (!data.data) {
    return [];
  }

  return data.data;
}

/**
 * 회의 설명 조회
 */
export async function getMeetingDescription(meetingid: number): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/description/${meetingid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // 쿠키 포함
  });

  if (!response.ok) {
    const errorData: ApiResponse<null> = await response.json();
    throw new Error(errorData.message || '회의 설명 조회에 실패했습니다');
  }

  const data: ApiResponse<MeetingDescriptionResponse> = await response.json();
  if (!data.data || !data.data.script) {
    throw new Error('설명 데이터가 없습니다');
  }

  return data.data.script;
}

