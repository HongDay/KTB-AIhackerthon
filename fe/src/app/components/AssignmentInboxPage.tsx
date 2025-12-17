import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { CheckCircle, Users, Lightbulb, Briefcase } from 'lucide-react';
import type { Work, Member } from '../types';

interface AssignmentInboxPageProps {
  unassignedWorks: Work[];
  members: Member[];
  onAssign: (workId: string, memberId: string) => void;
}

export function AssignmentInboxPage({
  unassignedWorks,
  members,
  onAssign,
}: AssignmentInboxPageProps) {
  const [selectedAssignments, setSelectedAssignments] = useState<Record<string, string>>({});

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

  const getRecommendedMember = (work: Work): Member | undefined => {
    // Work 분야와 일치하는 멤버 찾기
    return members.find((m) => m.role === work.category);
  };

  const handleAssignmentChange = (workId: string, memberId: string) => {
    setSelectedAssignments({
      ...selectedAssignments,
      [workId]: memberId,
    });
  };

  const handleConfirmAssignment = (workId: string) => {
    const memberId = selectedAssignments[workId];
    if (memberId) {
      onAssign(workId, memberId);
      const newAssignments = { ...selectedAssignments };
      delete newAssignments[workId];
      setSelectedAssignments(newAssignments);
    }
  };

  const handleBatchAssign = () => {
    Object.entries(selectedAssignments).forEach(([workId, memberId]) => {
      onAssign(workId, memberId);
    });
    setSelectedAssignments({});
  };

  const canBatchAssign = Object.keys(selectedAssignments).length > 0;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2>미배정 인박스 (Works)</h2>
          <p className="text-muted-foreground mt-1">
            담당자를 지정해야 할 Work(업무)들입니다
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="destructive" className="gap-1.5">
            <Users className="size-3.5" />
            {unassignedWorks.length}개 미배정
          </Badge>
          {canBatchAssign && (
            <Button onClick={handleBatchAssign} className="gap-2">
              <CheckCircle className="size-4" />
              선택한 {Object.keys(selectedAssignments).length}개 일괄 배정
            </Button>
          )}
        </div>
      </div>

      {/* 미배정 Work 목록 */}
      {unassignedWorks.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-2">
              <CheckCircle className="size-12 text-green-600 mx-auto" />
              <h3 className="font-semibold">모든 Work가 배정되었습니다!</h3>
              <p className="text-sm text-muted-foreground">
                현재 미배정 Work가 없습니다.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {unassignedWorks.map((work) => {
            const recommendedMember = getRecommendedMember(work);
            const selectedMemberId = selectedAssignments[work.id];

            return (
              <Card key={work.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{getCategoryLabel(work.category)}</Badge>
                        <Badge variant="secondary" className="text-xs">
                          {work.taskCount} tasks
                        </Badge>
                      </div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Briefcase className="size-5 text-muted-foreground" />
                        {work.title}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {work.description || work.objective}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* 추천 */}
                  {recommendedMember && (
                    <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-lg">
                      <Lightbulb className="size-4 text-amber-600" />
                      <span className="text-sm">
                        추천: <span className="font-medium">{recommendedMember.name}</span>
                        <span className="text-muted-foreground ml-2">
                          (역할: {getCategoryLabel(recommendedMember.role)})
                        </span>
                      </span>
                    </div>
                  )}

                  {/* 담당자 선택 */}
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium whitespace-nowrap">
                      담당자 지정:
                    </label>
                    <Select
                      value={selectedMemberId || ''}
                      onValueChange={(value) => handleAssignmentChange(work.id, value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="담당자를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name} - {getCategoryLabel(member.role)}
                            {member.skillLevel && (
                              <span className="text-muted-foreground ml-2">
                                ({member.skillLevel})
                              </span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => handleConfirmAssignment(work.id)}
                      disabled={!selectedMemberId}
                      className="gap-2"
                    >
                      <CheckCircle className="size-4" />
                      확정
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
