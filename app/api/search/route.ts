import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkPublicApiRateLimit } from '@/lib/ratelimit';
import { handleApiError } from '@/lib/errors';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    await checkPublicApiRateLimit(ip);

    const [courses, blogPosts, services, portfolioItems] = await Promise.all([
      prisma.course.findMany({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnailUrl: true,
          category: true,
          level: true,
        },
      }),
      prisma.blogPost.findMany({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          coverImage: true,
          category: true,
          publishedAt: true,
        },
      }),
      prisma.service.findMany({
        where: {
          isActive: true,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          icon: true,
        },
      }),
      prisma.portfolio.findMany({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { techUsed: { has: query } },
          ],
        },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          techUsed: true,
        },
      }),
    ]);

    const results = {
      courses,
      blogPosts,
      services,
      portfolioItems,
    };

    return NextResponse.json(results);
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}
