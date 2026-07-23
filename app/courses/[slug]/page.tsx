import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Container } from "@/components/shared/Container";
import { EnrollButton } from "@/components/courses/EnrollButton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Lock, PlayCircle, BookOpen, Layers, CheckCircle2, ArrowLeft } from "lucide-react";
import { JsonLd, buildCourseSchema, buildBreadcrumbSchema } from "@/components/shared/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ;

interface CourseDetailProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getCourseBySlug(slug: string) {
  try {
    const res = await fetch(`http://localhost:3000/api/courses/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function getRelatedCourses(category: string, currentSlug: string) {
  try {
    const res = await fetch(`http://localhost:3000/api/courses?category=${encodeURIComponent(category)}&limit=3`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.courses || []).filter((c: any) => c.slug !== currentSlug);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: CourseDetailProps): Promise<Metadata> {
  const resolvedParams = await params;
  const course = await getCourseBySlug(resolvedParams.slug);

  if (!course) {
    return { title: "Course Not Found" };
  }

  const pageUrl = `${SITE_URL}/courses/${course.slug}`;
  const description = `${course.title} — ${course.description?.slice(0, 150)}`.trim();

  return {
    title: course.title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      type: "website",
      url: pageUrl,
      title: `${course.title} | Webify Solutions`,
      description,
      images: course.imageUrl
        ? [{ url: course.imageUrl, width: 1200, height: 630, alt: course.title }]
        : [{ url: "/og-default.png", width: 1200, height: 630, alt: course.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${course.title} | Webify Solutions`,
      description,
      images: [course.imageUrl || "/og-default.png"],
    },
  };
}

export default async function CourseDetailPage({ params }: CourseDetailProps) {
  const resolvedParams = await params;
  const course = await getCourseBySlug(resolvedParams.slug);

  if (!course) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const userId = session?.user ? (session.user as any).id : null;
  const userRole = session?.user ? (session.user as any).role : null;
  const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  const isEnrolled =
    isAdmin ||
    Boolean(
      course.enrollments &&
        course.enrollments.some((e: any) => e.userId === userId && e.status === "ACTIVE")
    );

  const relatedCourses = await getRelatedCourses(course.category, course.slug);

  const levelVariantMap: Record<string, "success" | "warning" | "destructive" | "outline"> = {
    BEGINNER: "success",
    INTERMEDIATE: "warning",
    ADVANCED: "destructive",
  };

  const totalLessons = course.modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0) || 0;

  const courseSchema = buildCourseSchema({
    name: course.title,
    description: course.description,
    slug: course.slug,
    price: course.price,
    currency: "USD",
    imageUrl: course.imageUrl,
    level: course.level,
    rating: course.rating ?? null,
    reviewCount: course.reviewCount ?? null,
  });

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Courses", url: "/courses" },
    { name: course.title, url: `/courses/${course.slug}` },
  ]);

  return (
    <>
      <JsonLd data={[courseSchema, breadcrumbSchema]} />
      <Container className="space-y-8">
        {/* Back Link */}
        <Link href="/courses" className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to all courses
        </Link>

        {/* Header Hero Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant="accent">{course.category}</Badge>
              <Badge variant={levelVariantMap[course.level] || "outline"}>{course.level}</Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              {course.title}
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              {course.description}
            </p>

            <div className="flex items-center space-x-6 text-xs text-muted-foreground pt-2">
              <div className="flex items-center space-x-1.5">
                <Layers className="h-4 w-4 text-primary" />
                <span>{course.modules?.length || 0} Modules</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>{totalLessons} Total Lessons</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Certificate of Completion</span>
              </div>
            </div>
          </div>

          {/* Pricing & Enrollment CTA Box */}
          <Card className="shadow-sm border-primary/20 bg-card">
            <CardHeader>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Course Fee</span>
              <div className="text-3xl font-extrabold text-foreground">
                ${typeof course.price === "number" ? course.price.toFixed(2) : course.price}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <EnrollButton
                courseId={course.id}
                slug={course.slug}
                isEnrolled={isEnrolled}
                price={course.price}
              />
              <p className="text-[11px] text-muted-foreground text-center">
                Full lifetime access • Instant enrollment confirmation
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Curriculum Modules Section */}
        <section className="space-y-4 pt-6">
          <h2 className="text-2xl font-bold tracking-tight border-b border-border pb-3">Course Curriculum</h2>

          {course.modules && course.modules.length > 0 ? (
            <Accordion className="space-y-3">
              {course.modules.map((mod: any, idx: number) => (
                <AccordionItem key={mod.id} defaultOpen={idx === 0}>
                  <AccordionTrigger>
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-sm">Module {mod.order}: {mod.title}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {mod.lessons?.length || 0} Lessons
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-1">
                      {mod.lessons && mod.lessons.length > 0 ? (
                        mod.lessons.map((lesson: any) => {
                          const canAccess = isEnrolled || lesson.isFreePreview || Boolean(lesson.content);
                          return (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-2.5 rounded-md border border-border/60 bg-card text-xs"
                            >
                              <div className="flex items-center space-x-2.5">
                                {canAccess ? (
                                  <PlayCircle className="h-4 w-4 text-primary shrink-0" />
                                ) : (
                                  <Lock className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                                )}
                                <span className="font-medium text-foreground">{lesson.title}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                {lesson.isFreePreview && (
                                  <Badge variant="accent" className="text-[10px]">
                                    Free Preview
                                  </Badge>
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs text-muted-foreground italic">No lessons in this module yet.</p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-sm text-muted-foreground italic">No modules published for this course yet.</p>
          )}
        </section>

        {/* Related Courses Section */}
        {relatedCourses.length > 0 && (
          <section className="space-y-4 pt-10 border-t border-border">
            <h3 className="text-xl font-bold tracking-tight">Related Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedCourses.map((rel: any) => (
                <Card key={rel.id} className="flex flex-col justify-between">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="accent">{rel.category}</Badge>
                      <Badge variant={levelVariantMap[rel.level] || "outline"}>{rel.level}</Badge>
                    </div>
                    <CardTitle className="text-base line-clamp-1">{rel.title}</CardTitle>
                    <CardDescription className="line-clamp-2 text-xs">{rel.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex items-center justify-between border-t border-border/50 pt-3">
                    <span className="text-sm font-bold">${rel.price}</span>
                    <Link href={`/courses/${rel.slug}`}>
                      <Button size="sm" variant="outline">View</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        )}
      </Container>
    </>
  );
}
