import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/Container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { JsonLd, buildBreadcrumbSchema } from "@/components/shared/JsonLd";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Share2, 
  Clock,
  FileText,
  Link2
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import DOMPurify from "isomorphic-dompurify";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://webify-solutions.vercel.app";

interface BlogDetailProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getBlogPostBySlug(slug: string) {
  try {
    const { getBlogPostBySlug: fetchPost } = await import('@/lib/data/blog');
    return await fetchPost(slug);
  } catch {
    return null;
  }
}

async function getRelatedPosts(category: string, currentSlug: string) {
  try {
    const { getBlogPosts } = await import('@/lib/data/blog');
    const data = await getBlogPosts({ category, limit: 3 });
    return data.posts?.filter((p: any) => p.slug !== currentSlug).slice(0, 3) || [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: BlogDetailProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getBlogPostBySlug(resolvedParams.slug);

  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: post.title,
    description: post.content?.slice(0, 160).replace(/[#*`]/g, "") || "Read this article on Webify Solutions blog.",
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url: `${SITE_URL}/blog/${post.slug}`,
      title: post.title,
      description: post.content?.slice(0, 160).replace(/[#*`]/g, "") || "",
      publishedTime: post.publishedAt ? post.publishedAt.toISOString() : undefined,
      authors: [post.author?.name || "Webify Solutions"],
      images: post.coverImage ? [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }] : [{ url: "/og-default.png", width: 1200, height: 630, alt: "Webify Solutions" }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.content?.slice(0, 160).replace(/[#*`]/g, "") || "",
      images: post.coverImage ? [post.coverImage] : ["/og-default.png"],
    },
  };
}

function buildArticleSchema(post: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.content?.slice(0, 160).replace(/[#*`]/g, "") || "",
    image: post.coverImage || `${SITE_URL}/og-default.png`,
    author: {
      "@type": "Person",
      name: post.author?.name || "Webify Solutions",
      image: post.author?.image,
    },
    publisher: {
      "@type": "Organization",
      name: "Webify Solutions",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const resolvedParams = await params;
  const post = await getBlogPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.category, post.slug);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${post.slug}` },
  ]);

  const articleSchema = buildArticleSchema(post);

  // Check if content is Markdown (contains markdown syntax)
  const isMarkdown = /[#*`_\[\]]/.test(post.content);

  const readingTime = Math.ceil(post.content.split(/\s+/).length / 200);

  return (
    <>
      <JsonLd data={[articleSchema, breadcrumbSchema]} />
      
      <div className="py-10 space-y-12">
        <Container className="space-y-8">
          {/* Back Link */}
          <Link href="/blog" className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to all articles
          </Link>

          {/* Article Header */}
          <div className="space-y-6 max-w-4xl">
            <div className="space-y-3">
              <Badge variant="accent">{post.category}</Badge>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1.5">
                  <User className="h-4 w-4" />
                  <span>{post.author?.name || "Webify Team"}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Draft"}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{readingTime} min read</span>
                </div>
              </div>
            </div>

            {post.coverImage && (
              <div className="aspect-video w-full overflow-hidden rounded-lg bg-secondary">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Share Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Share:</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={() => navigator.clipboard.writeText(`${SITE_URL}/blog/${post.slug}`)}
              >
                <Link2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Article Content */}
          <article className="max-w-4xl">
            <Card className="shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="prose prose-sm sm:prose-base max-w-none">
                  {isMarkdown ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {post.content}
                    </ReactMarkdown>
                  ) : (
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: DOMPurify.sanitize(post.content) 
                      }} 
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </article>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="max-w-4xl space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <Link key={tag} href={`/blog?tag=${tag}`}>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                      #{tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Author Box */}
          <Card className="max-w-4xl shadow-sm bg-secondary/20">
            <CardContent className="p-6 flex items-start space-x-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                {post.author?.name ? post.author.name.split(" ").map((n: string) => n[0]).join("") : "WS"}
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground">{post.author?.name || "Webify Team"}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {post.author?.name ? "Author at Webify Solutions. Passionate about web development and sharing knowledge with the community." : "The Webify Solutions team shares expertise in React, Next.js, TypeScript, and full-stack development."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <section className="space-y-6 max-w-4xl">
              <h2 className="text-2xl font-bold tracking-tight border-b border-border pb-3">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedPosts.map((relatedPost: any) => (
                  <Card key={relatedPost.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="space-y-2">
                      <Badge variant="secondary" className="w-fit text-xs">{relatedPost.category}</Badge>
                      <CardTitle className="text-base line-clamp-2">{relatedPost.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Link href={`/blog/${relatedPost.slug}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          Read More
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* FAQ Section */}
          <section className="max-w-4xl space-y-6">
            <h2 className="text-2xl font-bold tracking-tight border-b border-border pb-3">Frequently Asked Questions</h2>
            <Accordion>
              <AccordionItem>
                <AccordionTrigger>Can I use this code in my projects?</AccordionTrigger>
                <AccordionContent>
                  Yes! All code examples and tutorials provided in our articles are free to use in your personal and commercial projects. We believe in sharing knowledge openly.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem>
                <AccordionTrigger>How often do you publish new articles?</AccordionTrigger>
                <AccordionContent>
                  We publish new articles weekly, covering the latest trends in web development, React, Next.js, TypeScript, and full-stack architecture. Subscribe to our newsletter to stay updated.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem>
                <AccordionTrigger>Can I request a specific topic?</AccordionTrigger>
                <AccordionContent>
                  Absolutely! We welcome topic suggestions. Contact us with your idea, and we'll consider it for future articles. Popular requests get priority.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </Container>
      </div>
    </>
  );
}
