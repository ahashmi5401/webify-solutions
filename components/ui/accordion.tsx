"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemContextProps {
  isOpen: boolean;
  toggle: () => void;
}

const AccordionItemContext = React.createContext<AccordionItemContextProps>({
  isOpen: false,
  toggle: () => {},
});

export function Accordion({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("divide-y divide-border rounded-lg border border-border bg-card", className)}>{children}</div>;
}

export function AccordionItem({
  children,
  defaultOpen = false,
  className,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <AccordionItemContext.Provider value={{ isOpen, toggle }}>
      <div className={cn("transition-colors", className)}>{children}</div>
    </AccordionItemContext.Provider>
  );
}

export function AccordionTrigger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isOpen, toggle } = React.useContext(AccordionItemContext);

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "flex w-full items-center justify-between p-4 text-left font-medium text-foreground transition-all hover:bg-secondary/50 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring text-sm sm:text-base",
        className
      )}
    >
      <span>{children}</span>
      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ml-2",
          isOpen && "rotate-180 text-foreground"
        )}
      />
    </button>
  );
}

export function AccordionContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isOpen } = React.useContext(AccordionItemContext);

  if (!isOpen) return null;

  return (
    <div className={cn("p-4 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border/40 bg-secondary/20", className)}>
      {children}
    </div>
  );
}
