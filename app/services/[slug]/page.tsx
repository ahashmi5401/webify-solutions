import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/Container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ArrowLeft, CheckCircle2, ArrowRight, Code2, Layers, Cpu, Clock } from "lucide-react";

interface ServiceDetailProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getServiceBySlug(slug: string) {
  try {
    const res = await fetch(`http://localhost:3000/api/services/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: ServiceDetailProps): Promise<Metadata> {
  const resolvedParams = await params;
  const service = await getServiceBySlug(resolvedParams.slug);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: service.title,
    description: service.description,
    openGraph: {
      title: `${service.title} | Webify Solutions Services`,
      description: service.description,
    },
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailProps) {
  const resolvedParams = await params;
  const service = await getServiceBySlug(resolvedParams.slug);

  if (!service) {
    notFound();
  }

  const features = [
    "Full-stack Architecture & Custom UI Design",
    "Clean, Maintainable & 100% Type-Safe Codebase",
    "Comprehensive Automated Testing & Quality Assurance",
    "Database Migration, Indexing & Optimization",
    "CI/CD Pipeline Setup & Cloud Deployment",
    "Post-Launch Technical Maintenance & SLA Support",
  ];

  const steps = [
    { title: "1. Discovery & Architecture", desc: "We review your requirements, define technical scope, database schemas, and UX wireframes." },
    { title: "2. Sprint Development", desc: "Agile 2-week development sprints with continuous staging deployments and regular progress demos." },
    { title: "3. QA & Security Audit", desc: "Thorough automated testing, security audit, database optimization, and performance tuning." },
    { title: "4. Deployment & Launch", desc: "Smooth production release with zero-downtime deployment, DNS configuration, and analytics setup." },
  ];

  return (
    <div className="py-10 space-y-12">
      <Container className="space-y-8">
        {/* Back Link */}
        <Link href="/services" className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to all services
        </Link>

        {/* Header Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            <Badge variant="accent">Service Offering</Badge>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              {service.title}
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              {service.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2">
              <div className="flex items-center space-x-1.5">
                <Code2 className="h-4 w-4 text-primary" />
                <span>Modern Tech Stack</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Clock className="h-4 w-4 text-primary" />
                <span>Est. Delivery: 4-8 Weeks</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>100% Code Ownership</span>
              </div>
            </div>
          </div>

          {/* Pricing & Contact CTA Box */}
          <Card className="shadow-sm border-primary/20 bg-card">
            <CardHeader className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estimated Investment</span>
              <div className="text-2xl font-extrabold text-foreground font-mono">
                {service.priceRange || "$5,000 - $50,000"}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href={`/contact?service=${service.slug}`} className="w-full">
                <Button size="lg" className="w-full flex items-center justify-center space-x-2">
                  <span>Request Proposal</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <p className="text-[11px] text-muted-foreground text-center">
                Free 30-minute technical consultation & proposal
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features / What's Included */}
        <section className="space-y-4 pt-6">
          <h2 className="text-2xl font-bold tracking-tight border-b border-border pb-3">What&apos;s Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-3.5 rounded-lg border border-border/70 bg-card text-xs sm:text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="font-medium text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Development Process / How it Works */}
        <section className="space-y-4 pt-6">
          <h2 className="text-2xl font-bold tracking-tight border-b border-border pb-3">How We Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((step, idx) => (
              <Card key={idx}>
                <CardHeader className="p-5">
                  <CardTitle className="text-base font-semibold">{step.title}</CardTitle>
                  <p className="text-xs text-muted-foreground leading-relaxed pt-1">{step.desc}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Technologies Used */}
        <section className="space-y-3 pt-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Technologies & Tools</h3>
          <div className="flex flex-wrap gap-2">
            {["Next.js 14", "React 19", "TypeScript", "Node.js", "PostgreSQL", "Prisma", "Tailwind CSS", "Vercel", "Docker"].map((tech) => (
              <Badge key={tech} variant="secondary" className="px-3 py-1 font-mono text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="space-y-4 pt-6">
          <h2 className="text-2xl font-bold tracking-tight border-b border-border pb-3">Frequently Asked Questions</h2>
          <Accordion>
            <AccordionItem defaultOpen>
              <AccordionTrigger>Who owns the intellectual property and code?</AccordionTrigger>
              <AccordionContent>
                You retain 100% intellectual property ownership of all source code, design assets, and database schemas created during the project.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem>
              <AccordionTrigger>Do you provide ongoing support after launch?</AccordionTrigger>
              <AccordionContent>
                Yes, we offer dedicated monthly SLA maintenance packages including bug fixes, security patches, performance monitoring, and feature updates.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Bottom CTA */}
        <section className="rounded-xl border border-primary/20 bg-primary/5 p-8 sm:p-12 text-center space-y-4 mt-12">
          <h3 className="text-2xl font-bold text-foreground">Interested in {service.title}?</h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
            Contact us today to receive a detailed technical quote and project timeline.
          </p>
          <div>
            <Link href={`/contact?service=${service.slug}`}>
              <Button size="lg">
                Contact Us for {service.title} <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </Container>
    </div>
  );
}
