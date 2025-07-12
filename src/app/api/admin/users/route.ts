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
        endpoint: '/api/admin/users',
        method: 'GET',
        details: { endpoint: '/api/admin/users' }
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
        endpoint: '/api/admin/users',
        method: 'GET',
        details: { endpoint: '/api/admin/users' }
      });
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const adminUser = authResult.user;
    if (!adminUser) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }

    // Fetch real users from Firestore
    const usersSnapshot = await adminDb.collection('users').get();
    const users = usersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        email: data.email || '',
        name: data.name || '',
        role: data.role || 'user',
        status: data.status || 'active',
        lastLogin: data.lastLogin || '',
        createdAt: data.createdAt || '',
        resumeCount: data.resumeCount || 0,
        subscription: data.subscription || 'free',
      };
    });

    securityLogger.log({
      type: SecurityEventType.API_ACCESS,
      severity: SecuritySeverity.LOW,
      userId: adminUser.id,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      endpoint: '/api/admin/users',
      method: 'GET',
      details: { success: true, userCount: users.length }
    });

    return NextResponse.json(users);
  } catch (error) {
    securityLogger.log({
      type: SecurityEventType.ERROR,
      severity: SecuritySeverity.HIGH,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      endpoint: '/api/admin/users',
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