import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Search, Upload, Check, Clock, TriangleAlert } from 'lucide-react';
import type { MeetingNote } from '../types';

interface MeetingNotesPageProps {
  meetingNotes: MeetingNote[];
  onNoteClick: (noteId: string) => void;
  onUpload: (title: string, content: string) => Promise<void>;
}

export function MeetingNotesPage({ meetingNotes, onNoteClick, onUpload }: MeetingNotesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const getStatusConfig = (status: MeetingNote['status']) => {
    const configs = {
      uploaded: { label: '업로드됨', variant: 'secondary' as const, icon: Clock },
      explanation_complete: { label: '설명완료', variant: 'default' as const, icon: Check },
      task_complete: { label: '태스크완료', variant: 'default' as const, icon: Check },
      assignment_complete: { label: '배정완료', variant: 'default' as const, icon: Check },
      sync_complete: { label: '동기화완료', variant: 'default' as const, icon: Check },
      failed: { label: '실패', variant: 'destructive' as const, icon: TriangleAlert },
    };
    return configs[status];
  };

  const filteredNotes = meetingNotes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpload = async () => {
    if (newTitle.trim() && newContent.trim() && !isUploading) {
      setIsUploading(true);
      try {
        await onUpload(newTitle, newContent);
        setNewTitle('');
        setNewContent('');
        setIsUploadOpen(false);
      } catch (error) {
        // 에러는 App.tsx에서 toast로 표시됨
        console.error('Upload error:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2>회의록 관리</h2>
          <p className="text-muted-foreground mt-1">
            업로드된 회의록과 처리 상태를 관리합니다
          </p>
        </div>

        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Upload className="size-4" />
              회의록 업로드
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>새 회의록 업로드</DialogTitle>
              <DialogDescription>
                회의록 내용을 입력하면 자동으로 분석이 시작됩니다
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">제목</label>
                <Input
                  placeholder="예: 2024 Q4 프로젝트 킥오프"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">회의 내용</label>
                <Textarea
                  placeholder="회의록 내용을 붙여넣거나 입력하세요..."
                  className="min-h-[300px]"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsUploadOpen(false)}
                  disabled={isUploading}
                >
                  취소
                </Button>
                <Button 
                  onClick={handleUpload} 
                  disabled={!newTitle.trim() || !newContent.trim() || isUploading}
                >
                  {isUploading ? '업로드 중...' : '업로드 및 분석 시작'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 검색 */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="회의록 제목 검색..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 회의록 리스트 */}
      <Card>
        <CardHeader>
          <CardTitle>회의록 목록</CardTitle>
          <CardDescription>총 {filteredNotes.length}개의 회의록</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery ? '검색 결과가 없습니다' : '아직 회의록이 없습니다'}
              </p>
              {!searchQuery && (
                <Button
                  variant="outline"
                  className="mt-4 gap-2"
                  onClick={() => setIsUploadOpen(true)}
                >
                  <Upload className="size-4" />
                  첫 회의록 업로드하기
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>제목</TableHead>
                  <TableHead>날짜</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>버전</TableHead>
                  <TableHead className="text-right">태스크 수</TableHead>
                  <TableHead className="text-right">미배정</TableHead>
                  <TableHead>최근 동기화</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotes.map((note) => {
                  const statusConfig = getStatusConfig(note.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <TableRow
                      key={note.id}
                      className="cursor-pointer hover:bg-accent/50"
                      onClick={() => onNoteClick(note.id)}
                    >
                      <TableCell className="font-medium">{note.title}</TableCell>
                      <TableCell>
                        {new Date(note.date).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig.variant} className="gap-1.5">
                          <StatusIcon className="size-3" />
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>v{note.version}</TableCell>
                      <TableCell className="text-right">{note.taskCount || 0}</TableCell>
                      <TableCell className="text-right">
                        {note.unassignedCount ? (
                          <Badge variant="destructive">{note.unassignedCount}</Badge>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {note.lastSyncResult && (
                          <Badge
                            variant={
                              note.lastSyncResult === 'success' ? 'default' : 'destructive'
                            }
                          >
                            {note.lastSyncResult === 'success' ? '성공' : '실패'}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
