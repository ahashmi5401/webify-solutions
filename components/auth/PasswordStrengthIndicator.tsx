"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  password?: string;
  className?: string;
}

export function PasswordStrengthIndicator({
  password = "",
  className,
}: PasswordStrengthIndicatorProps) {
  const criteria = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter (A-Z)", met: /[A-Z]/.test(password) },
    { label: "One lowercase letter (a-z)", met: /[a-z]/.test(password) },
    { label: "One number (0-9)", met: /[0-9]/.test(password) },
    { label: "One special character (!@#$%...)", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const metCount = criteria.filter((c) => c.met).length;

  const getStrengthInfo = () => {
    if (metCount === 0) return { label: "", color: "bg-border", width: "w-0" };
    if (metCount <= 2) return { label: "Weak", color: "bg-destructive", width: "w-1/4" };
    if (metCount <= 3) return { label: "Fair", color: "bg-amber-500", width: "w-2/4" };
    if (metCount <= 4) return { label: "Good", color: "bg-indigo-500", width: "w-3/4" };
    return { label: "Strong", color: "bg-emerald-600", width: "w-full" };
  };

  const strength = getStrengthInfo();

  if (!password) return null;

  return (
    <div className={cn("space-y-2.5 pt-1", className)}>
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>Password strength</span>
          <span className={cn("font-semibold", metCount === 5 ? "text-emerald-600" : "text-muted-foreground")}>
            {strength.label}
          </span>
        </div>
        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
          <div
            className={cn("h-full transition-all duration-300 rounded-full", strength.color, strength.width)}
          />
        </div>
      </div>

      {/* Rules Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
        {criteria.map((item, idx) => (
          <div
            key={idx}
            className={cn(
              "flex items-center space-x-1.5 transition-colors",
              item.met ? "text-emerald-600 font-medium" : "text-muted-foreground/70"
            )}
          >
            {item.met ? (
              <Check className="h-3.5 w-3.5 shrink-0" />
            ) : (
              <X className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
            )}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
