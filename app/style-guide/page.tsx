"use client";

import * as React from "react";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Sparkles, BookOpen, Layers, CheckCircle2, ArrowRight, Code2 } from "lucide-react";

export default function StyleGuidePage() {
  const [emptyStateActionCount, setEmptyStateActionCount] = React.useState(0);

  return (
    <div className="py-10 space-y-12">
      {/* Header Section */}
      <section className="border-b border-border pb-8 bg-card/30">
        <Container>
          <div className="flex items-center space-x-2 text-primary font-medium text-sm mb-2">
            <Sparkles className="h-4 w-4" />
            <span>Design System Foundation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Webify Solutions Style Guide
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl text-base leading-relaxed">
            Minimal, modern, Vercel/Stripe-inspired component library powered by Tailwind CSS, Geist Typography, and custom design tokens.
          </p>
        </Container>
      </section>

      <Container className="space-y-16">
        {/* Color Palette Tokens */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight border-b border-border/60 pb-2">1. Color Palette Tokens</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <div className="p-4 rounded-lg border border-border bg-background space-y-1 shadow-2xs">
              <div className="text-xs font-mono text-muted-foreground">#FAFAFA</div>
              <div className="font-semibold text-sm">Background</div>
            </div>
            <div className="p-4 rounded-lg border border-border bg-foreground text-background space-y-1">
              <div className="text-xs font-mono opacity-80">#0A0A0A</div>
              <div className="font-semibold text-sm">Foreground</div>
            </div>
            <div className="p-4 rounded-lg border border-transparent bg-primary text-primary-foreground space-y-1">
              <div className="text-xs font-mono opacity-80">#4F46E5</div>
              <div className="font-semibold text-sm">Primary Accent</div>
            </div>
            <div className="p-4 rounded-lg border border-border bg-secondary text-secondary-foreground space-y-1">
              <div className="text-xs font-mono text-muted-foreground">#F4F4F5</div>
              <div className="font-semibold text-sm">Secondary</div>
            </div>
            <div className="p-4 rounded-lg border border-transparent bg-emerald-100 text-emerald-800 space-y-1">
              <div className="text-xs font-mono opacity-80">#16A34A</div>
              <div className="font-semibold text-sm">Success</div>
            </div>
            <div className="p-4 rounded-lg border border-transparent bg-destructive text-destructive-foreground space-y-1">
              <div className="text-xs font-mono opacity-80">#DC2626</div>
              <div className="font-semibold text-sm">Destructive</div>
            </div>
          </div>
        </section>

        {/* Typography Scale */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight border-b border-border/60 pb-2">2. Typography Scale (Geist Sans & Mono)</h2>
          <div className="space-y-4 rounded-lg border border-border bg-card p-6">
            <div>
              <span className="text-xs font-mono text-muted-foreground block mb-1">H1 Heading (36px / 40px)</span>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Master Full-Stack Web Development
              </h1>
            </div>
            <div>
              <span className="text-xs font-mono text-muted-foreground block mb-1">H2 Heading (28px / 32px)</span>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                Production-Ready Next.js 14 Architecture
              </h2>
            </div>
            <div>
              <span className="text-xs font-mono text-muted-foreground block mb-1">H3 Heading (22px / 26px)</span>
              <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                High Performance Database Solutions
              </h3>
            </div>
            <div>
              <span className="text-xs font-mono text-muted-foreground block mb-1">Body Text (15px / 24px)</span>
              <p className="text-base text-foreground leading-relaxed">
                Build scalable, resilient web applications using React, Next.js App Router, Prisma ORM, and PostgreSQL. Crafted with clean architecture principles.
              </p>
            </div>
            <div>
              <span className="text-xs font-mono text-muted-foreground block mb-1">Code / Monospace (Geist Mono)</span>
              <code className="inline-block rounded bg-muted px-2.5 py-1 font-mono text-xs text-foreground border border-border">
                const session = await getServerSession(authOptions);
              </code>
            </div>
          </div>
        </section>

        {/* Button Variants & Sizes */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight border-b border-border/60 pb-2">3. Button Variants & Sizes</h2>
          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-muted-foreground block">Variants</span>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="default">Primary CTA</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link Button</Button>
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-mono text-muted-foreground block">Sizes</span>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small (sm)</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large (lg)</Button>
                <Button size="icon" aria-label="Icon Button">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Badges */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight border-b border-border/60 pb-2">4. Badge Components</h2>
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-6">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="success">Beginner</Badge>
            <Badge variant="warning">Intermediate</Badge>
            <Badge variant="destructive">Advanced</Badge>
          </div>
        </section>

        {/* Cards */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight border-b border-border/60 pb-2">5. Cards & Surface Elevation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="accent">Web Development</Badge>
                  <Badge variant="success">Beginner</Badge>
                </div>
                <CardTitle>Complete Web Development Bootcamp</CardTitle>
                <CardDescription>
                  Master HTML, CSS, JavaScript, React, and Node.js from scratch with hands-on projects.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span>12 Modules • 48 Lessons</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Includes Certificate of Completion</span>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">$99.99</span>
                <Button size="sm">Enroll Now</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">Service</Badge>
                  <span className="text-xs text-muted-foreground font-mono">$5k - $50k</span>
                </div>
                <CardTitle>Custom Web Application Development</CardTitle>
                <CardDescription>
                  Tailored web apps built with Next.js, TypeScript, PostgreSQL, and modern microservices.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Layers className="h-4 w-4 text-primary" />
                  <span>Full-Stack Architecture & Design</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Code2 className="h-4 w-4 text-primary" />
                  <span>100% Type-Safe Implementation</span>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Estimated delivery: 4-8 weeks</span>
                <Button variant="outline" size="sm">Get Quote</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Inputs & Form Fields */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight border-b border-border/60 pb-2">6. Form Controls & Inputs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border border-border bg-card p-6">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Email Address</label>
              <Input placeholder="name@company.com" type="email" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Search Query</label>
              <Input placeholder="Search courses, articles, or services..." type="search" />
            </div>
          </div>
        </section>

        {/* Skeletons & Loaders */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight border-b border-border/60 pb-2">7. Skeletons & Loading States</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-lg border border-border bg-card p-6">
            <div className="space-y-3">
              <span className="text-xs font-mono text-muted-foreground block">Skeleton UI Cards</span>
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex items-center space-x-3 pt-2">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-20" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <span className="text-xs font-mono text-muted-foreground block">Loading Spinners</span>
              <div className="flex items-center justify-around py-4">
                <LoadingSpinner size="sm" label="Small" />
                <LoadingSpinner size="default" label="Default" />
                <LoadingSpinner size="lg" label="Large" />
              </div>
            </div>
          </div>
        </section>

        {/* Empty State Component */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight border-b border-border/60 pb-2">8. Reusable Empty State Component</h2>
          <EmptyState
            title="No matching courses found"
            description="We couldn't find any course matching your filter criteria. Try clearing search filters."
            actionLabel={`Reset Filters (${emptyStateActionCount})`}
            onAction={() => setEmptyStateActionCount((c) => c + 1)}
          />
        </section>
      </Container>
    </div>
  );
}
