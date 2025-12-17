import React, { useState } from 'react';
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
  mockMeetingNotes,
  mockTasks,
  mockWorks,
  mockSyncRuns,
  mockDashboardKPI,
  mockPipelineSteps,
  mockExplanationScripts,
} from './lib/mock-data';
import type { MeetingNote, Task, Work } from './types';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [meetingNotes, setMeetingNotes] = useState(mockMeetingNotes);
  const [tasks, setTasks] = useState(mockTasks);
  const [works, setWorks] = useState(mockWorks);

  // 미배정 Work 계산
  const unassignedWorks = works.filter((w) => !w.assigneeId);
  const unassignedCount = unassignedWorks.length;

  // 실패 건수 (동기화 실패)
  const failedCount = mockSyncRuns.filter((r) => r.result === 'failed').length;

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
  const handleCreateMeetingNote = (title: string, content: string) => {
    const newNote: MeetingNote = {
      id: String(meetingNotes.length + 1),
      title,
      content,
      date: new Date().toISOString(),
      uploadedBy: '김민준',
      status: 'uploaded',
      version: 1,
    };
    setMeetingNotes([newNote, ...meetingNotes]);
    toast.success('회의록 업로드 완료', {
      description: '분석이 시작되었습니다. 잠시만 기다려주세요.',
    });
  };

  // 회의록 클릭
  const handleNoteClick = (noteId: string) => {
    toast.info('회의록 상세', {
      description: '회의록 상세 페이지로 이동합니다',
    });
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