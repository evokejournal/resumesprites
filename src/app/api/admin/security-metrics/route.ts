import { NextRequest, NextResponse } from 'next/server';
import { rateLimiters } from '@/lib/rate-limiter';
import { securityLogger, SecurityEventType, SecuritySeverity } from '@/lib/security-logger';
import { authenticateAdmin } from '@/lib/admin-auth';
import { adminDb } from '@/lib/firebase-admin';

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
        endpoint: '/api/admin/security-metrics',
        method: 'GET',
        details: { endpoint: '/api/admin/security-metrics' }
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
        endpoint: '/api/admin/security-metrics',
        method: 'GET',
        details: { endpoint: '/api/admin/security-metrics' }
      });
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const adminUser = authResult.user;
    if (!adminUser) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }

    // Fetch user metrics from Firestore
    const usersSnapshot = await adminDb.collection('users').get();
    const totalUsers = usersSnapshot.size;
    const activeUsers = usersSnapshot.docs.filter(doc => (doc.data().status || 'active') === 'active').length;

    // Fetch security logs for alert metrics
    const logsSnapshot = await adminDb.collection('securityLogs').orderBy('timestamp', 'desc').limit(500).get();
    const logs = logsSnapshot.docs.map(doc => doc.data());
    const securityAlerts = logs.filter(log =>
      log.severity === 'high' || log.severity === 'critical'
    ).length;
    const rateLimitViolations = logs.filter(log => log.type === 'rate_limit_exceeded').length;
    const authFailures = logs.filter(log => log.type === 'auth_failure').length;
    const permissionDenials = logs.filter(log => log.type === 'permission_denied').length;
    const suspiciousActivity = logs.filter(log => log.type === 'suspicious_activity').length;

    // Fetch last backup
    const backupsSnapshot = await adminDb.collection('backups').orderBy('createdAt', 'desc').limit(1).get();
    const lastBackup = backupsSnapshot.empty ? null : backupsSnapshot.docs[0].data().createdAt;

    // Fetch system metrics (stubbed, but try to get real if possible)
    let systemHealth = 98;
    try {
      const sysRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/admin/system-metrics`, {
        headers: request.headers,
        method: 'GET',
      });
      if (sysRes.ok) {
        const sysMetrics = await sysRes.json();
        // Compute health as the lowest status (good=100, warning=80, critical=50)
        const statusMap = { good: 100, warning: 80, critical: 50 };
        const healths = Object.values(sysMetrics).map((m: any) => {
          const status = typeof m.status === 'string' ? m.status : 'good';
          return status in statusMap ? statusMap[status as keyof typeof statusMap] : 100;
        });
        systemHealth = Math.min(...healths);
      }
    } catch {}

    const metrics = {
      totalUsers,
      activeUsers,
      securityAlerts,
      rateLimitViolations,
      authFailures,
      permissionDenials,
      systemHealth,
      lastBackup,
      suspiciousActivity,
    };

    securityLogger.log({
      type: SecurityEventType.API_ACCESS,
      severity: SecuritySeverity.LOW,
      userId: adminUser.id,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      endpoint: '/api/admin/security-metrics',
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
      endpoint: '/api/admin/security-metrics',
      method: 'GET',
      details: { 
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 