"use client";

import * as React from "react";
import { LessonVideoPlayer } from "@/components/shared/LessonVideoPlayer";
import { Badge } from "@/components/ui/badge";

interface LessonContentProps {
  lesson: {
    id: string;
    title: string;
    content?: string;
    videoUrl?: string;
    isFreePreview?: boolean;
  };
  canAccess: boolean;
}

export function LessonContent({ lesson, canAccess }: LessonContentProps) {
  if (!canAccess) {
    return null;
  }

  return (
    <div className="space-y-4 pt-2">
      {lesson.videoUrl && (
        <div className="space-y-2">
          <LessonVideoPlayer videoUrl={lesson.videoUrl} />
        </div>
      )}
      {lesson.content && (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{lesson.content}</p>
        </div>
      )}
    </div>
  );
}
