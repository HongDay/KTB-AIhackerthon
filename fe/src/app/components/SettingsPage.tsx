import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { UserPlus, Check, TriangleAlert } from 'lucide-react';
import type { Member } from '../types';

interface SettingsPageProps {
  members: Member[];
  onAddMember: (member: Omit<Member, 'id'>) => void;
}

export function SettingsPage({ members, onAddMember }: SettingsPageProps) {
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<Member['role']>('frontend');

  const getCategoryLabel = (category: Member['role']) => {
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

  const handleAddMember = () => {
    if (newMemberName.trim()) {
      onAddMember({
        name: newMemberName,
        role: newMemberRole,
        skillLevel: 'mid',
        availableHours: 40,
      });
      setNewMemberName('');
      setNewMemberRole('frontend');
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h2>팀 및 설정</h2>
        <p className="text-muted-foreground mt-1">
          팀원 관리 및 시스템 설정을 관리합니다
        </p>
      </div>

      <Tabs defaultValue="team" className="w-full">
        <TabsList>
          <TabsTrigger value="team">팀원 관리</TabsTrigger>
          <TabsTrigger value="notion">Notion 연결</TabsTrigger>
          <TabsTrigger value="rules">매칭 룰</TabsTrigger>
        </TabsList>

        {/* 팀원 관리 탭 */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>팀원 추가</CardTitle>
              <CardDescription>새로운 팀원을 추가합니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-3">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium">이름</label>
                  <Input
                    placeholder="팀원 이름"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                  />
                </div>
                <div className="w-[200px] space-y-2">
                  <label className="text-sm font-medium">역할</label>
                  <Select value={newMemberRole} onValueChange={(v) => setNewMemberRole(v as Member['role'])}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">기획</SelectItem>
                      <SelectItem value="design">디자인</SelectItem>
                      <SelectItem value="frontend">프론트엔드</SelectItem>
                      <SelectItem value="backend">백엔드</SelectItem>
                      <SelectItem value="data">데이터</SelectItem>
                      <SelectItem value="pm">PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddMember} disabled={!newMemberName.trim()} className="gap-2">
                  <UserPlus className="size-4" />
                  추가
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>팀원 목록</CardTitle>
              <CardDescription>현재 등록된 팀원 {members.length}명</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>역할</TableHead>
                    <TableHead>숙련도</TableHead>
                    <TableHead>가용 시간</TableHead>
                    <TableHead>상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getCategoryLabel(member.role)}</Badge>
                      </TableCell>
                      <TableCell>
                        {member.skillLevel ? (
                          <Badge variant="secondary">{member.skillLevel}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {member.availableHours ? `주 ${member.availableHours}시간` : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className="gap-1">
                          <Check className="size-3" />
                          활성
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notion 연결 탭 */}
        <TabsContent value="notion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notion 워크스페이스 연결</CardTitle>
              <CardDescription>Notion과 동기화하기 위한 연결 설정</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">연결 상태</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    워크스페이스: 우리 팀 프로젝트
                  </p>
                </div>
                <Badge variant="default" className="gap-1.5">
                  <Check className="size-3.5" />
                  연결됨
                </Badge>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">API Token</label>
                <div className="flex gap-2">
                  <Input type="password" value="ntn_••••••••••••••••" disabled />
                  <Button variant="outline">재연결</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  토큰이 만료되었거나 권한 문제가 있는 경우 재연결하세요
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 매칭 룰 탭 */}
        <TabsContent value="rules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>역할 ↔ 분야 매칭 규칙</CardTitle>
              <CardDescription>
                팀원 역할과 태스크 분야를 자동으로 매칭하는 규칙
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { role: '기획', field: '기획 태스크' },
                  { role: '디자인', field: '디자인 태스크' },
                  { role: '프론트엔드', field: '프론트엔드 태스크' },
                  { role: '백엔드', field: '백엔드 태스크' },
                  { role: '데이터', field: '데이터 태스크' },
                  { role: 'PM', field: 'PM 태스크' },
                ].map((rule) => (
                  <div
                    key={rule.role}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{rule.role}</Badge>
                      <span className="text-muted-foreground">→</span>
                      <Badge variant="secondary">{rule.field}</Badge>
                    </div>
                    <Badge variant="default" className="text-xs">
                      우선 배정
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>추론 태스크 처리 정책</CardTitle>
              <CardDescription>
                AI가 추론하여 생성한 태스크의 처리 방법
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Notion 동기화에 포함</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      추론 태스크도 Notion에 동기화합니다
                    </p>
                  </div>
                  <Badge variant="default">활성화</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">추론 태스크 표시</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      추론 태스크에 별도 배지를 표시합니다
                    </p>
                  </div>
                  <Badge variant="default">활성화</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
