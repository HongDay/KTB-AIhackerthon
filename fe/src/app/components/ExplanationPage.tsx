import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RefreshCw, ExternalLink } from 'lucide-react';
import type { ExplanationScript } from '../types';

interface ExplanationPageProps {
  script?: ExplanationScript;
  onSyncToNotion: () => void;
  onRegenerate: () => void;
}

export function ExplanationPage({ script, onSyncToNotion, onRegenerate }: ExplanationPageProps) {
  if (!script) {
    return (
      <div className="space-y-6">
        <div>
          <h2>프로젝트 설명</h2>
          <p className="text-muted-foreground mt-1">
            회의록 기반 프로젝트 설명 스크립트를 확인합니다
          </p>
        </div>

        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                아직 생성된 설명 스크립트가 없습니다
              </p>
              <p className="text-sm text-muted-foreground">
                회의록을 업로드하면 자동으로 설명이 생성됩니다
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2>프로젝트 설명</h2>
          <p className="text-muted-foreground mt-1">
            팀원이 프로젝트를 이해할 수 있도록 작성된 설명입니다
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline">버전 {script.version}</Badge>
          <Button variant="outline" onClick={onRegenerate} className="gap-2">
            <RefreshCw className="size-4" />
            재생성
          </Button>
          <Button onClick={onSyncToNotion} className="gap-2">
            <ExternalLink className="size-4" />
            Notion에 출력
          </Button>
        </div>
      </div>

      {/* 설명 탭 */}
      <Card>
        <CardHeader>
          <CardTitle>설명 스크립트</CardTitle>
          <CardDescription>
            회의록을 분석하여 생성된 프로젝트 이해용 문서
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="purpose" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="purpose">목적/배경</TabsTrigger>
              <TabsTrigger value="scope">범위/제약</TabsTrigger>
              <TabsTrigger value="decisions">결정사항</TabsTrigger>
              <TabsTrigger value="actions">다음 액션</TabsTrigger>
            </TabsList>

            <TabsContent value="purpose" className="mt-6">
              <div className="prose prose-sm max-w-none">
                <h3 className="mb-4">프로젝트의 목적과 배경</h3>
                <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                  {script.content.purpose}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="scope" className="mt-6">
              <div className="prose prose-sm max-w-none">
                <h3 className="mb-4">프로젝트 범위와 제약사항</h3>
                <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                  {script.content.scope}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="decisions" className="mt-6">
              <div className="prose prose-sm max-w-none">
                <h3 className="mb-4">주요 결정사항</h3>
                <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                  {script.content.decisions}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="actions" className="mt-6">
              <div className="prose prose-sm max-w-none">
                <h3 className="mb-4">다음 액션 플랜</h3>
                <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                  {script.content.nextActions}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 미리보기 안내 */}
      <Card className="bg-accent/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <ExternalLink className="size-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">Notion 출력 준비됨</p>
              <p className="text-sm text-muted-foreground mt-1">
                이 설명 스크립트를 Notion 페이지로 출력할 수 있습니다.
                팀원들이 프로젝트를 빠르게 이해할 수 있도록 공유하세요.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={onSyncToNotion}
              >
                지금 Notion에 출력하기
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 메타 정보 */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>
          생성일시:{' '}
          {new Date(script.createdAt).toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
        {script.references && script.references.length > 0 && (
          <span>참조: {script.references.length}개 문서</span>
        )}
      </div>
    </div>
  );
}
