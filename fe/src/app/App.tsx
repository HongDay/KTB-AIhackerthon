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
  mockTasks,
  mockWorks,
  mockSyncRuns,
  mockDashboardKPI,
  mockPipelineSteps,
  mockExplanationScripts,
  mockMeetingNotes,
} from './lib/mock-data';
import type { MeetingNote, Task, Work } from './types';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [meetingNotes, setMeetingNotes] = useState<MeetingNote[]>(mockMeetingNotes);
  const [tasks, setTasks] = useState(mockTasks);
  const [works, setWorks] = useState(mockWorks);
  const [members, setMembers] = useState(mockMembers);
  const [isLoadingMeetings, setIsLoadingMeetings] = useState(false);

  // 미배정 Work 계산
  const unassignedWorks = works.filter((w) => !w.assigneeId);
  const unassignedCount = unassignedWorks.length;

  // 실패 건수 (동기화 실패) - 동적으로 계산
  const failedCount = meetingNotes.filter((n) => n.status === 'failed').length;
  
  // KPI 업데이트 (동적으로 계산)
  const dashboardKPI = {
    generatedTasks: tasks.filter(t => t.confidence === 'meeting_based').length,
    inferredTasks: tasks.filter(t => t.confidence === 'inferred').length,
    unassignedWorks: unassignedCount,
    assignmentRate: works.length > 0 
      ? Math.round((works.filter(w => w.assigneeId).length / works.length) * 100) 
      : 0,
    syncDiff: {
      added: tasks.length,
      modified: 0,
      deleted: 0,
    },
    failedCount,
  };

  // 더미 데이터로 초기화 (API 호출 없음)

  // 회의록 업로드 핸들러
  const handleUpload = () => {
    toast.info('회의록 업로드', {
      description: '회의록 업로드 다이얼로그를 열었습니다',
    });
    setCurrentPage('meeting-notes');
  };

  // Notion 동기화 핸들러 (더미 데이터로 시뮬레이션)
  const handleSync = async () => {
    const syncToastId = 'sync-notion';
    
    toast.loading('동기화 시작', {
      id: syncToastId,
      description: 'Notion과 동기화를 시작합니다...',
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.loading('태스크 동기화 중...', {
      id: syncToastId,
      description: '태스크를 Notion에 동기화하고 있습니다.',
    });

    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.loading('Work 동기화 중...', {
      id: syncToastId,
      description: 'Work 항목을 업데이트하고 있습니다.',
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success('동기화 완료', {
      id: syncToastId,
      description: '5개의 태스크가 추가되고 2개가 수정되었습니다.',
    });
  };

  // 새 회의록 생성 (더미 데이터로 시뮬레이션)
  const handleCreateMeetingNote = async (title: string, content: string) => {
    const uploadToastId = 'upload-meeting';
    
    try {
      // 1. 업로드 시작
      toast.loading('회의록 업로드 중...', {
        id: uploadToastId,
      });
      
      await new Promise(resolve => setTimeout(resolve, 800));

      // 2. AI 분석 중
      toast.loading('AI 분석 중...', {
        id: uploadToastId,
        description: '회의록을 분석하고 태스크를 추출하고 있습니다.',
      });
      
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 3. 설명 생성 중
      toast.loading('설명 생성 중...', {
        id: uploadToastId,
        description: '프로젝트 설명을 생성하고 있습니다.',
      });
      
      await new Promise(resolve => setTimeout(resolve, 1200));

      // 4. 태스크 추출 중
      toast.loading('태스크 추출 중...', {
        id: uploadToastId,
        description: '회의록에서 태스크를 추출하고 있습니다.',
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 5. Notion 동기화 중
      toast.loading('Notion 동기화 중...', {
        id: uploadToastId,
        description: 'Notion 페이지를 생성하고 있습니다.',
      });
      
      await new Promise(resolve => setTimeout(resolve, 800));

      // 6. 완료 - 새 회의록 추가
      const newNote: MeetingNote = {
        id: String(Date.now()),
        title,
        content,
        date: new Date().toISOString(),
        uploadedBy: '김민준',
        status: 'sync_complete',
        version: 1,
        taskCount: Math.floor(Math.random() * 20) + 10, // 10-30개
        unassignedCount: Math.floor(Math.random() * 5),
        lastSyncResult: 'success',
        lastSyncAt: new Date().toISOString(),
      };

      setMeetingNotes([newNote, ...meetingNotes]);
      
      // 태스크와 Work도 추가 (더미)
      const newTaskCount = newNote.taskCount || 0;
      const timestamp = Date.now();
      const newWorkId = `g-${timestamp}`;
      
      // 새 Work 생성
      const newWork: Work = {
        id: newWorkId,
        title: `${title} 관련 작업`,
        category: 'planning',
        taskCount: newTaskCount,
        status: 'not_started',
      };
      
      const newTasks: Task[] = Array.from({ length: Math.min(newTaskCount, 5) }, (_, i) => ({
        id: `t-${timestamp}-${i}`,
        title: `${title} 관련 태스크 ${i + 1}`,
        description: `회의록에서 추출된 태스크 ${i + 1}`,
        category: ['frontend', 'backend', 'design', 'data', 'planning'][i % 5] as Task['category'],
        workId: newWorkId,
        status: 'not_started',
        confidence: i < 3 ? 'meeting_based' : 'inferred',
        dependencies: [],
        prerequisites: [],
      }));
      
      setTasks([...tasks, ...newTasks]);
      setWorks([...works, newWork]);

      toast.success('회의록 업로드 완료', {
        id: uploadToastId,
        description: `${newTaskCount}개의 태스크가 생성되었습니다.`,
      });
    } catch (error) {
      console.error('회의록 업로드 실패:', error);
      toast.error('회의록 업로드 실패', {
        id: uploadToastId,
        description: '다시 시도해주세요.',
      });
    }
  };

  // 회의록 클릭 (더미 데이터로 시뮬레이션)
  const handleNoteClick = async (noteId: string) => {
    const note = meetingNotes.find(n => n.id === noteId);
    if (!note) {
      toast.error('회의록을 찾을 수 없습니다');
      return;
    }

    toast.loading('회의 설명을 불러오는 중...', {
      id: 'load-description',
    });

    // 더미 로딩 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 500));

    toast.success('회의 설명 로드 완료', {
      id: 'load-description',
      description: '설명 페이지로 이동합니다.',
    });

    // 설명 페이지로 이동
    setCurrentPage('explanation');
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
            kpi={dashboardKPI}
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
            members={members}
            onWorkUpdate={handleWorkUpdate}
            onTaskUpdate={handleTaskUpdate}
          />
        );

      case 'explanation':
        return (
          <ExplanationPage
            script={mockExplanationScripts[0]}
            onSyncToNotion={handleSync}
            onRegenerate={async () => {
              const regenerateToastId = 'regenerate-script';
              toast.loading('재생성 시작', {
                id: regenerateToastId,
                description: '설명 스크립트를 다시 생성합니다...',
              });

              await new Promise(resolve => setTimeout(resolve, 1500));

              toast.loading('AI 분석 중...', {
                id: regenerateToastId,
                description: '회의록을 다시 분석하고 있습니다.',
              });

              await new Promise(resolve => setTimeout(resolve, 2000));

              toast.loading('설명 생성 중...', {
                id: regenerateToastId,
                description: '새로운 설명을 생성하고 있습니다.',
              });

              await new Promise(resolve => setTimeout(resolve, 1500));

              toast.success('재생성 완료', {
                id: regenerateToastId,
                description: '설명 스크립트가 업데이트되었습니다.',
              });
            }}
          />
        );

      case 'assignment-inbox':
        return (
          <AssignmentInboxPage
            unassignedWorks={unassignedWorks}
            members={members}
            onAssign={(workId, memberId) => {
              handleWorkUpdate(workId, { assigneeId: memberId });
            }}
          />
        );

      case 'assignment-team':
        return (
          <WorkAssignmentPage
            works={works}
            members={members}
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
            members={members}
            onAddMember={(member) => {
              const newMember = {
                ...member,
                id: String(Date.now()),
              };
              setMembers([...members, newMember]);
              toast.success('팀원 추가 완료', {
                description: `${member.name}님이 팀에 추가되었습니다.`,
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