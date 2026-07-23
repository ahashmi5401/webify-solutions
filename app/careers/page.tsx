import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CareerCard } from "@/components/careers/CareerCard";
import { CareersEmptyState } from "@/components/careers/CareersEmptyState";
import { 
  Zap, 
  Clock, 
  Users, 
  Heart, 
  Shield,
  ArrowRight,
  Building2
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  zap: Zap,
  clock: Clock,
  users: Users,
  heart: Heart,
  shield: Shield,
  building: Building2,
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://webify-solutions.vercel.app";

export const metadata: Metadata = {
  title: "Careers — Join Our Team",
  description: "Explore career opportunities at Webify Solutions. We're looking for talented developers, designers, and engineers to join our growing team. Remote-friendly, competitive benefits.",
  alternates: { canonical: `${SITE_URL}/careers` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/careers`,
    title: "Careers — Join Our Team | Webify Solutions",
    description: "Explore career opportunities at Webify Solutions. Remote-friendly, competitive benefits.",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Careers at Webify Solutions" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers — Join Our Team | Webify Solutions",
    description: "Explore career opportunities at Webify Solutions. Remote-friendly, competitive benefits.",
    images: ["/og-default.png"],
  },
};

export const dynamic = 'force-dynamic';

async function getCareerListings() {
  try {
    const { getCareerListings } = await import('@/lib/data/careers');
    return await getCareerListings();
  } catch {
    return [];
  }
}

const benefits = [
  {
    icon: "zap",
    title: "Competitive Salary",
    description: "Market-leading compensation with regular performance reviews and equity opportunities.",
  },
  {
    icon: "clock",
    title: "Flexible Work",
    description: "Remote-first culture with flexible hours. Work from anywhere in the world.",
  },
  {
    icon: "shield",
    title: "Health Benefits",
    description: "Comprehensive health, dental, and vision insurance for you and your family.",
  },
  {
    icon: "users",
    title: "Learning Budget",
    description: "Annual budget for courses, conferences, books, and tools to help you grow.",
  },
  {
    icon: "heart",
    title: "Unlimited PTO",
    description: "Take the time you need. We trust our team to manage their work-life balance.",
  },
  {
    icon: "building",
    title: "Home Office Stipend",
    description: "Budget for setting up your home office with the equipment you need.",
  },
];

const cultureValues = [
  {
    title: "Ownership",
    description: "We take responsibility for our work and outcomes. Every team member has the autonomy to make decisions.",
  },
  {
    title: "Transparency",
    description: "We share information openly. From company finances to product decisions, nothing is hidden.",
  },
  {
    title: "Excellence",
    description: "We strive for quality in everything we do. Good足够的 is not enough—we aim for exceptional.",
  },
  {
    title: "Growth",
    description: "We believe in continuous learning. We invest in our team's development and career progression.",
  },
];


export default async function CareersPage() {
  const careerListings = await getCareerListings();

  return (
    <div className="py-10 space-y-16">
      <Container className="space-y-12">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <Badge variant="accent">Careers</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Join Our Team
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            We're looking for talented individuals who are passionate about building exceptional software. Join a remote-first team that values excellence, autonomy, and continuous growth.
          </p>
        </div>

        {/* Benefits */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight border-b border-border pb-3">Benefits & Perks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit, idx) => {
              const Icon = iconMap[benefit.icon as keyof typeof iconMap] || Zap;
              return (
                <Card key={idx} className="hover:shadow-md transition-shadow">
                  <CardHeader className="space-y-3">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary w-fit">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base">{benefit.title}</CardTitle>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Culture */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight border-b border-border pb-3">Our Culture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cultureValues.map((value, idx) => (
              <Card key={idx} className="shadow-sm bg-secondary/20">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-base">{value.title}</CardTitle>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Open Positions */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight border-b border-border pb-3">Open Positions</h2>
          {careerListings.length > 0 ? (
            <div className="space-y-4">
              {careerListings.map((listing: any) => (
                <CareerCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <CareersEmptyState />
          )}
        </section>

        {/* Application Process */}
        <section className="space-y-6 max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight border-b border-border pb-3">Application Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div className="text-3xl font-bold text-primary/20 font-mono">01</div>
              <h3 className="text-base font-semibold text-foreground">Apply</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Submit your application through our contact form with your resume and a brief introduction.
              </p>
            </div>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-primary/20 font-mono">02</div>
              <h3 className="text-base font-semibold text-foreground">Screening Call</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A 30-minute call to discuss your background, experience, and interest in the role.
              </p>
            </div>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-primary/20 font-mono">03</div>
              <h3 className="text-base font-semibold text-foreground">Technical Assessment</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A practical coding challenge or technical discussion relevant to the position.
              </p>
            </div>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-primary/20 font-mono">04</div>
              <h3 className="text-base font-semibold text-foreground">Final Interview</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Meet the team and discuss how you can contribute to our mission and culture.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-xl border border-primary/20 bg-primary/5 p-8 sm:p-12 text-center space-y-4">
          <h3 className="text-2xl font-bold text-foreground">Don't See a Role That Fits?</h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
            We're always interested in connecting with talented individuals. Send us a general inquiry and we'll keep you in mind for future opportunities.
          </p>
          <div>
            <Link href="/contact?source=career">
              <Button size="lg">
                Send General Inquiry <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </Container>
    </div>
  );
}
