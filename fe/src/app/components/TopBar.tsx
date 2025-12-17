import React from 'react';
import { Upload, RefreshCw, Check, Clock, TriangleAlert, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';

interface TopBarProps {
  projectName?: string;
  syncStatus?: 'success' | 'pending' | 'warning';
  lastSyncTime?: string;
  onUploadClick: () => void;
  onSyncClick: () => void;
}

export function TopBar({
  projectName = '2024 Q4 신규 프로젝트',
  syncStatus = 'success',
  lastSyncTime = '방금 전',
  onUploadClick,
  onSyncClick,
}: TopBarProps) {
  const statusConfig = {
    success: { icon: Check, variant: 'default' as const, label: '동기화 완료' },
    pending: { icon: Clock, variant: 'secondary' as const, label: '처리 중' },
    warning: { icon: TriangleAlert, variant: 'destructive' as const, label: '실패' },
  };

  const config = statusConfig[syncStatus];
  const StatusIcon = config.icon;

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6">
      {/* 왼쪽: 프로젝트 선택 */}
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              {projectName}
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>2024 Q4 신규 프로젝트</DropdownMenuItem>
            <DropdownMenuItem>디자인 시스템 수립</DropdownMenuItem>
            <DropdownMenuItem>+ 새 프로젝트</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Badge variant={config.variant} className="gap-1.5">
          <StatusIcon className="size-3.5" />
          {config.label}
        </Badge>

        <span className="text-sm text-muted-foreground">
          마지막 동기화: {lastSyncTime}
        </span>
      </div>

      {/* 오른쪽: 퀵액션 + 프로필 */}
      <div className="flex items-center gap-3">
        <Button onClick={onUploadClick} variant="outline" size="sm" className="gap-2">
          <Upload className="size-4" />
          회의록 업로드
        </Button>

        <Button onClick={onSyncClick} size="sm" className="gap-2">
          <RefreshCw className="size-4" />
          Notion 동기화
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="size-8">
                <AvatarFallback>김</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>프로필</DropdownMenuItem>
            <DropdownMenuItem>설정</DropdownMenuItem>
            <DropdownMenuItem>로그아웃</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
