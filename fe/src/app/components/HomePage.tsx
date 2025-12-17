import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Check, Clock, TriangleAlert, TrendingUp, Users, Briefcase } from 'lucide-react';
import type { DashboardKPI, PipelineStep, Work, SyncRun } from '../types';

interface HomePageProps {
  kpi: DashboardKPI;
  pipelineSteps: PipelineStep[];
  unassignedWorks: Work[];
  recentSyncRuns: SyncRun[];
  onNavigate: (page: string) => void;
}

export function HomePage({
  kpi,
  pipelineSteps,
  unassignedWorks,
  recentSyncRuns,
  onNavigate,
}: HomePageProps) {
  const getStepIcon = (status: PipelineStep['status']) => {
    switch (status) {
      case 'completed':
        return <Check className="size-5 text-green-600" />;
      case 'processing':
        return <Clock className="size-5 text-blue-600 animate-spin" />;
      case 'failed':
        return <TriangleAlert className="size-5 text-destructive" />;
      default:
        return <div className="size-5 rounded-full border-2 border-muted" />;
    }
  };

  const getStepProgress = () => {
    const completed = pipelineSteps.filter((s) => s.status === 'completed').length;
    return (completed / pipelineSteps.length) * 100;
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h2>대시보드</h2>
        <p className="text-muted-foreground mt-1">
          프로젝트 진행 현황을 한눈에 확인하세요
        </p>
      </div>

      {/* 파이프라인 스텝 */}
      <Card>
        <CardHeader>
          <CardTitle>처리 파이프라인</CardTitle>
          <CardDescription>회의록부터 Notion 동기화까지의 진행 상태</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            {pipelineSteps.map((step, index) => (
              <React.Fragment key={step.name}>
                <div className="flex flex-col items-center gap-2">
                  {getStepIcon(step.status)}
                  <span className="text-sm font-medium">{step.name}</span>
                  {step.timestamp && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(step.timestamp).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>
                {index < pipelineSteps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-muted mx-4" />
                )}
              </React.Fragment>
            ))}
          </div>
          <Progress value={getStepProgress()} className="h-2" />
        </CardContent>
      </Card>

      {/* KPI 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              생성된 태스크
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold">{kpi.generatedTasks}</span>
              <span className="text-sm text-muted-foreground">
                (추론: {kpi.inferredTasks})
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              미배정 Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold">{kpi.unassignedWorks}</span>
              {kpi.unassignedWorks > 0 && (
                <Badge variant="destructive">조치필요</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              배정 완료율
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold">{kpi.assignmentRate}%</span>
              <TrendingUp className="size-4 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              동기화 변경사항
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-3 text-sm">
              <span className="text-green-600">+{kpi.syncDiff.added}</span>
              <span className="text-blue-600">~{kpi.syncDiff.modified}</span>
              <span className="text-red-600">-{kpi.syncDiff.deleted}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 미배정 인박스 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>미배정 인박스</CardTitle>
                <CardDescription>담당자를 지정해야 할 Work</CardDescription>
              </div>
              <Badge variant="secondary">{unassignedWorks.length}개</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {unassignedWorks.slice(0, 5).map((work) => (
              <div
                key={work.id}
                className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => onNavigate('assignment-inbox')}
              >
                <Briefcase className="size-4 mt-0.5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{work.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {work.category}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {work.taskCount} tasks
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
            {unassignedWorks.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                모든 Work가 배정되었습니다
              </p>
            )}
            {unassignedWorks.length > 0 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onNavigate('assignment-inbox')}
              >
                배정하러 가기
              </Button>
            )}
          </CardContent>
        </Card>

        {/* 최근 동기화 로그 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>최근 동기화 로그</CardTitle>
                <CardDescription>Notion 동기화 실행 기록</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentSyncRuns.slice(0, 5).map((run) => (
              <div
                key={run.id}
                className="flex items-start gap-3 p-3 border rounded-lg"
              >
                {run.result === 'success' ? (
                  <Check className="size-4 mt-0.5 text-green-600" />
                ) : (
                  <TriangleAlert className="size-4 mt-0.5 text-destructive" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {run.type === 'explanation' ? '설명 문서' : '태스크'}
                    </span>
                    <Badge
                      variant={run.result === 'success' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {run.result === 'success' ? '성공' : '실패'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{run.log}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(run.createdAt).toLocaleString('ko-KR')}
                  </p>
                </div>
              </div>
            ))}
            {recentSyncRuns.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                동기화 기록이 없습니다
              </p>
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onNavigate('sync-logs')}
            >
              로그 전체보기
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}