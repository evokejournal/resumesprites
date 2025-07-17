import { NextRequest, NextResponse } from 'next/server';

// Rate limiting strategies
export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (req: NextRequest) => string; // Custom key generator
  skipSuccessfulRequests?: boolean; // Skip rate limiting for successful requests
  skipFailedRequests?: boolean; // Skip rate limiting for failed requests
}

// In-memory store (for development, use Redis in production)
class MemoryStore {
  private store = new Map<string, { count: number; resetTime: number }>();

  async get(key: string): Promise<{ count: number; resetTime: number } | null> {
    const record = this.store.get(key);
    if (!record) return null;
    
    if (Date.now() > record.resetTime) {
      this.store.delete(key);
      return null;
    }
    
    return record;
  }

  async set(key: string, count: number, resetTime: number): Promise<void> {
    this.store.set(key, { count, resetTime });
  }

  async increment(key: string, windowMs: number): Promise<{ count: number; resetTime: number }> {
    const now = Date.now();
    const record = await this.get(key);
    
    if (!record) {
      const newRecord = { count: 1, resetTime: now + windowMs };
      await this.set(key, newRecord.count, newRecord.resetTime);
      return newRecord;
    }
    
    record.count++;
    await this.set(key, record.count, record.resetTime);
    return record;
  }
}

// Production Redis store
class RedisStore {
  private client: any;

  constructor() {
    // Dynamic import to avoid build issues
    const Redis = require('ioredis');
    this.client = new Redis(process.env.REDIS_URL!);
  }

  async get(key: string): Promise<{ count: number; resetTime: number } | null> {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, count: number, resetTime: number): Promise<void> {
    await this.client.setex(key, Math.ceil((resetTime - Date.now()) / 1000), JSON.stringify({ count, resetTime }));
  }

  async increment(key: string, windowMs: number): Promise<{ count: number; resetTime: number }> {
    const now = Date.now();
    const record = await this.get(key);
    
    if (!record) {
      const newRecord = { count: 1, resetTime: now + windowMs };
      await this.set(key, newRecord.count, newRecord.resetTime);
      return newRecord;
    }
    
    record.count++;
    await this.set(key, record.count, record.resetTime);
    return record;
  }
}

// Choose store based on environment
const store = process.env.NODE_ENV === 'production' && process.env.REDIS_URL
  ? new RedisStore()
  : new MemoryStore();

// Default key generator
function defaultKeyGenerator(req: NextRequest): string {
  const ip = req.headers.get('x-forwarded-for') || 
             req.headers.get('x-real-ip') || 
             'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';
  return `${ip}-${userAgent}`;
}

// Rate limiting middleware
export function createRateLimiter(config: RateLimitConfig) {
  return async function rateLimit(req: NextRequest): Promise<NextResponse | null> {
    const key = config.keyGenerator ? config.keyGenerator(req) : defaultKeyGenerator(req);
    
    try {
      const record = await store.increment(key, config.windowMs);
      
      // Check if rate limit exceeded
      if (record.count > config.maxRequests) {
        const retryAfter = Math.ceil((record.resetTime - Date.now()) / 1000);
        
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded',
            retryAfter,
            limit: config.maxRequests,
            remaining: 0
          },
          { 
            status: 429,
            headers: {
              'Retry-After': retryAfter.toString(),
              'X-RateLimit-Limit': config.maxRequests.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': new Date(record.resetTime).toISOString(),
            }
          }
        );
      }
      
      // Add rate limit headers to response
      const remaining = Math.max(0, config.maxRequests - record.count);
      req.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
      req.headers.set('X-RateLimit-Remaining', remaining.toString());
      req.headers.set('X-RateLimit-Reset', new Date(record.resetTime).toISOString());
      
      return null; // Continue
    } catch (error) {
      console.error('Rate limiting error:', error);
      return null; // Continue on error
    }
  };
}

// Pre-configured rate limiters
export const rateLimiters = {
  // Very lenient rate limiting for authentication endpoints in development
  auth: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: process.env.NODE_ENV === 'development' ? 200 : 5, // Very lenient in development
    keyGenerator: (req) => {
      const ip = req.headers.get('x-forwarded-for') || 'unknown';
      return `auth:${ip}`;
    }
  }),
  
  // Moderate rate limiting for API endpoints
  api: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: process.env.NODE_ENV === 'development' ? 1000 : 100, // More lenient in development
  }),
  
  // Loose rate limiting for general pages
  general: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: process.env.NODE_ENV === 'development' ? 10000 : 1000, // More lenient in development
  }),
  
  // File upload rate limiting
  upload: createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: process.env.NODE_ENV === 'development' ? 100 : 10, // More lenient in development
  }),
  
  // Resume parsing rate limiting (AI service)
  ai: createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: process.env.NODE_ENV === 'development' ? 200 : 20, // More lenient in development
  }),
}; 