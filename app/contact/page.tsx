"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Container } from "@/components/shared/Container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TurnstileWidget } from "@/components/auth/TurnstileWidget";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { AlertCircle, Mail, MapPin, Send, CheckCircle2 } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  turnstileToken: z.string().min(1, "Please complete the verification"),
});

type ContactFormInput = z.infer<typeof contactSchema>;

interface ContactPageProps {
  searchParams: Promise<{
    service?: string;
    plan?: string;
    source?: string;
  }>;
}

export default function ContactPage({ searchParams }: ContactPageProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [service, setService] = React.useState<string>("");
  const [plan, setPlan] = React.useState<string>("");
  const [source, setSource] = React.useState<string>("");

  React.useEffect(() => {
    searchParams.then((params) => {
      setService(params.service || "");
      setPlan(params.plan || "");
      setSource(params.source || "CONTACT");
    });
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      turnstileToken: "",
    },
  });

  const handleTurnstileSuccess = (token: string) => {
    setValue("turnstileToken", token, { shouldValidate: true });
  };

  const onSubmit = async (data: ContactFormInput) => {
    try {
      setIsLoading(true);
      setErrorMsg(null);

      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          message: data.message,
          source: source || "CONTACT",
          turnstileToken: data.turnstileToken,
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData?.error?.message || responseData?.message || "Failed to send message");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="py-10 space-y-8">
        <Container className="max-w-2xl">
          <Card className="text-center shadow-sm">
            <CardContent className="p-12 space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Message Sent!</h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Thank you for reaching out. We've received your message and will get back to you within 24 hours.
                </p>
              </div>
              <div className="flex items-center justify-center gap-4 pt-4">
                <Button variant="outline" onClick={() => {
                  setIsSuccess(false);
                  setErrorMsg(null);
                }}>
                  Send Another Message
                </Button>
                <Link href="/">
                  <Button>
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-10 space-y-12">
      <Container className="max-w-4xl space-y-12">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Get in Touch
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Have a question or want to discuss a project? Fill out the form below and we'll get back to you within 24 hours.
          </p>
          {service && (
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              Inquiring about: {service}
            </div>
          )}
          {plan && (
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium ml-2">
              Plan: {plan}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="space-y-4">
                <CardTitle className="text-lg">Contact Information</CardTitle>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-foreground">Email</p>
                      <p className="text-xs text-muted-foreground">hello@webify-solutions.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-foreground">Location</p>
                      <p className="text-xs text-muted-foreground">Remote-First Worldwide</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="shadow-sm bg-secondary/20">
              <CardHeader className="space-y-2">
                <CardTitle className="text-base">Response Time</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  We typically respond to all inquiries within 24 business hours. For urgent matters, please indicate so in your message.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Send us a message</CardTitle>
                <CardDescription className="text-xs">
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {errorMsg && (
                    <div className="flex items-center space-x-2 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground">Name</label>
                      <Input
                        placeholder="John Doe"
                        {...register("name")}
                        disabled={isLoading}
                      />
                      {errors.name && (
                        <p className="text-xs text-destructive">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground">Email</label>
                      <Input
                        type="email"
                        placeholder="you@domain.com"
                        {...register("email")}
                        disabled={isLoading}
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Message</label>
                    <textarea
                      placeholder="Tell us about your project or inquiry..."
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      {...register("message")}
                      disabled={isLoading}
                    />
                    {errors.message && (
                      <p className="text-xs text-destructive">{errors.message.message}</p>
                    )}
                  </div>

                  {/* Turnstile Captcha */}
                  <div className="space-y-1">
                    <TurnstileWidget onSuccess={handleTurnstileSuccess} />
                    {errors.turnstileToken && (
                      <p className="text-xs text-destructive text-center">
                        {errors.turnstileToken.message}
                      </p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <LoadingSpinner size="sm" label="Sending..." />
                    ) : (
                      <>
                        Send Message <Send className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Links */}
        <div className="text-center space-y-4 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">Looking for something specific?</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/services">
              <Button variant="outline" size="sm">Our Services</Button>
            </Link>
            <Link href="/courses">
              <Button variant="outline" size="sm">Browse Courses</Button>
            </Link>
            <Link href="/portfolio">
              <Button variant="outline" size="sm">View Portfolio</Button>
            </Link>
            <Link href="/careers">
              <Button variant="outline" size="sm">Careers</Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
