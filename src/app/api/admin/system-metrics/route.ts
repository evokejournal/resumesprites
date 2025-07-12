import { NextRequest, NextResponse } from 'next/server';
import { rateLimiters } from '@/lib/rate-limiter';
import { securityLogger, SecurityEventType, SecuritySeverity } from '@/lib/security-logger';
import { authenticateAdmin } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimiters.api(request);
    if (rateLimitResult) {
      securityLogger.log({
        type: SecurityEventType.RATE_LIMIT_EXCEEDED,
        severity: SecuritySeverity.MEDIUM,
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        endpoint: '/api/admin/system-metrics',
        method: 'GET',
        details: { endpoint: '/api/admin/system-metrics' }
      });
      return rateLimitResult;
    }

    // Admin authentication
    const authResult = await authenticateAdmin(request);
    if (!authResult.success) {
      securityLogger.log({
        type: SecurityEventType.PERMISSION_DENIED,
        severity: SecuritySeverity.HIGH,
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        endpoint: '/api/admin/system-metrics',
        method: 'GET',
        details: { endpoint: '/api/admin/system-metrics' }
      });
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const adminUser = authResult.user;
    if (!adminUser) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }

    // Stubbed system metrics
    const metrics = {
      cpu: { name: 'CPU Usage', value: 45, unit: '%', trend: 'up', status: 'good', threshold: 80 },
      memory: { name: 'Memory Usage', value: 72, unit: '%', trend: 'up', status: 'warning', threshold: 85 },
      disk: { name: 'Disk Usage', value: 68, unit: '%', trend: 'stable', status: 'good', threshold: 90 },
      network: { name: 'Network I/O', value: 125, unit: 'MB/s', trend: 'down', status: 'good', threshold: 500 },
      responseTime: { name: 'Response Time', value: 245, unit: 'ms', trend: 'down', status: 'good', threshold: 1000 },
      errorRate: { name: 'Error Rate', value: 0.8, unit: '%', trend: 'up', status: 'warning', threshold: 2.0 }
    };

    securityLogger.log({
      type: SecurityEventType.API_ACCESS,
      severity: SecuritySeverity.LOW,
      userId: adminUser.id,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      endpoint: '/api/admin/system-metrics',
      method: 'GET',
      details: { success: true }
    });

    return NextResponse.json(metrics);
  } catch (error) {
    securityLogger.log({
      type: SecurityEventType.ERROR,
      severity: SecuritySeverity.HIGH,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      endpoint: '/api/admin/system-metrics',
      method: 'GET',
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 