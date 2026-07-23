import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { Calendar, User, ChevronLeft, ChevronRight } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://webify-solutions.vercel.app";

export const metadata: Metadata = {
  title: "Blog — Web Development Tutorials & Insights",
  description: "Expert articles on React, Next.js, TypeScript, and full-stack web development. Practical tutorials, best practices, and industry insights from Webify Solutions.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/blog`,
    title: "Blog — Web Development Tutorials & Insights | Webify Solutions",
    description: "Expert articles on React, Next.js, TypeScript, and full-stack web development.",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Webify Solutions Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Web Development Tutorials & Insights | Webify Solutions",
    description: "Expert articles on React, Next.js, TypeScript, and full-stack web development.",
    images: ["/og-default.png"],
  },
};

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    category?: string;
    tag?: string;
    search?: string;
  }>;
}

async function getBlogPosts(params: {
  page?: string;
  limit?: string;
  category?: string;
  tag?: string;
  search?: string;
}) {
  try {
    const { getBlogPosts } = await import('@/lib/data/blog');
    return await getBlogPosts({
      page: params.page ? parseInt(params.page) : 1,
      limit: params.limit ? parseInt(params.limit) : 9,
      category: params.category,
      tag: params.tag,
      search: params.search,
    });
  } catch {
    return { posts: [], pagination: { page: 1, limit: 9, total: 0, totalPages: 0 } };
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedParams = await searchParams;
  const { posts, pagination } = await getBlogPosts(resolvedParams);

  const categories = Array.from(new Set(posts.map((p: any) => p.category))).filter(Boolean) as string[];
  const tags = Array.from(new Set(posts.flatMap((p: any) => p.tags || []))).filter(Boolean) as string[];

  return (
    <div className="py-10 space-y-8">
      <Container className="space-y-8">
        {/* Header */}
        <div className="space-y-2 max-w-3xl">
          <Badge variant="accent">Blog</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Web Development Insights
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Practical tutorials, best practices, and industry insights on React, Next.js, TypeScript, and full-stack development.
          </p>
        </div>

        {/* Filter Pills */}
        {(categories.length > 0 || tags.length > 0) && (
          <div className="flex flex-wrap gap-2">
            <Link href="/blog">
              <Button variant={!resolvedParams.category && !resolvedParams.tag ? "default" : "outline"} size="sm">
                All Posts
              </Button>
            </Link>
            {categories.map((category) => (
              <Link key={category} href={`/blog?category=${category}`}>
                <Button variant={resolvedParams.category === category ? "default" : "outline"} size="sm">
                  {category}
                </Button>
              </Link>
            ))}
            {tags.slice(0, 5).map((tag) => (
              <Link key={tag} href={`/blog?tag=${tag}`}>
                <Button variant={resolvedParams.tag === tag ? "default" : "outline"} size="sm">
                  #{tag}
                </Button>
              </Link>
            ))}
          </div>
        )}

        {/* Blog Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: any) => (
              <Card key={post.id} className="flex flex-col hover:shadow-md transition-shadow">
                {post.coverImage && (
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-secondary">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{post.category}</Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Draft"}
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2 text-lg">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.content?.slice(0, 150).replace(/[#*`]/g, "")}...
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="text-[10px] text-muted-foreground">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center text-xs text-muted-foreground">
                    <User className="h-3.5 w-3.5 mr-1.5" />
                    {post.author?.name || "Webify Team"}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 mt-auto">
                  <Link href={`/blog/${post.slug}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full">
                      Read Article
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="file"
            title="No articles found"
            description="No blog posts match your current filter. Try selecting a different category or tag."
          />
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border pt-6 mt-8">
            <span className="text-xs text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} posts)
            </span>
            <div className="flex items-center space-x-2">
              {pagination.page > 1 && (
                <Link
                  href={`/blog?${new URLSearchParams({
                    ...resolvedParams,
                    page: String(pagination.page - 1),
                  }).toString()}`}
                >
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                </Link>
              )}
              {pagination.page < pagination.totalPages && (
                <Link
                  href={`/blog?${new URLSearchParams({
                    ...resolvedParams,
                    page: String(pagination.page + 1),
                  }).toString()}`}
                >
                  <Button variant="outline" size="sm">
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
