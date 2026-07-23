import { prisma } from '@/lib/prisma';

export interface BlogQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
  includeUnpublished?: boolean;
}

export async function getBlogPosts(params: BlogQueryParams = {}) {
  const {
    page = 1,
    limit = 9,
    category,
    tag,
    search,
    includeUnpublished = false,
  } = params;

  const where: any = {};

  if (!includeUnpublished) {
    where.isPublished = true;
  }

  if (category) {
    where.category = category;
  }

  if (tag) {
    where.tags = {
      has: tag,
    };
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { publishedAt: 'desc' },
    }),
    prisma.blogPost.count({ where }),
  ]);

  return {
    posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getBlogPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
}
