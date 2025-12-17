import React from 'react';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  List,
  Users,
  RefreshCw,
  Settings,
} from 'lucide-react';
import { cn } from './ui/utils';
import { Badge } from './ui/badge';

export type PageType =
  | 'home'
  | 'meeting-notes'
  | 'meeting-detail'
  | 'explanation'
  | 'tasks'
  | 'task-groups'
  | 'assignment-inbox'
  | 'assignment-team'
  | 'sync'
  | 'sync-logs'
  | 'team-members'
  | 'settings';

interface SidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  unassignedCount?: number;
  failedCount?: number;
}

interface NavItem {
  id: PageType;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  children?: NavItem[];
}

export function Sidebar({ currentPage, onPageChange, unassignedCount = 0, failedCount = 0 }: SidebarProps) {
  const navItems: NavItem[] = [
    {
      id: 'home',
      label: '홈',
      icon: <LayoutDashboard className="size-5" />,
    },
    {
      id: 'meeting-notes',
      label: '회의록',
      icon: <FileText className="size-5" />,
    },
    {
      id: 'explanation',
      label: '프로젝트 설명',
      icon: <BookOpen className="size-5" />,
    },
    {
      id: 'tasks',
      label: 'Works',
      icon: <List className="size-5" />,
    },
    {
      id: 'assignment-inbox',
      label: '미배정 인박스',
      icon: <Users className="size-5" />,
      badge: unassignedCount,
    },
    {
      id: 'assignment-team',
      label: '팀원별 할당',
      icon: <Users className="size-5" />,
    },
    {
      id: 'sync',
      label: 'Notion 동기화',
      icon: <RefreshCw className="size-5" />,
      badge: failedCount,
    },
    {
      id: 'settings',
      label: '팀/설정',
      icon: <Settings className="size-5" />,
    },
  ];

  return (
    <aside className="w-64 border-r bg-muted/30 flex flex-col">
      <div className="p-6 border-b">
        <h1 className="font-semibold">팀프로젝트 관리</h1>
        <p className="text-muted-foreground text-sm mt-1">온보딩 & 업무분담</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              currentPage === item.id
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground'
            )}
          >
            {item.icon}
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <Badge variant={item.id === 'sync' ? 'destructive' : 'default'} className="ml-auto">
                {item.badge}
              </Badge>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t text-xs text-muted-foreground">
        <p>버전 1.0.0</p>
      </div>
    </aside>
  );
}