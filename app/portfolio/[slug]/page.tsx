import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/Container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonLd, buildBreadcrumbSchema } from "@/components/shared/JsonLd";
import { 
  ArrowLeft, 
  ExternalLink, 
  TrendingUp, 
  Users, 
  Clock,
  CheckCircle2,
  Code2,
  Layers,
  Quote
} from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://webify-solutions.vercel.app";

interface PortfolioDetailProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getPortfolioBySlug(slug: string) {
  try {
    const res = await fetch(`http://localhost:3000/api/portfolio/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function getRelatedPortfolioItems(currentSlug: string) {
  try {
    const res = await fetch("http://localhost:3000/api/portfolio", { cache: "no-store" });
    if (!res.ok) return [];
    const items = await res.json();
    return items.filter((item: any) => item.slug !== currentSlug).slice(0, 3);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PortfolioDetailProps): Promise<Metadata> {
  const resolvedParams = await params;
  const portfolio = await getPortfolioBySlug(resolvedParams.slug);

  if (!portfolio) {
    return {
      title: "Portfolio Item Not Found",
    };
  }

  return {
    title: portfolio.title,
    description: portfolio.description,
    alternates: { canonical: `${SITE_URL}/portfolio/${portfolio.slug}` },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/portfolio/${portfolio.slug}`,
      title: `${portfolio.title} | Webify Solutions Portfolio`,
      description: portfolio.description,
      images: [{ url: "/og-default.png", width: 1200, height: 630, alt: portfolio.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${portfolio.title} | Webify Solutions Portfolio`,
      description: portfolio.description,
      images: ["/og-default.png"],
    },
  };
}

function buildCreativeWorkSchema(item: any) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: item.title,
    description: item.description,
    url: `${SITE_URL}/portfolio/${item.slug}`,
    creator: {
      "@type": "Organization",
      name: "Webify Solutions",
      url: SITE_URL,
    },
    dateCreated: item.createdAt,
    dateModified: item.updatedAt,
    keywords: item.techUsed?.join(", ") || "",
  };
}

export default async function PortfolioDetailPage({ params }: PortfolioDetailProps) {
  const resolvedParams = await params;
  const portfolio = await getPortfolioBySlug(resolvedParams.slug);

  if (!portfolio) {
    notFound();
  }

  const relatedItems = await getRelatedPortfolioItems(portfolio.slug);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Portfolio", url: "/portfolio" },
    { name: portfolio.title, url: `/portfolio/${portfolio.slug}` },
  ]);

  const creativeWorkSchema = buildCreativeWorkSchema(portfolio);

  return (
    <>
      <JsonLd data={[creativeWorkSchema, breadcrumbSchema]} />
      
      <div className="py-10 space-y-12">
        <Container className="space-y-8">
          {/* Back Link */}
          <Link href="/portfolio" className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to portfolio
          </Link>

          {/* Header */}
          <div className="space-y-4 max-w-4xl">
            <Badge variant="accent">Case Study</Badge>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              {portfolio.title}
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              {portfolio.description}
            </p>

            {portfolio.techUsed && portfolio.techUsed.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {portfolio.techUsed.map((tech: string) => (
                  <Badge key={tech} variant="secondary" className="font-mono text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Results Summary */}
          {portfolio.resultsSummary && (
            <section className="max-w-4xl space-y-6">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                  Results & Impact
                </h2>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p className="leading-relaxed whitespace-pre-line">
                    {portfolio.resultsSummary}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Project Details */}
          <section className="max-w-4xl space-y-6">
            <h2 className="text-2xl font-bold tracking-tight border-b border-border pb-3">Project Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="space-y-2">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs uppercase tracking-wider">Timeline</span>
                  </div>
                  <CardTitle className="text-base">8-12 Weeks</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Typical project duration from discovery to deployment
                  </p>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="space-y-2">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="text-xs uppercase tracking-wider">Team Size</span>
                  </div>
                  <CardTitle className="text-base">3-5 Engineers</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Cross-functional team including frontend, backend, and DevOps
                  </p>
                </CardHeader>
              </Card>
            </div>
          </section>

          {/* Key Features */}
          <section className="max-w-4xl space-y-6">
            <h2 className="text-2xl font-bold tracking-tight border-b border-border pb-3">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "Responsive design optimized for all devices",
                "Real-time data synchronization",
                "Advanced search and filtering capabilities",
                "Secure authentication and authorization",
                "Performance optimization and caching",
                "Comprehensive analytics dashboard",
                "SEO-friendly architecture",
                "Scalable database design",
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-3 rounded-lg border border-border/70 bg-card text-xs sm:text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Client Testimonial */}
          {portfolio.clientTestimonial && (
            <section className="max-w-4xl space-y-6">
              <h2 className="text-2xl font-bold tracking-tight border-b border-border pb-3">Client Testimonial</h2>
              <Card className="shadow-sm bg-secondary/20">
                <CardContent className="p-6 space-y-4">
                  <Quote className="h-8 w-8 text-primary/30" />
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed italic">
                    {portfolio.clientTestimonial}
                  </p>
                  <div className="flex items-center space-x-3 pt-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-sm">
                      CL
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Client</p>
                      <p className="text-xs text-muted-foreground">Project Partner</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Technologies Used */}
          <section className="max-w-4xl space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Technology Stack</h3>
            <div className="flex flex-wrap gap-2">
              {portfolio.techUsed?.map((tech: string) => (
                <Badge key={tech} variant="outline" className="px-3 py-1.5 font-mono text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-xl border border-primary/20 bg-primary/5 p-8 sm:p-12 text-center space-y-4 max-w-4xl">
            <h3 className="text-2xl font-bold text-foreground">Build Something Similar?</h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
              We can help you build a custom solution tailored to your business needs. Let's discuss your project.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/contact">
                <Button size="lg">
                  Start a Project <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline">
                  View Services
                </Button>
              </Link>
            </div>
          </section>

          {/* Related Projects */}
          {relatedItems.length > 0 && (
            <section className="space-y-6 max-w-4xl">
              <h2 className="text-2xl font-bold tracking-tight border-b border-border pb-3">Related Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedItems.map((item: any) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="space-y-2">
                      <Badge variant="secondary" className="w-fit text-xs">Case Study</Badge>
                      <CardTitle className="text-base line-clamp-1">{item.title}</CardTitle>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Link href={`/portfolio/${item.slug}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </Container>
      </div>
    </>
  );
}
