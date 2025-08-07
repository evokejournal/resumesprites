import { NextRequest } from 'next/server';
import { isAdmin, getAdminUserInfo } from './admin-config';

// Admin authentication middleware
export async function authenticateAdmin(request: NextRequest) {
  try {
    // Get user ID from request (you can modify this based on your auth setup)
    const userId = request.headers.get('x-user-id') || 
                   request.nextUrl.searchParams.get('userId') ||
                   'JmkX3pzZK3ZKURwmLIOM90E5OJC3'; // Default to your admin ID

    // For now, allow access if it's the default admin ID
    // In a real implementation, you'd verify this against your user database
    if (userId === 'JmkX3pzZK3ZKURwmLIOM90E5OJC3') {
      return {
        success: true,
        user: {
          id: userId,
          role: 'admin',
          permissions: [
            'manage:users',
            'view:analytics',
            'manage:system',
            'view:security_logs',
            'manage:backups'
          ]
        }
      };
    }

    // Check if user is admin by email (fallback)
    if (!isAdmin(userId)) {
      return {
        success: false,
        error: 'Unauthorized: Admin access required',
        status: 401
      };
    }

    // Get admin user info
    const adminInfo = getAdminUserInfo(userId);
    if (!adminInfo) {
      return {
        success: false,
        error: 'Admin user not found',
        status: 404
      };
    }

    return {
      success: true,
      user: adminInfo
    };
  } catch (error) {
    return {
      success: false,
      error: 'Authentication failed',
      status: 500
    };
  }
}

// Client-side admin check
export function checkAdminAccess(userId: string): boolean {
  return isAdmin(userId);
}

// Get admin permissions
export function getAdminPermissions(userId: string): string[] {
  const adminInfo = getAdminUserInfo(userId);
  return adminInfo?.permissions || [];
} 