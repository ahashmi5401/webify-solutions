"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, ArrowRight } from "lucide-react";

const typeVariantMap: Record<string, "default" | "secondary" | "outline"> = {
  FULL_TIME: "default",
  PART_TIME: "secondary",
  CONTRACT: "outline",
  INTERNSHIP: "outline",
};

interface CareerCardProps {
  listing: {
    id: string;
    title: string;
    type: string;
    department: string;
    location: string;
    description: string;
    createdAt: string;
  };
}

export function CareerCard({ listing }: CareerCardProps) {
  const handleApply = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('jobApplication', listing.title);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={typeVariantMap[listing.type] || "outline"}>
            {listing.type}
          </Badge>
          <Badge variant="secondary">{listing.department}</Badge>
        </div>
        <CardTitle className="text-xl">{listing.title}</CardTitle>
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <span>{listing.location}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>Posted {new Date(listing.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {listing.description}
        </p>
      </CardHeader>
      <CardFooter className="pt-0">
        <Link href="/contact" className="w-full">
          <Button 
            className="w-full"
            onClick={handleApply}
          >
            Apply Now <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
