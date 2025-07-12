import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import adminApp from './firebase-admin';

// User roles
export enum UserRole {
  USER = 'user',
  PREMIUM = 'premium',
  ADMIN = 'admin',
}

// Permission types
export enum Permission {
  CREATE_RESUME = 'create:resume',
  READ_RESUME = 'read:resume',
  UPDATE_RESUME = 'update:resume',
  DELETE_RESUME = 'delete:resume',
  CREATE_LINK = 'create:link',
  READ_LINK = 'read:link',
  DELETE_LINK = 'delete:link',
  UPLOAD_FILE = 'upload:file',
  USE_AI = 'use:ai',
  ACCESS_PREMIUM_TEMPLATES = 'access:premium_templates',
  MANAGE_USERS = 'manage:users',
  VIEW_ANALYTICS = 'view:analytics',
}

// Role permissions mapping
const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.USER]: [
    Permission.CREATE_RESUME,
    Permission.READ_RESUME,
    Permission.UPDATE_RESUME,
    Permission.DELETE_RESUME,
    Permission.CREATE_LINK,
    Permission.READ_LINK,
    Permission.DELETE_LINK,
    Permission.UPLOAD_FILE,
    Permission.USE_AI,
  ],
  [UserRole.PREMIUM]: [
    Permission.CREATE_RESUME,
    Permission.READ_RESUME,
    Permission.UPDATE_RESUME,
    Permission.DELETE_RESUME,
    Permission.CREATE_LINK,
    Permission.READ_LINK,
    Permission.DELETE_LINK,
    Permission.UPLOAD_FILE,
    Permission.USE_AI,
    Permission.ACCESS_PREMIUM_TEMPLATES,
  ],
  [UserRole.ADMIN]: [
    Permission.CREATE_RESUME,
    Permission.READ_RESUME,
    Permission.UPDATE_RESUME,
    Permission.DELETE_RESUME,
    Permission.CREATE_LINK,
    Permission.READ_LINK,
    Permission.DELETE_LINK,
    Permission.UPLOAD_FILE,
    Permission.USE_AI,
    Permission.ACCESS_PREMIUM_TEMPLATES,
    Permission.MANAGE_USERS,
    Permission.VIEW_ANALYTICS,
  ],
};

// User interface with role information
export interface AuthenticatedUser {
  uid: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  isPremium: boolean;
  isAdmin: boolean;
}

// Get user role from Firebase custom claims
async function getUserRole(uid: string): Promise<UserRole> {
  try {
    const userRecord = await getAuth(adminApp).getUser(uid);
    const customClaims = userRecord.customClaims || {};
    return customClaims.role || UserRole.USER;
  } catch (error) {
    console.error('Error getting user role:', error);
    return UserRole.USER;
  }
}

// Set user role (admin only)
export async function setUserRole(uid: string, role: UserRole): Promise<void> {
  try {
    await getAuth(adminApp).setCustomUserClaims(uid, { role });
  } catch (error) {
    console.error('Error setting user role:', error);
    throw error;
  }
}

// Get authenticated user with role and permissions
export async function getAuthenticatedUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decodedToken = await getAuth(adminApp).verifyIdToken(token);
    const role = await getUserRole(decodedToken.uid);
    
    return {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      role,
      permissions: rolePermissions[role],
      isPremium: role === UserRole.PREMIUM || role === UserRole.ADMIN,
      isAdmin: role === UserRole.ADMIN,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

// Check if user has specific permission
export function hasPermission(user: AuthenticatedUser, permission: Permission): boolean {
  return user.permissions.includes(permission);
}

// Check if user has any of the specified permissions
export function hasAnyPermission(user: AuthenticatedUser, permissions: Permission[]): boolean {
  return permissions.some(permission => user.permissions.includes(permission));
}

// Check if user has all of the specified permissions
export function hasAllPermissions(user: AuthenticatedUser, permissions: Permission[]): boolean {
  return permissions.every(permission => user.permissions.includes(permission));
}

// Authorization middleware
export function requirePermission(permission: Permission) {
  return async function authMiddleware(request: NextRequest): Promise<NextResponse | null> {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    if (!hasPermission(user, permission)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }
    
    // Add user to request context
    (request as any).user = user;
    return null;
  };
}

// Require multiple permissions (any of them)
export function requireAnyPermission(permissions: Permission[]) {
  return async function authMiddleware(request: NextRequest): Promise<NextResponse | null> {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    if (!hasAnyPermission(user, permissions)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }
    
    (request as any).user = user;
    return null;
  };
}

// Require all permissions
export function requireAllPermissions(permissions: Permission[]) {
  return async function authMiddleware(request: NextRequest): Promise<NextResponse | null> {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    if (!hasAllPermissions(user, permissions)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }
    
    (request as any).user = user;
    return null;
  };
}

// Require premium subscription
export function requirePremium() {
  return async function authMiddleware(request: NextRequest): Promise<NextResponse | null> {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    if (!user.isPremium) {
      return NextResponse.json({ error: 'Premium subscription required' }, { status: 403 });
    }
    
    (request as any).user = user;
    return null;
  };
}

// Require admin role
export function requireAdmin() {
  return async function authMiddleware(request: NextRequest): Promise<NextResponse | null> {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    if (!user.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    (request as any).user = user;
    return null;
  };
}

// Utility to get user from request (after middleware)
export function getUserFromRequest(request: NextRequest): AuthenticatedUser {
  return (request as any).user;
} 