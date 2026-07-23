import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg" | "xl";
  label?: string;
}

const sizeMap = {
  sm: "h-4 w-4",
  default: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

export function LoadingSpinner({
  size = "default",
  label = "Loading...",
  className,
  ...props
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn("flex flex-col items-center justify-center space-y-2 py-4", className)}
      {...props}
    >
      <Loader2 className={cn("animate-spin text-primary", sizeMap[size])} />
      {label && <span className="text-xs text-muted-foreground font-medium">{label}</span>}
    </div>
  );
}
