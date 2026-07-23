"use client";

import { EmptyState } from "@/components/shared/EmptyState";

interface CareersEmptyStateProps {
  onAction?: () => void;
}

export function CareersEmptyState({ onAction }: CareersEmptyStateProps) {
  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      window.location.href = '/contact?source=career';
    }
  };

  return (
    <EmptyState
      icon="briefcase"
      title="No open positions"
      description="We don't have any open positions at the moment, but we're always looking for talented people. Check back soon or send us a general inquiry."
      actionLabel="Send General Inquiry"
      onAction={handleAction}
    />
  );
}
