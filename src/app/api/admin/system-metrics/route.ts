import { NextRequest, NextResponse } from 'next/server';
import { rateLimiters } from '@/lib/rate-limiter';
import { securityLogger, SecurityEventType, SecuritySeverity } from '@/lib/security-logger';
import { authenticateAdmin } from '@/lib/admin-auth';
import os from 'os';
import { execSync } from 'child_process';

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

    // Real system metrics
    // CPU Usage (average over 1 minute)
    const loadAvg = os.loadavg()[0];
    const cpuCount = os.cpus().length;
    const cpuUsagePercent = Math.min(100, Math.round((loadAvg / cpuCount) * 100));
    // Memory Usage
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memUsagePercent = Math.round((usedMem / totalMem) * 100);
    // Disk Usage (use df -h, works on Linux/macOS)
    let diskUsagePercent = 0;
    try {
      const df = execSync('df --output=pcent / | tail -1').toString().trim();
      diskUsagePercent = parseInt(df.replace('%', '').trim(), 10);
    } catch {
      diskUsagePercent = 0;
    }
    // Network I/O (stubbed, not easily available cross-platform)
    const networkIO = 0;
    // Response Time (stubbed)
    const responseTime = 200;
    // Error Rate (stubbed)
    const errorRate = 0.5;
    // Status helpers
    function getStatus(value: number, threshold: number) {
      if (value < threshold * 0.8) return 'good';
      if (value < threshold) return 'warning';
      return 'critical';
    }
    const metrics = {
      cpu: {
        name: 'CPU Usage',
        value: cpuUsagePercent,
        unit: '%',
        trend: 'stable',
        status: getStatus(cpuUsagePercent, 80),
        threshold: 80,
      },
      memory: {
        name: 'Memory Usage',
        value: memUsagePercent,
        unit: '%',
        trend: 'stable',
        status: getStatus(memUsagePercent, 85),
        threshold: 85,
      },
      disk: {
        name: 'Disk Usage',
        value: diskUsagePercent,
        unit: '%',
        trend: 'stable',
        status: getStatus(diskUsagePercent, 90),
        threshold: 90,
      },
      network: {
        name: 'Network I/O',
        value: networkIO,
        unit: 'MB/s',
        trend: 'stable',
        status: 'good',
        threshold: 500,
      },
      responseTime: {
        name: 'Response Time',
        value: responseTime,
        unit: 'ms',
        trend: 'stable',
        status: getStatus(responseTime, 1000),
        threshold: 1000,
      },
      errorRate: {
        name: 'Error Rate',
        value: errorRate,
        unit: '%',
        trend: 'stable',
        status: getStatus(errorRate, 2.0),
        threshold: 2.0,
      },
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