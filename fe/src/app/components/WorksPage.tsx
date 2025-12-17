import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from './ui/accordion';
import { Checkbox } from './ui/checkbox';
import { Search, Filter, GitBranch, Briefcase } from 'lucide-react';
import type { Task, Work, Member, TaskCategory, WorkStatus, TaskStatus } from '../types';
import { cn } from './ui/utils';

interface WorksPageProps {
    works: Work[];
    tasks: Task[];
    members: Member[];
    onWorkUpdate: (workId: string, updates: Partial<Work>) => void;
    onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
}

export function WorksPage({ works, tasks, members, onWorkUpdate, onTaskUpdate }: WorksPageProps) {
    const [filterCategory, setFilterCategory] = useState<TaskCategory | 'all'>('all');
    const [filterAssignee, setFilterAssignee] = useState<string>('all');

    const getCategoryLabel = (category: TaskCategory) => {
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

    const getMemberName = (memberId?: string) => {
        if (!memberId) return '미배정';
        const member = members.find((m) => m.id === memberId);
        return member?.name || '미배정';
    };

    const filteredWorks = works.filter((work) => {
        if (filterCategory !== 'all' && work.category !== filterCategory) return false;
        if (filterAssignee !== 'all' && work.assigneeId !== filterAssignee) return false;
        return true;
    });

    const getWorkProgress = (workId: string) => {
        const workTasks = tasks.filter(t => t.workId === workId);
        if (workTasks.length === 0) return 0;
        const completed = workTasks.filter(t => t.status === 'completed').length;
        return Math.round((completed / workTasks.length) * 100);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2>Works (업무 단위)</h2>
                    <p className="text-muted-foreground mt-1">
                        태스크를 그룹화하여 관리하고 순차적으로 진행합니다
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline">총 {works.length}개</Badge>
                    <Badge variant="secondary">
                        미배정 {works.filter((w) => !w.assigneeId).length}개
                    </Badge>
                </div>
            </div>

            {/* 필터 */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Filter className="size-4 text-muted-foreground" />
                            <span className="text-sm font-medium">필터:</span>
                        </div>
                        <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v as any)}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="분야" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">전체 분야</SelectItem>
                                <SelectItem value="planning">기획</SelectItem>
                                <SelectItem value="design">디자인</SelectItem>
                                <SelectItem value="frontend">프론트엔드</SelectItem>
                                <SelectItem value="backend">백엔드</SelectItem>
                                <SelectItem value="data">데이터</SelectItem>
                                <SelectItem value="pm">PM</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={filterAssignee} onValueChange={setFilterAssignee}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="담당자" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">전체 담당자</SelectItem>
                                <SelectItem value="unassigned">미배정</SelectItem>
                                {members.map((member) => (
                                    <SelectItem key={member.id} value={member.id}>
                                        {member.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4">
                {filteredWorks.map((work) => {
                    const workTasks = tasks.filter(t => t.workId === work.id);
                    const progress = getWorkProgress(work.id);

                    return (
                        <Card key={work.id} className="overflow-hidden">
                            <CardHeader className="bg-muted/20 pb-4">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline">{getCategoryLabel(work.category)}</Badge>
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <Briefcase className="size-4 text-primary" />
                                                {work.title}
                                            </CardTitle>
                                        </div>
                                        <CardDescription>{work.description || work.objective}</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="text-sm font-medium mb-1">담당자</div>
                                            <Select
                                                value={work.assigneeId || 'unassigned'}
                                                onValueChange={(value) =>
                                                    onWorkUpdate(work.id, {
                                                        assigneeId: value === 'unassigned' ? undefined : value,
                                                    })
                                                }
                                            >
                                                <SelectTrigger className="w-[140px] h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="unassigned">미배정</SelectItem>
                                                    {members.map((member) => (
                                                        <SelectItem key={member.id} value={member.id}>
                                                            {member.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="text-right w-24">
                                            <div className="text-sm font-medium mb-1">진행률</div>
                                            <div className="flex items-center gap-2">
                                                <Progress value={progress} className="h-2 w-full" />
                                                <span className="text-xs text-muted-foreground w-8">{progress}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="tasks" className="border-b-0">
                                        <AccordionTrigger className="px-6 py-3 hover:bg-muted/50 data-[state=open]:bg-muted/50">
                                            <span className="text-sm font-medium">포함된 태스크 ({workTasks.length})</span>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="px-6 py-4 space-y-4 bg-muted/10">
                                                {workTasks.map((task, index) => (
                                                    <div key={task.id} className="flex items-center gap-4 p-3 bg-background rounded-lg border relative">
                                                        {/* 순서 라인 (시각적) */}
                                                        <div className="absolute left-[-20px] top-1/2 w-4 h-px bg-border hidden" />

                                                        <div className="flex items-center justify-center size-6 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                                                            {index + 1}
                                                        </div>

                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className={cn("font-medium", task.status === 'completed' && "line-through text-muted-foreground")}>
                                                                    {task.title}
                                                                </span>
                                                                <Badge variant={task.confidence === 'meeting_based' ? 'secondary' : 'outline'} className="text-[10px]">
                                                                    {task.confidence === 'meeting_based' ? '회의록' : '추론'}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground mt-0.5">{task.description}</p>
                                                        </div>

                                                        <Select
                                                            value={task.status}
                                                            onValueChange={(value) =>
                                                                onTaskUpdate(task.id, { status: value as TaskStatus })
                                                            }
                                                        >
                                                            <SelectTrigger className="w-[110px] h-8">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="not_started">미시작</SelectItem>
                                                                <SelectItem value="in_progress">진행중</SelectItem>
                                                                <SelectItem value="completed">완료</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
