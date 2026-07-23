"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Lock, PlayCircle, ChevronDown } from "lucide-react";
import { LessonContent } from "@/components/courses/LessonContent";
import { cn } from "@/lib/utils";

interface LessonAccordionItemProps {
  lesson: {
    id: string;
    title: string;
    content?: string;
    videoUrl?: string;
    isFreePreview?: boolean;
  };
  canAccess: boolean;
}

export function LessonAccordionItem({ lesson, canAccess }: LessonAccordionItemProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className="border border-border/60 rounded-md bg-card overflow-hidden">
      <button
        onClick={() => canAccess && setIsExpanded(!isExpanded)}
        disabled={!canAccess}
        className={cn(
          "w-full flex items-center justify-between p-2.5 text-xs transition-colors",
          canAccess && "hover:bg-muted/50 cursor-pointer",
          !canAccess && "cursor-not-allowed opacity-70"
        )}
      >
        <div className="flex items-center space-x-2.5">
          {canAccess ? (
            <PlayCircle className="h-4 w-4 text-primary shrink-0" />
          ) : (
            <Lock className="h-4 w-4 text-muted-foreground/60 shrink-0" />
          )}
          <span className="font-medium text-foreground">{lesson.title}</span>
        </div>
        <div className="flex items-center space-x-2">
          {lesson.isFreePreview && (
            <Badge variant="accent" className="text-[10px]">
              Free Preview
            </Badge>
          )}
          {canAccess && (
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform",
                isExpanded && "rotate-180"
              )}
            />
          )}
        </div>
      </button>
      {isExpanded && canAccess && (
        <div className="border-t border-border/60 p-3">
          <LessonContent lesson={lesson} canAccess={canAccess} />
        </div>
      )}
    </div>
  );
}
