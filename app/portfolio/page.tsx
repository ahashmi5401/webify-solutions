import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { Briefcase, ArrowRight, ExternalLink, Layers } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://webify-solutions.vercel.app";

export const metadata: Metadata = {
  title: "Portfolio — Our Work & Case Studies",
  description: "Explore Webify Solutions' portfolio of successful web development projects. Case studies showcasing full-stack applications, e-commerce platforms, and custom software solutions.",
  alternates: { canonical: `${SITE_URL}/portfolio` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/portfolio`,
    title: "Portfolio — Our Work & Case Studies | Webify Solutions",
    description: "Explore our portfolio of successful web development projects and case studies.",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Webify Solutions Portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio — Our Work & Case Studies | Webify Solutions",
    description: "Explore our portfolio of successful web development projects and case studies.",
    images: ["/og-default.png"],
  },
};

async function getPortfolioItems() {
  try {
    const res = await fetch("http://localhost:3000/api/portfolio", { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function PortfolioPage() {
  const portfolioItems = await getPortfolioItems();

  return (
    <div className="py-10 space-y-8">
      <Container className="space-y-8">
        {/* Header */}
        <div className="space-y-2 max-w-3xl">
          <Badge variant="accent">Our Work</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Portfolio & Case Studies
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Explore our portfolio of successful web development projects. From e-commerce platforms to custom SaaS applications, we deliver production-ready solutions that drive business results.
          </p>
        </div>

        {/* Portfolio Grid */}
        {portfolioItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item: any) => (
              <Card key={item.id} className="flex flex-col hover:shadow-md transition-shadow">
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Case Study</Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Briefcase className="h-3.5 w-3.5 mr-1" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <CardTitle className="text-xl line-clamp-1">{item.title}</CardTitle>
                  <CardDescription className="line-clamp-3 leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {item.techUsed && item.techUsed.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.techUsed.slice(0, 4).map((tech: string) => (
                        <Badge key={tech} variant="outline" className="text-[10px] font-mono">
                          {tech}
                        </Badge>
                      ))}
                      {item.techUsed.length > 4 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{item.techUsed.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-0 mt-auto">
                  <Link href={`/portfolio/${item.slug}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full flex items-center justify-center space-x-1.5">
                      <span>View Case Study</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Layers}
            title="No portfolio items published yet"
            description="Our portfolio is being updated with new case studies. Check back soon to see our latest work."
          />
        )}

        {/* CTA */}
        <section className="rounded-xl border border-primary/20 bg-primary/5 p-8 sm:p-12 text-center space-y-4">
          <h3 className="text-2xl font-bold text-foreground">Have a Project in Mind?</h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
            Let's discuss how we can help bring your vision to life with our expertise in full-stack web development.
          </p>
          <div>
            <Link href="/contact">
              <Button size="lg">
                Start a Project <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </Container>
    </div>
  );
}
