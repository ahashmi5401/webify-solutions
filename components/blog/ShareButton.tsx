"use client";

import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
  url: string;
}

export function ShareButton({ url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-8 w-8 p-0"
      onClick={handleCopy}
      title={copied ? "Copied!" : "Copy link"}
    >
      <Link2 className="h-4 w-4" />
    </Button>
  );
}
