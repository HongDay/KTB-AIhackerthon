import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Users, TriangleAlert, Briefcase } from 'lucide-react';
import type { Work, Member } from '../types';

interface WorkAssignmentPageProps {
    works: Work[];
    members: Member[];
}

export function WorkAssignmentPage({ works, members }: WorkAssignmentPageProps) {
    const getCategoryLabel = (category: Work['category']) => {
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

    const getMemberWorks = (memberId: string) => {
        return works.filter((w) => w.assigneeId === memberId);
    };

    const getMemberStats = (memberId: string) => {
        const memberWorks = getMemberWorks(memberId);
        const total = memberWorks.length;
        const completed = memberWorks.filter((w) => w.status === 'completed').length;

        return { total, completed };
    };

    const getWorkloadStatus = (workCount: number) => {
        if (workCount === 0) return { label: '할당 없음', variant: 'secondary' as const };
        if (workCount <= 2) return { label: '적정', variant: 'default' as const };
        return { label: '과다', variant: 'destructive' as const };
    };

    const totalAssignedWorks = works.filter((w) => w.assigneeId).length;
    const totalWorks = works.length;
    const assignmentRate = totalWorks > 0 ? (totalAssignedWorks / totalWorks) * 100 : 0;

    return (
        <div className="space-y-6">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <div>
                    <h2>팀원별 Work 할당 현황</h2>
                    <p className="text-muted-foreground mt-1">
                        각 팀원의 Work(업무) 배분 현황을 확인합니다
                    </p>
                </div>
            </div>

            {/* 전체 통계 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            전체 Works
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-semibold">{totalWorks}</span>
                            <span className="text-sm text-muted-foreground">
                                (배정: {totalAssignedWorks})
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
            {members.some((m) => getMemberWorks(m.id).length > 3) && (
                <Alert variant="destructive">
                    <TriangleAlert className="size-4" />
                    <AlertDescription>
                        일부 팀원에게 Work가 과다하게 할당되어 있습니다. 업무 재분배를 고려하세요.
                    </AlertDescription>
                </Alert>
            )}

            {/* 팀원별 카드 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {members.map((member) => {
                    const stats = getMemberStats(member.id);
                    const workloadStatus = getWorkloadStatus(stats.total);
                    const memberWorks = getMemberWorks(member.id);
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
                                <div className="grid grid-cols-2 gap-2 text-center">
                                    <div>
                                        <div className="text-2xl font-semibold">{stats.total}</div>
                                        <div className="text-xs text-muted-foreground">전체 Works</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-semibold text-green-600">
                                            {stats.completed}
                                        </div>
                                        <div className="text-xs text-muted-foreground">완료</div>
                                    </div>
                                </div>

                                {/* 태스크 목록 미리보기 */}
                                {memberWorks.length > 0 && (
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">할당된 Works</div>
                                        <div className="space-y-2">
                                            {memberWorks.map((work) => (
                                                <div
                                                    key={work.id}
                                                    className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg border"
                                                >
                                                    <div className="p-2 bg-background rounded-md border text-muted-foreground">
                                                        <Briefcase className="size-4" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium truncate">{work.title}</div>
                                                        <div className="text-xs text-muted-foreground truncate">{work.objective}</div>
                                                    </div>
                                                    <Badge variant="outline" className="text-[10px] shrink-0">
                                                        {work.taskCount} tasks
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {stats.total === 0 && (
                                    <div className="text-sm text-muted-foreground text-center py-4">
                                        할당된 Work가 없습니다
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
