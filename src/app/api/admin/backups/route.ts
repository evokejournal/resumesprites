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
        endpoint: '/api/admin/backups',
        method: 'GET',
        details: { endpoint: '/api/admin/backups' }
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
        endpoint: '/api/admin/backups',
        method: 'GET',
        details: { endpoint: '/api/admin/backups' }
      });
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const adminUser = authResult.user;
    if (!adminUser) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }

    // Fetch backups from Firestore
    const backupsSnapshot = await adminDb.collection('backups').orderBy('createdAt', 'desc').limit(100).get();
    const backups = backupsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || '',
        type: data.type || 'full',
        status: data.status || 'completed',
        size: data.size || '',
        createdAt: data.createdAt || '',
        completedAt: data.completedAt || '',
        duration: data.duration || '',
        location: data.location || 'cloud',
        retention: data.retention || '',
        compression: data.compression || false,
        encryption: data.encryption || false,
      };
    });

    securityLogger.log({
      type: SecurityEventType.API_ACCESS,
      severity: SecuritySeverity.LOW,
      userId: adminUser.id,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      endpoint: '/api/admin/backups',
      method: 'GET',
      details: { success: true, backupCount: backups.length }
    });

    return NextResponse.json(backups);
  } catch (error) {
    securityLogger.log({
      type: SecurityEventType.ERROR,
      severity: SecuritySeverity.HIGH,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      endpoint: '/api/admin/backups',
      method: 'GET',
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimiters.api(request);
    if (rateLimitResult) return rateLimitResult;
    // Admin authentication
    const authResult = await authenticateAdmin(request);
    if (!authResult.success) return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    const adminUser = authResult.user;
    if (!adminUser) return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    // Simulate backup creation
    const now = new Date();
    const backupDoc = await adminDb.collection('backups').add({
      name: `Backup ${now.toISOString()}`,
      type: 'full',
      status: 'completed',
      size: '100MB',
      createdAt: now.toISOString(),
      completedAt: now.toISOString(),
      duration: '1m',
      location: 'cloud',
      retention: '30d',
      compression: true,
      encryption: true,
    });
    securityLogger.log({
      type: SecurityEventType.API_ACCESS,
      severity: SecuritySeverity.MEDIUM,
      userId: adminUser.id,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      endpoint: '/api/admin/backups',
      method: 'POST',
      details: { backupId: backupDoc.id }
    });
    return NextResponse.json({ success: true, backupId: backupDoc.id });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimiters.api(request);
    if (rateLimitResult) return rateLimitResult;
    // Admin authentication
    const authResult = await authenticateAdmin(request);
    if (!authResult.success) return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    const adminUser = authResult.user;
    if (!adminUser) return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    const { backupId } = await request.json();
    if (!backupId) return NextResponse.json({ error: 'Missing backupId' }, { status: 400 });
    const backupRef = adminDb.collection('backups').doc(backupId);
    await backupRef.update({ status: 'restoring' });
    securityLogger.log({
      type: SecurityEventType.API_ACCESS,
      severity: SecuritySeverity.HIGH,
      userId: adminUser.id,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      endpoint: '/api/admin/backups',
      method: 'PATCH',
      details: { action: 'restore', backupId }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimiters.api(request);
    if (rateLimitResult) return rateLimitResult;
    // Admin authentication
    const authResult = await authenticateAdmin(request);
    if (!authResult.success) return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    const adminUser = authResult.user;
    if (!adminUser) return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    const { backupId } = await request.json();
    if (!backupId) return NextResponse.json({ error: 'Missing backupId' }, { status: 400 });
    const backupRef = adminDb.collection('backups').doc(backupId);
    await backupRef.delete();
    securityLogger.log({
      type: SecurityEventType.API_ACCESS,
      severity: SecuritySeverity.HIGH,
      userId: adminUser.id,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      endpoint: '/api/admin/backups',
      method: 'DELETE',
      details: { action: 'delete', backupId }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 