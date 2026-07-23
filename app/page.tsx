import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  Code2,
  CheckCircle2,
  Sparkles,
  Star,
  Layers,
  Briefcase,
} from "lucide-react";
import { JsonLd, buildOrganizationSchema, buildWebSiteSchema, buildFaqSchema } from "@/components/shared/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://webify-solutions.vercel.app";

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Webify Solutions | Full-Stack Web Development, Courses & Custom Software",
    description:
      "Webify Solutions builds production-ready full-stack web applications and delivers expert Next.js, React, and TypeScript courses. Custom software development starting from $5,000.",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Webify Solutions" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Webify Solutions | Full-Stack Web Development, Courses & Custom Software",
    description:
      "Production-ready full-stack web app development and expert Next.js/React courses for developers and businesses.",
    images: ["/og-default.png"],
  },
};

async function getServices() {
  try {
    const res = await fetch("http://localhost:3000/api/services", { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.slice(0, 4) : [];
  } catch {
    return [];
  }
}

async function getTestimonials() {
  try {
    const res = await fetch("http://localhost:3000/api/testimonials", { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.slice(0, 3) : [];
  } catch {
    return [];
  }
}

async function getPricing() {
  try {
    const res = await fetch("http://localhost:3000/api/pricing", { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.slice(0, 3) : [];
  } catch {
    return [];
  }
}

async function getFaqs() {
  try {
    const res = await fetch("http://localhost:3000/api/faq", { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.slice(0, 5) : [];
  } catch {
    return [];
  }
}

async function getPortfolio() {
  try {
    const res = await fetch("http://localhost:3000/api/portfolio", { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.slice(0, 3) : [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [services, testimonials, pricing, faqs, portfolio] = await Promise.all([
    getServices(),
    getTestimonials(),
    getPricing(),
    getFaqs(),
    getPortfolio(),
  ]);

  // Build FAQ schema only from real data with question-form headings
  const faqSchemaItems = (faqs.length > 0 ? faqs : [
    { question: "What technologies does Webify Solutions use for web development?", answer: "We specialize in React 19, Next.js 14, TypeScript, Node.js, Prisma ORM, and PostgreSQL for modern full-stack web applications." },
    { question: "How long does a custom web development project take?", answer: "Timelines depend on scope. Simple applications take 3–4 weeks, while complex full-stack builds typically span 6–12 weeks." },
  ]).map((faq: any) => ({ question: faq.question, answer: faq.answer }));

  return (
    <>
      <JsonLd data={[buildOrganizationSchema(), buildWebSiteSchema(), buildFaqSchema(faqSchemaItems)]} />
    <div className="space-y-16 sm:space-y-24 py-10 sm:py-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden">
        <Container className="text-center max-w-4xl space-y-6">
          <div className="inline-flex items-center space-x-2 rounded-full border border-border bg-card px-3.5 py-1 text-xs font-medium text-muted-foreground shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Next.js 14 • React 19 • Enterprise Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Engineering Modern Web Apps & High-Impact Tech Training
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Webify Solutions designs production-ready full-stack applications, provides custom enterprise software development, and offers expert courses for developers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/courses" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto flex items-center justify-center space-x-2">
                <span>Explore Courses</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Get in Touch
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* 2. Company Stats Strip */}
      <section className="border-y border-border bg-card/60 py-8">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl font-extrabold tracking-tight text-foreground">50+</div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Projects Delivered</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-extrabold tracking-tight text-foreground">1,200+</div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Students Trained</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-extrabold tracking-tight text-foreground">99.9%</div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">System Reliability</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-extrabold tracking-tight text-foreground">24/7</div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Dedicated Support</div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Services Overview */}
      <section className="space-y-8">
        <Container className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <Badge variant="accent">Services</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Tailored Development Solutions</h2>
            <p className="text-sm text-muted-foreground">
              From MVP builds to enterprise software architecture, we deliver robust solutions crafted with clean code.
            </p>
          </div>

          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service: any) => (
                <Card key={service.id} className="flex flex-col justify-between">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 rounded-md bg-primary/10 text-primary">
                        <Code2 className="h-5 w-5" />
                      </div>
                      {service.priceRange && (
                        <span className="text-xs font-mono text-muted-foreground">{service.priceRange}</span>
                      )}
                    </div>
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{service.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-0 border-t-0">
                    <Link
                      href={`/services/${service.slug}`}
                      className="text-xs font-semibold text-primary inline-flex items-center hover:underline"
                    >
                      Learn more <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="p-2 rounded-md bg-primary/10 text-primary w-fit mb-2">
                    <Code2 className="h-5 w-5" />
                  </div>
                  <CardTitle>Custom Web Development</CardTitle>
                  <CardDescription>
                    We build high-performance web applications tailored to your business needs using React, Next.js, and Node.js.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Link href="/services" className="text-xs font-semibold text-primary inline-flex items-center hover:underline">
                    Learn more <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <div className="p-2 rounded-md bg-primary/10 text-primary w-fit mb-2">
                    <Layers className="h-5 w-5" />
                  </div>
                  <CardTitle>Cloud & API Integration</CardTitle>
                  <CardDescription>
                    Scalable cloud backend solutions, REST & GraphQL APIs, microservices, and database migrations.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Link href="/services" className="text-xs font-semibold text-primary inline-flex items-center hover:underline">
                    Learn more <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </CardFooter>
              </Card>
            </div>
          )}

          <div className="text-center pt-2">
            <Link href="/services">
              <Button variant="outline" size="sm">
                View All Services
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* 4. Tech Stack */}
      <section className="bg-card/40 py-12 border-y border-border">
        <Container className="space-y-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Built with modern industry-standard technologies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-sm font-medium">
            {["Next.js 14", "React 19", "TypeScript", "PostgreSQL", "Prisma ORM", "Tailwind CSS", "Cloudflare", "Stripe", "Docker"].map((tech) => (
              <Badge key={tech} variant="secondary" className="px-3 py-1.5 text-xs font-mono">
                {tech}
              </Badge>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. Portfolio Preview */}
      <section className="space-y-8">
        <Container className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <Badge variant="accent">Case Studies</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Featured Client Work</h2>
            <p className="text-sm text-muted-foreground">
              A sample of digital products and web solutions engineered for client growth.
            </p>
          </div>

          {portfolio.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {portfolio.map((item: any) => (
                <Card key={item.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-xs font-medium text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200">
                      ✓ {item.resultsSummary}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="briefcase"
              title="Portfolio case studies coming soon"
              description="We are currently compiling detailed case studies of our recent full-stack builds."
            />
          )}
        </Container>
      </section>

      {/* 6. Testimonials */}
      <section className="space-y-8">
        <Container className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <Badge variant="accent">Testimonials</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Trusted by Leaders & Developers</h2>
          </div>

          {testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t: any) => (
                <Card key={t.id} className="flex flex-col justify-between">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center space-x-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-foreground italic leading-relaxed">
                      &quot;{t.message}&quot;
                    </p>
                  </CardContent>
                  <CardFooter className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                      {t.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{t.name}</p>
                      <p className="text-[11px] text-muted-foreground">{t.role} {t.company ? `at ${t.company}` : ""}</p>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center space-x-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm italic text-foreground leading-relaxed">
                    &quot;Webify Solutions transformed our web platform. Their expertise and attention to detail are unmatched.&quot;
                  </p>
                  <div className="pt-2">
                    <p className="text-xs font-semibold text-foreground">Sarah Johnson</p>
                    <p className="text-[11px] text-muted-foreground">CEO at TechStart Inc.</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center space-x-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm italic text-foreground leading-relaxed">
                    &quot;The course material on Advanced Next.js patterns was crystal clear and boosted our team production velocity.&quot;
                  </p>
                  <div className="pt-2">
                    <p className="text-xs font-semibold text-foreground">Michael Chen</p>
                    <p className="text-[11px] text-muted-foreground">CTO at DataFlow Systems</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </Container>
      </section>

      {/* 7. Pricing Preview */}
      <section className="space-y-8">
        <Container className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <Badge variant="accent">Pricing</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Flexible Plans for Every Stage</h2>
          </div>

          {pricing.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricing.map((plan: any) => (
                <Card key={plan.id} className={plan.isPopular ? "border-primary shadow-md" : ""}>
                  <CardHeader>
                    {plan.isPopular && <Badge className="w-fit mb-2">Most Popular</Badge>}
                    <CardTitle>{plan.name}</CardTitle>
                    <div className="text-3xl font-extrabold text-foreground pt-2">
                      ${typeof plan.price === "number" ? plan.price.toFixed(2) : plan.price}
                      <span className="text-xs font-normal text-muted-foreground">/{plan.billingCycle}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs">
                    {Array.isArray(plan.features) && plan.features.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Link href="/pricing" className="w-full">
                      <Button variant={plan.isPopular ? "default" : "outline"} className="w-full" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center pt-2">
              <Link href="/pricing">
                <Button variant="outline">View Full Pricing Plans</Button>
              </Link>
            </div>
          )}
        </Container>
      </section>

      {/* 8. FAQ Section */}
      <section className="space-y-8">
        <Container className="max-w-3xl space-y-8">
          <div className="text-center space-y-2">
            <Badge variant="accent">FAQ</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
          </div>

          {faqs.length > 0 ? (
            <Accordion>
              {faqs.map((faq: any, idx: number) => (
                <AccordionItem key={faq.id || idx} defaultOpen={idx === 0}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <Accordion>
              <AccordionItem defaultOpen>
                <AccordionTrigger>What technologies do you use for web development?</AccordionTrigger>
                <AccordionContent>
                  We specialize in modern web technologies including React 19, Next.js 14, TypeScript, Node.js, Prisma ORM, and PostgreSQL.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem>
                <AccordionTrigger>How long does a custom project take?</AccordionTrigger>
                <AccordionContent>
                  Timelines depend on scope. Simple applications take 3-4 weeks, while complex full-stack builds typically span 6-12 weeks.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </Container>
      </section>

      {/* 9. Final CTA Band */}
      <section className="rounded-xl border border-primary/20 bg-primary/5 py-12 px-6 sm:px-12 text-center max-w-5xl mx-auto space-y-4">
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
          Ready to build your next web application?
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
          Get in touch with our team today to discuss custom software development or explore our web development courses.
        </p>
        <div className="pt-2">
          <Link href="/contact">
            <Button size="lg" className="px-8">
              Get Started Now <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
    </>
  );
}
