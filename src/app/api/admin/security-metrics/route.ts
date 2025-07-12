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

    // TODO: Fetch other metrics from Firestore/logging if available
    const metrics = {
      totalUsers,
      activeUsers,
      securityAlerts: 3, // Stubbed
      rateLimitViolations: 12, // Stubbed
      authFailures: 8, // Stubbed
      permissionDenials: 5, // Stubbed
      systemHealth: 98, // Stubbed
      lastBackup: new Date().toISOString(), // Stubbed
      suspiciousActivity: 2, // Stubbed
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