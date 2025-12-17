import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Users, TrendingUp, TriangleAlert } from 'lucide-react';
import type { Task, Member } from '../types';

interface TeamAssignmentPageProps {
  tasks: Task[];
  members: Member[];
}

export function TeamAssignmentPage({ tasks, members }: TeamAssignmentPageProps) {
  const getCategoryLabel = (category: Task['category']) => {
    const labels = {
      planning: '기획',
      design: '디자인',
      frontend: '프론트엔드',
      backend: '백엔드',
      data: '데이터',
      pm: 'PM',
      other: '기타',
    };
    return labels[category];
  };

  const getMemberTasks = (memberId: string) => {
    return tasks.filter((t) => t.assigneeId === memberId);
  };

  const getMemberStats = (memberId: string) => {
    const memberTasks = getMemberTasks(memberId);
    const total = memberTasks.length;
    const completed = memberTasks.filter((t) => t.status === 'completed').length;
    const inProgress = memberTasks.filter((t) => t.status === 'in_progress').length;
    const notStarted = memberTasks.filter((t) => t.status === 'not_started').length;

    return { total, completed, inProgress, notStarted };
  };

  const getWorkloadStatus = (taskCount: number) => {
    if (taskCount === 0) return { label: '할당 없음', variant: 'secondary' as const };
    if (taskCount <= 3) return { label: '적정', variant: 'default' as const };
    if (taskCount <= 6) return { label: '보통', variant: 'default' as const };
    return { label: '과다', variant: 'destructive' as const };
  };

  const totalAssignedTasks = tasks.filter((t) => t.assigneeId).length;
  const totalTasks = tasks.length;
  const assignmentRate = totalTasks > 0 ? (totalAssignedTasks / totalTasks) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2>팀원별 할당 현황</h2>
          <p className="text-muted-foreground mt-1">
            각 팀원의 업무 배분 현황을 확인합니다
          </p>
        </div>
      </div>

      {/* 전체 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              전체 태스크
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold">{totalTasks}</span>
              <span className="text-sm text-muted-foreground">
                (배정: {totalAssignedTasks})
              </span>
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
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold">{assignmentRate.toFixed(1)}%</span>
                {assignmentRate === 100 && (
                  <TrendingUp className="size-4 text-green-600" />
                )}
              </div>
              <Progress value={assignmentRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              팀 구성
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold">{members.length}</span>
              <span className="text-sm text-muted-foreground">명</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 과다 할당 경고 */}
      {members.some((m) => getMemberTasks(m.id).length > 6) && (
        <Alert variant="destructive">
          <TriangleAlert className="size-4" />
          <AlertDescription>
            일부 팀원에게 태스크가 과다하게 할당되어 있습니다. 업무 재분배를 고려하세요.
          </AlertDescription>
        </Alert>
      )}

      {/* 팀원별 카드 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {members.map((member) => {
          const stats = getMemberStats(member.id);
          const workloadStatus = getWorkloadStatus(stats.total);
          const memberTasks = getMemberTasks(member.id);
          const completionRate =
            stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

          return (
            <Card key={member.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {member.name}
                      <Badge variant="outline" className="text-xs">
                        {getCategoryLabel(member.role)}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {member.skillLevel && `${member.skillLevel} · `}
                      {member.availableHours && `주 ${member.availableHours}시간`}
                    </CardDescription>
                  </div>
                  <Badge variant={workloadStatus.variant}>
                    {workloadStatus.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 통계 */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <div className="text-2xl font-semibold">{stats.total}</div>
                    <div className="text-xs text-muted-foreground">전체</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-green-600">
                      {stats.completed}
                    </div>
                    <div className="text-xs text-muted-foreground">완료</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-blue-600">
                      {stats.inProgress}
                    </div>
                    <div className="text-xs text-muted-foreground">진행중</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-muted-foreground">
                      {stats.notStarted}
                    </div>
                    <div className="text-xs text-muted-foreground">미시작</div>
                  </div>
                </div>

                {/* 진행률 */}
                {stats.total > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">완료율</span>
                      <span className="font-medium">{completionRate.toFixed(0)}%</span>
                    </div>
                    <Progress value={completionRate} className="h-2" />
                  </div>
                )}

                {/* 태스크 목록 미리보기 */}
                {memberTasks.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">주요 태스크</div>
                    <div className="space-y-1.5">
                      {memberTasks.slice(0, 3).map((task) => (
                        <div
                          key={task.id}
                          className="flex items-start gap-2 text-sm p-2 bg-accent/30 rounded"
                        >
                          <div
                            className={`size-2 rounded-full mt-1.5 ${
                              task.status === 'completed'
                                ? 'bg-green-600'
                                : task.status === 'in_progress'
                                ? 'bg-blue-600'
                                : 'bg-muted-foreground'
                            }`}
                          />
                          <span className="flex-1 truncate">{task.title}</span>
                        </div>
                      ))}
                      {memberTasks.length > 3 && (
                        <div className="text-xs text-muted-foreground text-center">
                          +{memberTasks.length - 3}개 더보기
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {stats.total === 0 && (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    할당된 태스크가 없습니다
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 균형 재추천 버튼 (미구현) */}
      <div className="flex justify-center">
        <Button variant="outline" className="gap-2" disabled>
          <Users className="size-4" />
          업무 균형 재추천 (준비 중)
        </Button>
      </div>
    </div>
  );
}
