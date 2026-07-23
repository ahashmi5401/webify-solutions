import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonLd, buildOrganizationSchema, buildBreadcrumbSchema } from "@/components/shared/JsonLd";
import { 
  Heart, 
  Target, 
  Lightbulb, 
  Users, 
  Zap, 
  Shield, 
  ArrowRight,
  CheckCircle2,
  Clock,
  Globe
} from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://webify-solutions.vercel.app";

export const metadata: Metadata = {
  title: "About Us — Webify Solutions",
  description: "Learn about Webify Solutions' mission to democratize web development education and deliver production-ready software engineering services for businesses worldwide.",
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/about`,
    title: "About Us — Webify Solutions",
    description: "Our mission to democratize web development education and deliver production-ready software engineering services.",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "About Webify Solutions" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us — Webify Solutions",
    description: "Our mission to democratize web development education and deliver production-ready software engineering services.",
    images: ["/og-default.png"],
  },
};

const values = [
  {
    icon: Heart,
    title: "Quality First",
    description: "We never compromise on code quality, security, or performance. Every line of code we write is production-ready and maintainable.",
  },
  {
    icon: Target,
    title: "Results-Driven",
    description: "We focus on delivering measurable business outcomes—faster load times, higher conversion rates, and scalable architectures.",
  },
  {
    icon: Lightbulb,
    title: "Continuous Learning",
    description: "The web evolves rapidly. We stay ahead by continuously learning and adopting the latest technologies and best practices.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "We work as partners with our clients and students, ensuring transparent communication and shared success.",
  },
  {
    icon: Zap,
    title: "Efficiency",
    description: "We value your time and resources. We deliver fast without cutting corners, using modern tools and proven methodologies.",
  },
  {
    icon: Shield,
    title: "Integrity",
    description: "We believe in honest pricing, clear timelines, and full ownership. No hidden fees, no vendor lock-in, no surprises.",
  },
];

const team = [
  {
    name: "Ahmed Hassan",
    role: "Founder & Lead Engineer",
    bio: "Full-stack developer with 8+ years building scalable web applications. Previously at tech startups and agencies.",
  },
  {
    name: "Sarah Khan",
    role: "Head of Education",
    bio: "Former senior developer at Fortune 500 companies. Passionate about making complex concepts accessible to everyone.",
  },
  {
    name: "Michael Chen",
    role: "Senior Frontend Engineer",
    bio: "React and Next.js specialist. Contributor to open-source projects and speaker at developer conferences.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Discovery",
    description: "We understand your goals, requirements, and constraints to create a clear project roadmap.",
  },
  {
    step: "02",
    title: "Planning",
    description: "We design the architecture, database schema, and technical specifications before writing any code.",
  },
  {
    step: "03",
    title: "Development",
    description: "We build in agile sprints with regular demos, ensuring you see progress every step of the way.",
  },
  {
    step: "04",
    title: "Delivery",
    description: "We deploy to production, provide documentation, and ensure a smooth handoff with full code ownership.",
  },
];

export default async function AboutPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
  ]);

  return (
    <>
      <JsonLd data={[buildOrganizationSchema(), breadcrumbSchema]} />
      
      <div className="py-10 space-y-16">
        <Container className="space-y-12">
          {/* Header */}
          <div className="space-y-4 max-w-3xl">
            <Badge variant="accent">Our Story</Badge>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Building the Future of Web Development
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Webify Solutions was founded with a simple mission: to bridge the gap between theoretical knowledge and production-ready web development skills. We believe that everyone deserves access to high-quality technical education and that businesses deserve software that works.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-sm border-primary/20 bg-primary/5">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Target className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl">Our Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  To democratize web development education by providing practical, project-based learning experiences that prepare students for real-world challenges, while delivering exceptional software engineering services that help businesses scale.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-primary/20 bg-primary/5">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Globe className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl">Our Vision</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  To become the most trusted platform for web development education and custom software solutions, known for quality, integrity, and measurable results. We envision a world where technical skills are accessible to all and businesses can build software with confidence.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Core Values */}
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight border-b border-border pb-3">Core Values</h2>
              <p className="text-sm text-muted-foreground">The principles that guide everything we do.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {values.map((value, idx) => (
                <Card key={idx} className="hover:shadow-md transition-shadow">
                  <CardHeader className="space-y-3">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary w-fit">
                      <value.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>

          {/* Team */}
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight border-b border-border pb-3">Our Team</h2>
              <p className="text-sm text-muted-foreground">The people behind Webify Solutions.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {team.map((member, idx) => (
                <Card key={idx} className="hover:shadow-md transition-shadow">
                  <CardHeader className="space-y-3">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-xl">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <p className="text-xs text-primary font-medium mt-1">{member.role}</p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {member.bio}
                    </p>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>

          {/* Our Process */}
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight border-b border-border pb-3">How We Work</h2>
              <p className="text-sm text-muted-foreground">Our proven process for delivering exceptional results.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((item: any, idx: number) => (
                <div key={idx} className="space-y-3">
                  <div className="text-4xl font-bold text-primary/20 font-mono">{item.step}</div>
                  <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight border-b border-border pb-3">Why Choose Webify Solutions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Production-Ready Code</p>
                  <p className="text-xs text-muted-foreground">Every project follows industry best practices with clean, maintainable, and scalable code.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Full Ownership</p>
                  <p className="text-xs text-muted-foreground">You retain 100% intellectual property. No vendor lock-in, no hidden dependencies.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Transparent Communication</p>
                  <p className="text-xs text-muted-foreground">Regular updates, clear timelines, and honest feedback throughout the project.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Multi-Technology Expertise</p>
                  <p className="text-xs text-muted-foreground">We work across multiple technologies including Java Spring Boot, React 19, Next.js 14, TypeScript, Python, Node.js, PostgreSQL, and cloud platforms like AWS.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">On-Time Delivery</p>
                  <p className="text-xs text-muted-foreground">We respect deadlines. Agile sprints ensure consistent progress and predictable timelines.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Security First</p>
                  <p className="text-xs text-muted-foreground">Security audits, best practices, and compliance built into every project from day one.</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-xl border border-primary/20 bg-primary/5 p-8 sm:p-12 text-center space-y-4">
            <h3 className="text-2xl font-bold text-foreground">Ready to Work Together?</h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
              Whether you're looking to learn web development or need a custom software solution, we're here to help.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/contact">
                <Button size="lg">
                  Get in Touch <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline">
                  Explore Courses
                </Button>
              </Link>
            </div>
          </section>
        </Container>
      </div>
    </>
  );
}
