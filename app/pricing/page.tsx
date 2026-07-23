import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { JsonLd, buildFaqSchema, buildBreadcrumbSchema } from "@/components/shared/JsonLd";
import { CheckCircle2, ArrowRight, HelpCircle, CreditCard, Zap, Shield } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://webify-solutions.vercel.app";

export const metadata: Metadata = {
  title: "Pricing — Transparent Plans for Every Need",
  description: "Simple, transparent pricing for web development courses and custom software services. No hidden fees, no long-term contracts. Choose the plan that fits your goals.",
  alternates: { canonical: `${SITE_URL}/pricing` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/pricing`,
    title: "Pricing — Transparent Plans for Every Need | Webify Solutions",
    description: "Simple, transparent pricing for web development courses and custom software services.",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Webify Solutions Pricing" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — Transparent Plans for Every Need | Webify Solutions",
    description: "Simple, transparent pricing for web development courses and custom software services.",
    images: ["/og-default.png"],
  },
};

async function getPricingPlans() {
  try {
    const res = await fetch("http://localhost:3000/api/pricing", { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function getFAQs() {
  try {
    const res = await fetch("http://localhost:3000/api/faq?category=pricing", { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function PricingPage() {
  const pricingPlans = await getPricingPlans();
  const faqs = await getFAQs();

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Pricing", url: "/pricing" },
  ]);

  const faqSchema = buildFaqSchema(
    faqs.length > 0 
      ? faqs.map((f: any) => ({ question: f.question, answer: f.answer }))
      : [
          { question: "What payment methods do you accept?", answer: "We accept all major credit cards, PayPal, and bank transfers for enterprise clients." },
          { question: "Can I cancel my subscription anytime?", answer: "Yes, you can cancel your subscription at any time. No long-term contracts or cancellation fees." },
          { question: "Do you offer refunds?", answer: "We offer a 14-day money-back guarantee for all courses. For custom services, refund terms are outlined in your project agreement." },
          { question: "Are there any hidden fees?", answer: "No. All pricing is transparent and upfront. The price you see is the price you pay." },
        ]
  );

  return (
    <>
      <JsonLd data={[faqSchema, breadcrumbSchema]} />
      
      <div className="py-10 space-y-16">
        <Container className="space-y-12">
          {/* Header */}
          <div className="space-y-4 max-w-3xl text-center">
            <Badge variant="accent">Pricing</Badge>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Simple, Transparent Pricing
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Choose the plan that fits your needs. No hidden fees, no long-term contracts, and 100% satisfaction guaranteed.
            </p>
          </div>

          {/* Pricing Cards */}
          {pricingPlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {pricingPlans.map((plan: any) => (
                <Card 
                  key={plan.id} 
                  className={`flex flex-col relative ${plan.isPopular ? 'border-primary shadow-md scale-105' : 'hover:shadow-md transition-shadow'}`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="space-y-4 text-center pb-4">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="space-y-1">
                      <div className="flex items-baseline justify-center">
                        <span className="text-3xl sm:text-4xl font-bold text-foreground font-mono">
                          ${typeof plan.price === "number" ? plan.price.toFixed(0) : plan.price}
                        </span>
                        {plan.billingCycle && (
                          <span className="text-sm text-muted-foreground ml-2">/{plan.billingCycle}</span>
                        )}
                      </div>
                      <CardDescription className="text-xs">
                        Billed {plan.billingCycle || "one-time"}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-1">
                    <ul className="space-y-3">
                      {plan.features && plan.features.length > 0 ? (
                        plan.features.map((feature: string, idx: number) => (
                          <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="text-foreground">{feature}</span>
                          </li>
                        ))
                      ) : (
                        <>
                          <li className="flex items-start space-x-2 text-xs sm:text-sm">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="text-foreground">Access to all course content</span>
                          </li>
                          <li className="flex items-start space-x-2 text-xs sm:text-sm">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="text-foreground">Project source code</span>
                          </li>
                          <li className="flex items-start space-x-2 text-xs sm:text-sm">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="text-foreground">Certificate of completion</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </CardContent>
                  <CardFooter className="pt-4">
                    <Button 
                      className="w-full" 
                      variant={plan.isPopular ? "default" : "outline"}
                      size="lg"
                      asChild
                    >
                      <Link href="/contact?plan={plan.name}">
                        Get Started <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Fallback pricing cards if no data */}
              <Card className="flex flex-col hover:shadow-md transition-shadow">
                <CardHeader className="space-y-4 text-center pb-4">
                  <CardTitle className="text-xl">Starter</CardTitle>
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-center">
                      <span className="text-3xl sm:text-4xl font-bold text-foreground font-mono">$49</span>
                      <span className="text-sm text-muted-foreground ml-2">/course</span>
                    </div>
                    <CardDescription className="text-xs">One-time purchase</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-2 text-xs sm:text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-foreground">Full course access</span>
                    </li>
                    <li className="flex items-start space-x-2 text-xs sm:text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-foreground">Project source code</span>
                    </li>
                    <li className="flex items-start space-x-2 text-xs sm:text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-foreground">Certificate</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="pt-4">
                  <Button className="w-full" variant="outline" size="lg" asChild>
                    <Link href="/courses">Browse Courses</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="flex flex-col relative border-primary shadow-md scale-105">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
                <CardHeader className="space-y-4 text-center pb-4">
                  <CardTitle className="text-xl">Pro Bundle</CardTitle>
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-center">
                      <span className="text-3xl sm:text-4xl font-bold text-foreground font-mono">$199</span>
                      <span className="text-sm text-muted-foreground ml-2">/bundle</span>
                    </div>
                    <CardDescription className="text-xs">All courses included</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-2 text-xs sm:text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-foreground">Access to all courses</span>
                    </li>
                    <li className="flex items-start space-x-2 text-xs sm:text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-foreground">Priority support</span>
                    </li>
                    <li className="flex items-start space-x-2 text-xs sm:text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-foreground">1-on-1 mentoring session</span>
                    </li>
                    <li className="flex items-start space-x-2 text-xs sm:text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-foreground">Lifetime updates</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="pt-4">
                  <Button className="w-full" size="lg" asChild>
                    <Link href="/contact">Get Pro Bundle</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="flex flex-col hover:shadow-md transition-shadow">
                <CardHeader className="space-y-4 text-center pb-4">
                  <CardTitle className="text-xl">Enterprise</CardTitle>
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-center">
                      <span className="text-3xl sm:text-4xl font-bold text-foreground font-mono">Custom</span>
                    </div>
                    <CardDescription className="text-xs">Tailored for teams</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-2 text-xs sm:text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-foreground">Custom curriculum</span>
                    </li>
                    <li className="flex items-start space-x-2 text-xs sm:text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-foreground">Team licenses</span>
                    </li>
                    <li className="flex items-start space-x-2 text-xs sm:text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-foreground">Dedicated support</span>
                    </li>
                    <li className="flex items-start space-x-2 text-xs sm:text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-foreground">Progress analytics</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="pt-4">
                  <Button className="w-full" variant="outline" size="lg" asChild>
                    <Link href="/contact">Contact Sales</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {/* Feature Comparison */}
          <section className="max-w-4xl space-y-6">
            <h2 className="text-2xl font-bold tracking-tight border-b border-border pb-3">Feature Comparison</h2>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-foreground">Feature</th>
                    <th className="text-center p-4 font-semibold text-foreground">Starter</th>
                    <th className="text-center p-4 font-semibold text-foreground">Pro</th>
                    <th className="text-center p-4 font-semibold text-foreground">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-4 text-muted-foreground">Course Access</td>
                    <td className="p-4 text-center"><CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" /></td>
                    <td className="p-4 text-center"><CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" /></td>
                    <td className="p-4 text-center"><CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-4 text-muted-foreground">Source Code</td>
                    <td className="p-4 text-center"><CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" /></td>
                    <td className="p-4 text-center"><CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" /></td>
                    <td className="p-4 text-center"><CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-4 text-muted-foreground">Certificate</td>
                    <td className="p-4 text-center"><CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" /></td>
                    <td className="p-4 text-center"><CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" /></td>
                    <td className="p-4 text-center"><CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-4 text-muted-foreground">Priority Support</td>
                    <td className="p-4 text-center text-muted-foreground">—</td>
                    <td className="p-4 text-center"><CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" /></td>
                    <td className="p-4 text-center"><CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-4 text-muted-foreground">1-on-1 Mentoring</td>
                    <td className="p-4 text-center text-muted-foreground">—</td>
                    <td className="p-4 text-center"><CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" /></td>
                    <td className="p-4 text-center"><CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-4 text-muted-foreground">Team Licenses</td>
                    <td className="p-4 text-center text-muted-foreground">—</td>
                    <td className="p-4 text-center text-muted-foreground">—</td>
                    <td className="p-4 text-center"><CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-4 text-muted-foreground">Custom Curriculum</td>
                    <td className="p-4 text-center text-muted-foreground">—</td>
                    <td className="p-4 text-center text-muted-foreground">—</td>
                    <td className="p-4 text-center"><CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="max-w-4xl space-y-6">
            <h2 className="text-2xl font-bold tracking-tight border-b border-border pb-3">Why Choose Our Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="space-y-3">
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary w-fit">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">Transparent Pricing</CardTitle>
                  <CardDescription className="text-xs leading-relaxed">
                    No hidden fees or surprise charges. The price you see is exactly what you pay.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="space-y-3">
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary w-fit">
                    <Zap className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">Instant Access</CardTitle>
                  <CardDescription className="text-xs leading-relaxed">
                    Get immediate access to all course content and resources upon purchase.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="space-y-3">
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary w-fit">
                    <Shield className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">Money-Back Guarantee</CardTitle>
                  <CardDescription className="text-xs leading-relaxed">
                    14-day money-back guarantee on all courses. Not satisfied? Get a full refund.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </section>

          {/* FAQ */}
          <section className="max-w-4xl space-y-6">
            <h2 className="text-2xl font-bold tracking-tight border-b border-border pb-3 flex items-center">
              <HelpCircle className="h-5 w-5 mr-2" />
              Frequently Asked Questions
            </h2>
            <Accordion>
              {faqs.length > 0 ? (
                faqs.map((faq: any, idx: number) => (
                  <AccordionItem key={idx} defaultOpen={idx === 0}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))
              ) : (
                <>
                  <AccordionItem defaultOpen>
                    <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                    <AccordionContent>
                      We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise clients. All payments are processed securely through our payment partners.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem>
                    <AccordionTrigger>Can I cancel my subscription anytime?</AccordionTrigger>
                    <AccordionContent>
                      Yes, you can cancel your subscription at any time from your account settings. There are no long-term contracts or cancellation fees. You'll retain access until the end of your current billing period.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem>
                    <AccordionTrigger>Do you offer refunds?</AccordionTrigger>
                    <AccordionContent>
                      We offer a 14-day money-back guarantee for all course purchases. If you're not satisfied with the content, contact us within 14 days for a full refund. For custom software services, refund terms are outlined in your project agreement.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem>
                    <AccordionTrigger>Are there any hidden fees?</AccordionTrigger>
                    <AccordionContent>
                      No. All pricing is transparent and upfront. The price you see on our pricing page is the final price you pay. There are no setup fees, maintenance fees, or hidden charges.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem>
                    <AccordionTrigger>Can I upgrade my plan later?</AccordionTrigger>
                    <AccordionContent>
                      Absolutely! You can upgrade your plan at any time. When upgrading, you'll only pay the prorated difference between your current and new plan. Downgrades are also available at the end of your billing cycle.
                    </AccordionContent>
                  </AccordionItem>
                </>
              )}
            </Accordion>
          </section>

          {/* CTA */}
          <section className="rounded-xl border border-primary/20 bg-primary/5 p-8 sm:p-12 text-center space-y-4 max-w-4xl">
            <h3 className="text-2xl font-bold text-foreground">Still Have Questions?</h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
              Our team is here to help you find the right plan for your needs. Reach out and we'll get back to you within 24 hours.
            </p>
            <div>
              <Button size="lg" asChild>
                <Link href="/contact">
                  Contact Us <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </section>
        </Container>
      </div>
    </>
  );
}
