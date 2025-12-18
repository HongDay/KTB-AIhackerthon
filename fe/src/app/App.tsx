import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sidebar, type PageType } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { HomePage } from './components/HomePage';
import { MeetingNotesPage } from './components/MeetingNotesPage';
import { WorksPage } from './components/WorksPage';
import { ExplanationPage } from './components/ExplanationPage';
import { AssignmentInboxPage } from './components/AssignmentInboxPage';
import { WorkAssignmentPage } from './components/WorkAssignmentPage';
import { SettingsPage } from './components/SettingsPage';
import {
  mockMembers,
  mockTasks,
  mockWorks,
  mockSyncRuns,
  mockDashboardKPI,
  mockPipelineSteps,
  mockExplanationScripts,
} from './lib/mock-data';
import { uploadMeeting, getMeetingList, getMeetingDescription } from './lib/api';
import type { MeetingNote, Task, Work } from './types';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [meetingNotes, setMeetingNotes] = useState<MeetingNote[]>([]);
  const [tasks, setTasks] = useState(mockTasks);
  const [works, setWorks] = useState(mockWorks);
  const [isLoadingMeetings, setIsLoadingMeetings] = useState(false);
  const isFetchingRef = useRef(false);

  // 미배정 Work 계산
  const unassignedWorks = works.filter((w) => !w.assigneeId);
  const unassignedCount = unassignedWorks.length;

  // 실패 건수 (동기화 실패)
  const failedCount = mockSyncRuns.filter((r) => r.result === 'failed').length;

  // 회의록 목록 조회 (중복 호출 방지)
  const fetchMeetingList = useCallback(async () => {
    // 이미 호출 중이면 중복 호출 방지
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setIsLoadingMeetings(true);
    try {
      const meetings = await getMeetingList();
      // API 응답을 MeetingNote 타입으로 변환
      const notes: MeetingNote[] = meetings.map((meeting) => ({
        id: String(meeting.meetingid),
        title: meeting.title,
        date: new Date().toISOString(), // API에서 날짜가 없으므로 현재 시간 사용
        content: '', // API에서 content가 없음
        uploadedBy: '', // API에서 없음
        status: 'uploaded', // 기본값
        version: 1,
      }));
      setMeetingNotes(notes);
    } catch (error) {
      console.error('회의록 목록 조회 실패:', error);
      toast.error('회의록 목록 조회 실패', {
        description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다',
      });
    } finally {
      setIsLoadingMeetings(false);
      isFetchingRef.current = false;
    }
  }, []);

  // 컴포넌트 마운트 시 회의록 목록 조회
  useEffect(() => {
    fetchMeetingList();
  }, [fetchMeetingList]);

  // 회의록 업로드 핸들러
  const handleUpload = () => {
    toast.info('회의록 업로드', {
      description: '회의록 업로드 다이얼로그를 열었습니다',
    });
    setCurrentPage('meeting-notes');
  };

  // Notion 동기화 핸들러
  const handleSync = () => {
    toast.success('동기화 시작', {
      description: 'Notion과 동기화를 시작합니다...',
    });
    setTimeout(() => {
      toast.success('동기화 완료', {
        description: '5개의 태스크가 추가되고 2개가 수정되었습니다',
      });
    }, 2000);
  };

  // 새 회의록 생성
  const handleCreateMeetingNote = async (title: string, content: string) => {
    try {
      toast.loading('회의록 업로드 중...', {
        id: 'upload-meeting',
      });

      const response = await uploadMeeting(title, content);
      
      toast.success('회의록 업로드 완료', {
        id: 'upload-meeting',
        description: '분석이 시작되었습니다. 잠시만 기다려주세요.',
      });

      // 업로드 성공 후 목록 새로고침
      await fetchMeetingList();
    } catch (error) {
      console.error('회의록 업로드 실패:', error);
      toast.error('회의록 업로드 실패', {
        id: 'upload-meeting',
        description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다',
      });
    }
  };

  // 회의록 클릭
  const handleNoteClick = async (noteId: string) => {
    try {
      const meetingId = parseInt(noteId, 10);
      if (isNaN(meetingId)) {
        toast.error('잘못된 회의록 ID입니다');
        return;
      }

      toast.loading('회의 설명을 불러오는 중...', {
        id: 'load-description',
      });

      const script = await getMeetingDescription(meetingId);
      
      toast.success('회의 설명 로드 완료', {
        id: 'load-description',
        description: '회의 설명을 불러왔습니다',
      });

      // 설명 페이지로 이동하거나 설명을 표시하는 로직 추가 가능
      // 현재는 토스트만 표시
      console.log('Meeting description:', script);
    } catch (error) {
      console.error('회의 설명 조회 실패:', error);
      toast.error('회의 설명 조회 실패', {
        id: 'load-description',
        description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다',
      });
    }
  };

  // 태스크 업데이트
  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)));
    // toast.success('태스크 업데이트', {
    //   description: '변경사항이 저장되었습니다',
    // });
  };

  // Work 업데이트 (할당 등)
  const handleWorkUpdate = (workId: string, updates: Partial<Work>) => {
    setWorks(works.map((w) => (w.id === workId ? { ...w, ...updates } : w)));
    if (updates.assigneeId) {
      toast.success('Work 할당 완료', {
        description: '담당자가 지정되었습니다',
      });
    }
  };


  // 페이지 렌더링
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            kpi={mockDashboardKPI}
            pipelineSteps={mockPipelineSteps}
            unassignedWorks={unassignedWorks}
            recentSyncRuns={mockSyncRuns}
            onNavigate={(page) => setCurrentPage(page as PageType)}
          />
        );

      case 'meeting-notes':
        return (
          <MeetingNotesPage
            meetingNotes={meetingNotes}
            onNoteClick={handleNoteClick}
            onUpload={handleCreateMeetingNote}
          />
        );

      case 'tasks': // 메뉴명 변경 고려 (Works)
        return (
          <WorksPage
            works={works}
            tasks={tasks}
            members={mockMembers}
            onWorkUpdate={handleWorkUpdate}
            onTaskUpdate={handleTaskUpdate}
          />
        );

      case 'explanation':
        return (
          <ExplanationPage
            script={mockExplanationScripts[0]}
            onSyncToNotion={handleSync}
            onRegenerate={() => {
              toast.info('재생성 시작', {
                description: '설명 스크립트를 다시 생성합니다...',
              });
            }}
          />
        );

      case 'assignment-inbox':
        return (
          <AssignmentInboxPage
            unassignedWorks={unassignedWorks}
            members={mockMembers}
            onAssign={(workId, memberId) => {
              handleWorkUpdate(workId, { assigneeId: memberId });
            }}
          />
        );

      case 'assignment-team':
        return (
          <WorkAssignmentPage
            works={works}
            members={mockMembers}
          />
        );

      case 'sync':
        return (
          <div className="space-y-6">
            <div>
              <h2>Notion 동기화</h2>
              <p className="text-muted-foreground mt-1">
                Notion 워크스페이스와 데이터를 동기화합니다
              </p>
            </div>
            <div className="text-center py-12 text-muted-foreground">
              동기화 페이지 (개발 중)
            </div>
          </div>
        );

      case 'sync-logs':
        return (
          <div className="space-y-6">
            <div>
              <h2>동기화 로그</h2>
              <p className="text-muted-foreground mt-1">
                Notion 동기화 실행 기록을 확인합니다
              </p>
            </div>
            <div className="text-center py-12 text-muted-foreground">
              동기화 로그 페이지 (개발 중)
            </div>
          </div>
        );

      case 'settings':
        return (
          <SettingsPage
            members={mockMembers}
            onAddMember={() => {
              toast.info('팀원 추가', {
                description: '새 팀원을 추가합니다...',
              });
            }}
          />
        );

      default:
        return (
          <div className="text-center py-12 text-muted-foreground">페이지를 찾을 수 없습니다</div>
        );
    }
  };

  return (
    <div className="h-screen flex bg-background">
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        unassignedCount={unassignedCount}
        failedCount={failedCount}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          onUploadClick={handleUpload}
          onSyncClick={handleSync}
          lastSyncTime="2분 전"
          syncStatus="success"
        />

        <main className="flex-1 overflow-auto p-8">{renderPage()}</main>
      </div>

      <Toaster />
    </div>
  );
}