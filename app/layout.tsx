import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Providers } from "./providers";
import { headers } from "next/headers";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://webify-solutions.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Webify Solutions | Full-Stack Web Development, Courses & Custom Software",
    template: "%s | Webify Solutions",
  },
  description:
    "Webify Solutions builds production-ready full-stack web applications and delivers expert Next.js, React, and TypeScript courses. Custom software development starting from $5,000.",
  keywords: [
    "web development",
    "Next.js development",
    "React courses",
    "TypeScript training",
    "full-stack web app",
    "custom software development",
    "online programming courses",
  ],
  authors: [{ name: "Webify Solutions", url: SITE_URL }],
  creator: "Webify Solutions",
  publisher: "Webify Solutions",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Webify Solutions",
    title: "Webify Solutions | Full-Stack Web Development, Courses & Custom Software",
    description:
      "Webify Solutions builds production-ready full-stack web applications and delivers expert Next.js, React, and TypeScript courses. Custom software development starting from $5,000.",
    url: SITE_URL,
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Webify Solutions — Full-Stack Web Development & Courses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Webify Solutions | Full-Stack Web Development, Courses & Custom Software",
    description:
      "Production-ready full-stack web app development and expert Next.js/React courses for developers and businesses.",
    images: ["/og-default.png"],
    creator: "@webifysolutions",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const isAdminRoute = headersList.get('x-is-admin-route') === 'true';

  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
        <Providers>
          {!isAdminRoute && <Navbar />}
          <main className="flex-1 w-full">{children}</main>
          {!isAdminRoute && <Footer />}
        </Providers>
      </body>
    </html>
  );
}
