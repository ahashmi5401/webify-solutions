import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Webify Solutions — Full-Stack Web Development & Courses",
    short_name: "Webify Solutions",
    description:
      "Production-ready full-stack web app development and expert Next.js/React online courses for developers and businesses.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#6366f1",
    orientation: "portrait-primary",
    scope: "/",
    lang: "en",
    categories: ["education", "productivity", "developer tools"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    screenshots: [
      {
        src: "/og-default.png",
        sizes: "1200x630",
        type: "image/png",
      },
    ],
  };
}
