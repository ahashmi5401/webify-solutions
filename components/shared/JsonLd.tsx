// JsonLd — renders a <script type="application/ld+json"> tag.
// Usage: <JsonLd data={schemaObject} />
// Pass an array of schema objects to render multiple schemas on one page.

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted structured data
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data, null, 0) }}
    />
  );
}

// ---------------------------------------------------------------------------
// Schema builders — call these to generate typed JSON-LD objects
// ---------------------------------------------------------------------------

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://webify-solutions.vercel.app";

export const ORGANIZATION = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Webify Solutions",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo.png`,
    width: 180,
    height: 40,
  },
  sameAs: [
    "https://twitter.com/webifysolutions",
    "https://github.com/webify-solutions",
    "https://linkedin.com/company/webify-solutions",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "hello@webify-solutions.com",
    availableLanguage: ["English", "Urdu"],
  },
} as const;

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    ...ORGANIZATION,
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Webify Solutions",
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/courses?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildCourseSchema(course: {
  name: string;
  description: string;
  slug: string;
  price?: number | null;
  currency?: string;
  imageUrl?: string | null;
  duration?: string | null;
  level?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: course.description,
    url: `${SITE_URL}/courses/${course.slug}`,
    provider: { "@id": `${SITE_URL}/#organization` },
    educationalLevel: course.level ?? "Beginner",
  };

  if (course.imageUrl) {
    schema.image = course.imageUrl;
  }

  if (course.price != null) {
    schema.offers = {
      "@type": "Offer",
      price: course.price,
      priceCurrency: course.currency ?? "USD",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/courses/${course.slug}`,
    };
  }

  if (course.duration) {
    schema.timeRequired = course.duration;
  }

  // Only add AggregateRating if real data exists — never fabricated
  if (course.rating != null && course.reviewCount != null && course.reviewCount > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: course.rating,
      reviewCount: course.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
}

export function buildServiceSchema(service: {
  name: string;
  description: string;
  slug: string;
  price?: number | null;
  currency?: string;
  imageUrl?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: `${SITE_URL}/services/${service.slug}`,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: "Worldwide",
    serviceType: "Software Development",
  };

  if (service.imageUrl) {
    schema.image = service.imageUrl;
  }

  if (service.price != null) {
    schema.offers = {
      "@type": "Offer",
      price: service.price,
      priceCurrency: service.currency ?? "USD",
      availability: "https://schema.org/InStock",
    };
  }

  if (service.rating != null && service.reviewCount != null && service.reviewCount > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: service.rating,
      reviewCount: service.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
}

export function buildFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildBreadcrumbSchema(
  crumbs: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url.startsWith("http") ? crumb.url : `${SITE_URL}${crumb.url}`,
    })),
  };
}
