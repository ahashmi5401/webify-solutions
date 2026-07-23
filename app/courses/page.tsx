import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { CourseFilters } from "@/components/courses/CourseFilters";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { BookOpen, ChevronLeft, ChevronRight, Layers } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://webify-solutions.vercel.app";

export const metadata: Metadata = {
  title: "Web Development Courses — React, Next.js, TypeScript",
  description:
    "Browse Webify Solutions' library of expert-led web development courses covering React, Next.js 14, TypeScript, and full-stack architecture — from beginner to advanced.",
  alternates: { canonical: `${SITE_URL}/courses` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/courses`,
    title: "Web Development Courses — React, Next.js, TypeScript | Webify Solutions",
    description:
      "Expert-led courses on React, Next.js 14, TypeScript, and full-stack web development from Webify Solutions.",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Webify Solutions Courses" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Development Courses — React, Next.js, TypeScript | Webify Solutions",
    description:
      "Expert-led courses on React, Next.js, and TypeScript full-stack development.",
    images: ["/og-default.png"],
  },
};

interface CoursesPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    category?: string;
    level?: string;
    search?: string;
  }>;
}

async function getCourses(params: {
  page?: string;
  limit?: string;
  category?: string;
  level?: string;
  search?: string;
}) {
  try {
    const { getCourses } = await import('@/lib/data/courses');
    return await getCourses({
      page: params.page ? parseInt(params.page) : 1,
      limit: params.limit ? parseInt(params.limit) : 6,
      category: params.category,
      level: params.level,
      search: params.search,
    });
  } catch {
    return { courses: [], pagination: { page: 1, limit: 6, total: 0, totalPages: 0 } };
  }
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const resolvedParams = await searchParams;
  const { courses, pagination } = await getCourses(resolvedParams);

  const categories = Array.from(new Set(courses.map((c: any) => c.category))).filter(Boolean) as string[];

  const levelVariantMap: Record<string, "success" | "warning" | "destructive" | "outline"> = {
    BEGINNER: "success",
    INTERMEDIATE: "warning",
    ADVANCED: "destructive",
  };

  return (
    <div className="py-10 space-y-8">
      <Container className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <Badge variant="accent">Learning Platform</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Explore Web Development Courses
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Gain production-grade web development skills with step-by-step video courses, code repositories, and hands-on projects.
          </p>
        </div>

        {/* Filter Controls */}
        <CourseFilters categories={categories.length > 0 ? categories : ["Web Development", "Frontend", "Backend"]} />

        {/* Course Cards Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: any) => (
              <Card key={course.id} className="flex flex-col justify-between hover:shadow-md transition-shadow">
                {course.thumbnailUrl ? (
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-secondary">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-secondary flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="accent">{course.category}</Badge>
                    <Badge variant={levelVariantMap[course.level] || "outline"}>
                      {course.level}
                    </Badge>
                  </div>
                  <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-primary shrink-0" />
                    <span>
                      {course.modules?.length || 0} Modules •{" "}
                      {course.modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0) || 0} Lessons
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t border-border/50 pt-4">
                  <span className="text-base sm:text-lg font-bold text-foreground">
                    ${typeof course.price === "number" ? course.price.toFixed(2) : course.price}
                  </span>
                  <Link href={`/courses/${course.slug}`}>
                    <Button size="sm">View Course</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="layers"
            title="No courses found"
            description="No courses match your active search or filter selection. Try clearing filters to see all courses."
          />
        )}

        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border pt-6 mt-8">
            <span className="text-xs text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <div className="flex items-center space-x-2">
              {pagination.page > 1 && (
                <Link
                  href={`/courses?${new URLSearchParams({
                    ...resolvedParams,
                    page: String(pagination.page - 1),
                  }).toString()}`}
                >
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                </Link>
              )}
              {pagination.page < pagination.totalPages && (
                <Link
                  href={`/courses?${new URLSearchParams({
                    ...resolvedParams,
                    page: String(pagination.page + 1),
                  }).toString()}`}
                >
                  <Button variant="outline" size="sm">
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
