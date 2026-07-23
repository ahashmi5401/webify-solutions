import * as React from "react";
import { cn } from "@/lib/utils";

interface LessonVideoPlayerProps {
  videoUrl: string;
  className?: string;
}

export function LessonVideoPlayer({ videoUrl, className }: LessonVideoPlayerProps) {
  const videoType = detectVideoType(videoUrl);

  if (videoType === "youtube") {
    const videoId = extractYouTubeId(videoUrl);
    if (!videoId) {
      return <VideoFallback url={videoUrl} />;
    }
    return (
      <div className={cn("relative w-full aspect-video rounded-lg overflow-hidden bg-black", className)}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  if (videoType === "vimeo") {
    const videoId = extractVimeoId(videoUrl);
    if (!videoId) {
      return <VideoFallback url={videoUrl} />;
    }
    return (
      <div className={cn("relative w-full aspect-video rounded-lg overflow-hidden bg-black", className)}>
        <iframe
          src={`https://player.vimeo.com/video/${videoId}`}
          title="Vimeo video player"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  if (videoType === "direct") {
    return (
      <div className={cn("relative w-full aspect-video rounded-lg overflow-hidden bg-black", className)}>
        <video
          controls
          className="w-full h-full"
          preload="metadata"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return <VideoFallback url={videoUrl} />;
}

function detectVideoType(url: string): "youtube" | "vimeo" | "direct" | "unknown" {
  const normalizedUrl = url.toLowerCase();

  // YouTube patterns
  if (
    normalizedUrl.includes("youtube.com/watch") ||
    normalizedUrl.includes("youtu.be/") ||
    normalizedUrl.includes("youtube.com/embed/")
  ) {
    return "youtube";
  }

  // Vimeo patterns
  if (
    normalizedUrl.includes("vimeo.com/") &&
    !normalizedUrl.includes("/review/")
  ) {
    return "vimeo";
  }

  // Direct video file patterns
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"];
  if (videoExtensions.some(ext => normalizedUrl.endsWith(ext))) {
    return "direct";
  }

  return "unknown";
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

function extractVimeoId(url: string): string | null {
  const pattern = /vimeo\.com\/(\d+)/;
  const match = url.match(pattern);
  return match ? match[1] : null;
}

function VideoFallback({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center w-full aspect-video rounded-lg border border-border bg-muted/20 hover:bg-muted/30 transition-colors text-sm text-foreground"
    >
      Watch video
    </a>
  );
}
