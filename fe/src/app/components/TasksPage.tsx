import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Search, Filter, GitBranch } from 'lucide-react';
import type { Task, Member, TaskGroup, TaskCategory, TaskStatus } from '../types';

interface TasksPageProps {
  tasks: Task[];
  members: Member[];
  taskGroups: TaskGroup[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
}

export function TasksPage({ tasks, members, taskGroups, onTaskUpdate }: TasksPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<TaskCategory | 'all'>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [showUnassignedOnly, setShowUnassignedOnly] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

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

  const getStatusLabel = (status: TaskStatus) => {
    const labels = {
      not_started: '진행 전',
      in_progress: '진행 중',
      completed: '완료',
    };
    return labels[status];
  };

  const getStatusVariant = (status: TaskStatus) => {
    const variants = {
      not_started: 'secondary' as const,
      in_progress: 'default' as const,
      completed: 'outline' as const,
    };
    return variants[status];
  };

  const filteredTasks = tasks.filter((task) => {
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filterCategory !== 'all' && task.category !== filterCategory) {
      return false;
    }
    if (filterAssignee !== 'all' && task.assigneeId !== filterAssignee) {
      return false;
    }
    if (filterStatus !== 'all' && task.status !== filterStatus) {
      return false;
    }
    if (showUnassignedOnly && task.assigneeId) {
      return false;
    }
    return true;
  });

  const toggleTaskSelection = (taskId: string) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const getGroupName = (groupId: string) => {
    const group = taskGroups.find((g) => g.id === groupId);
    return group?.name || '그룹 없음';
  };

  const getMemberName = (memberId?: string) => {
    if (!memberId) return '미배정';
    const member = members.find((m) => m.id === memberId);
    return member?.name || '미배정';
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2>전체 태스크</h2>
          <p className="text-muted-foreground mt-1">
            생성된 태스크를 관리하고 검색합니다
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">총 {tasks.length}개</Badge>
          <Badge variant="secondary">
            미배정 {tasks.filter((t) => !t.assigneeId).length}개
          </Badge>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* 검색 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="태스크 이름 검색..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* 필터들 */}
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
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 상태</SelectItem>
                  <SelectItem value="not_started">미시작</SelectItem>
                  <SelectItem value="in_progress">진행중</SelectItem>
                  <SelectItem value="completed">완료</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="unassigned-only"
                  checked={showUnassignedOnly}
                  onCheckedChange={(checked) => setShowUnassignedOnly(checked as boolean)}
                />
                <label htmlFor="unassigned-only" className="text-sm cursor-pointer">
                  미배정만 보기
                </label>
              </div>

              {(searchQuery || filterCategory !== 'all' || filterAssignee !== 'all' || filterStatus !== 'all' || showUnassignedOnly) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterCategory('all');
                    setFilterAssignee('all');
                    setFilterStatus('all');
                    setShowUnassignedOnly(false);
                  }}
                >
                  필터 초기화
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 태스크 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>태스크 목록</CardTitle>
          <CardDescription>
            {filteredTasks.length}개의 태스크
            {selectedTasks.size > 0 && ` (${selectedTasks.size}개 선택됨)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">태스크가 없습니다</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead>태스크명</TableHead>
                  <TableHead>분야</TableHead>
                  <TableHead>그룹</TableHead>
                  <TableHead>담당자</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>신뢰도</TableHead>
                  <TableHead className="w-12">의존</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedTasks.has(task.id)}
                        onCheckedChange={() => toggleTaskSelection(task.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{getCategoryLabel(task.category)}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {getGroupName(task.groupId)}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={task.assigneeId || 'unassigned'}
                        onValueChange={(value) =>
                          onTaskUpdate(task.id, {
                            assigneeId: value === 'unassigned' ? undefined : value,
                          })
                        }
                      >
                        <SelectTrigger className="w-[130px]">
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
                    </TableCell>
                    <TableCell>
                      <Select
                        value={task.status}
                        onValueChange={(value) =>
                          onTaskUpdate(task.id, { status: value as TaskStatus })
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not_started">미시작</SelectItem>
                          <SelectItem value="in_progress">진행중</SelectItem>
                          <SelectItem value="completed">완료</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={task.confidence === 'meeting_based' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {task.confidence === 'meeting_based' ? '회의록' : '추론'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {(task.dependencies.length > 0 || task.prerequisites.length > 0) && (
                        <GitBranch className="size-4 text-muted-foreground" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
