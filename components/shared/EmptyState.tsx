"use client";

import * as React from "react";
import { 
  FolderOpen, 
  Briefcase, 
  Search, 
  FileText, 
  Calendar,
  Users,
  MapPin,
  Clock,
  Heart,
  Zap,
  Shield,
  Building2,
  ArrowRight,
  Layers,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Code2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, React.ElementType> = {
  folder: FolderOpen,
  briefcase: Briefcase,
  search: Search,
  file: FileText,
  calendar: Calendar,
  users: Users,
  mapPin: MapPin,
  clock: Clock,
  heart: Heart,
  zap: Zap,
  shield: Shield,
  building: Building2,
  arrowRight: ArrowRight,
  layers: Layers,
  bookOpen: BookOpen,
  checkCircle2: CheckCircle2,
  sparkles: Sparkles,
  code2: Code2,
};

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: string | React.ElementType;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: iconProp = "folder",
  title = "No results found",
  description = "We couldn't find anything matching your search. Try adjusting your filters.",
  actionLabel,
  onAction,
  className,
  ...props
}: EmptyStateProps) {
  const Icon = typeof iconProp === 'string' ? (iconMap[iconProp] || FolderOpen) : iconProp;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-lg border border-dashed border-border bg-card/50 my-6",
        className
      )}
      {...props}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-foreground tracking-tight">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" size="sm" className="mt-6">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
