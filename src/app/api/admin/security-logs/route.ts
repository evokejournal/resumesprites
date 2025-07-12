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
        endpoint: '/api/admin/security-logs',
        method: 'GET',
        details: { endpoint: '/api/admin/security-logs' }
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
        endpoint: '/api/admin/security-logs',
        method: 'GET',
        details: { endpoint: '/api/admin/security-logs' }
      });
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const adminUser = authResult.user;
    if (!adminUser) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }

    // Fetch security logs from Firestore
    const logsSnapshot = await adminDb.collection('securityLogs').orderBy('timestamp', 'desc').limit(100).get();
    const logs = logsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        timestamp: data.timestamp || '',
        level: data.level || 'info',
        category: data.category || 'system',
        message: data.message || '',
        userId: data.userId || '',
        userEmail: data.userEmail || '',
        ipAddress: data.ipAddress || '',
        userAgent: data.userAgent || '',
        details: data.details || {},
      };
    });

    securityLogger.log({
      type: SecurityEventType.API_ACCESS,
      severity: SecuritySeverity.LOW,
      userId: adminUser.id,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      endpoint: '/api/admin/security-logs',
      method: 'GET',
      details: { success: true, logCount: logs.length }
    });

    return NextResponse.json(logs);
  } catch (error) {
    securityLogger.log({
      type: SecurityEventType.ERROR,
      severity: SecuritySeverity.HIGH,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      endpoint: '/api/admin/security-logs',
      method: 'GET',
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 