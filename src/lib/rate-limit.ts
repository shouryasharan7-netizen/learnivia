import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

// Only create limiters if env vars are present (to allow build/local dev without Redis)
const hasRedis = !!url && !!token;
const redis = hasRedis ? new Redis({ url: url!, token: token! }) : null;

// Different limiters for different contexts
export const rateLimiters = {
  auth: hasRedis
    ? new Ratelimit({ redis: redis!, limiter: Ratelimit.slidingWindow(10, "1 m"), analytics: true, prefix: "rl:auth" })
    : null,
  api: hasRedis
    ? new Ratelimit({ redis: redis!, limiter: Ratelimit.slidingWindow(20, "1 m"), analytics: true, prefix: "rl:api" })
    : null,
  global: hasRedis
    ? new Ratelimit({ redis: redis!, limiter: Ratelimit.slidingWindow(100, "1 m"), analytics: true, prefix: "rl:global" })
    : null,
};

export async function checkRateLimit(
  limiterName: keyof typeof rateLimiters,
  identifier: string
) {
  const limiter = rateLimiters[limiterName];
  if (!limiter) {
    // Fail open if Redis is not configured
    return { success: true, limit: 100, remaining: 100, reset: 0 };
  }

  try {
    return await limiter.limit(identifier);
  } catch (error) {
    console.warn("Rate limit check failed (failing open):", error);
    return { success: true, limit: 100, remaining: 100, reset: 0 };
  }
}
