import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { RateLimitError } from './errors';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  analytics: true,
});

export const strictRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 m'),
  analytics: true,
});

export const generousRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  analytics: true,
});

export async function checkRateLimit(
  identifier: string,
  limit: Ratelimit = ratelimit
): Promise<void> {
  const { success } = await limit.limit(identifier);
  
  if (!success) {
    throw new RateLimitError('Too many requests. Please try again later.');
  }
}

export async function checkAuthRateLimit(identifier: string): Promise<void> {
  await checkRateLimit(`auth:${identifier}`, strictRatelimit);
}

export async function checkContactRateLimit(identifier: string): Promise<void> {
  await checkRateLimit(`contact:${identifier}`, ratelimit);
}

export async function checkPublicApiRateLimit(identifier: string): Promise<void> {
  await checkRateLimit(`public:${identifier}`, generousRatelimit);
}
