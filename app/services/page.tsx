import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { Code2, ArrowRight, Sparkles, Layers } from "lucide-react";

async function getServices() {
  try {
    const res = await fetch("http://localhost:3000/api/services", { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="py-10 space-y-8">
      <Container className="space-y-8">
        {/* Header */}
        <div className="space-y-2 max-w-3xl">
          <Badge variant="accent">Development Services</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Custom Software & Engineering Solutions
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We partner with startups, agencies, and enterprises to build fast, scalable, type-safe web and mobile applications using modern full-stack architectures.
          </p>
        </div>

        {/* Services Cards Grid */}
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service: any) => (
              <Card key={service.id} className="flex flex-col justify-between hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-md bg-primary/10 text-primary">
                      <Code2 className="h-5 w-5" />
                    </div>
                    {service.priceRange && (
                      <span className="text-xs font-mono text-muted-foreground bg-secondary px-2.5 py-1 rounded">
                        {service.priceRange}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="line-clamp-3 leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-0">
                  <Link href={`/services/${service.slug}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full flex items-center justify-center space-x-1.5">
                      <span>View Service Details</span>
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
            title="No services published yet"
            description="Our service catalogue is being updated. Please check back shortly or get in touch for custom requests."
          />
        )}
      </Container>
    </div>
  );
}
