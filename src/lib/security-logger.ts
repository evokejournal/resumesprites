import { NextRequest } from 'next/server';

// Security event types
export enum SecurityEventType {
  AUTH_SUCCESS = 'auth_success',
  AUTH_FAILURE = 'auth_failure',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  PERMISSION_DENIED = 'permission_denied',
  INVALID_INPUT = 'invalid_input',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  FILE_UPLOAD = 'file_upload',
  API_ACCESS = 'api_access',
  ERROR = 'error',
}

// Security event severity levels
export enum SecuritySeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Security event interface
export interface SecurityEvent {
  timestamp: string;
  type: SecurityEventType;
  severity: SecuritySeverity;
  userId?: string;
  ip: string;
  userAgent: string;
  endpoint: string;
  method: string;
  details: Record<string, any>;
  sessionId?: string;
}

// Security logger class
class SecurityLogger {
  private events: SecurityEvent[] = [];
  private readonly maxEvents = 1000; // Keep last 1000 events in memory

  // Log a security event
  log(event: Omit<SecurityEvent, 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date().toISOString(),
    };

    // Add to memory buffer
    this.events.push(securityEvent);
    
    // Keep only the last maxEvents
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[SECURITY] ${securityEvent.type}:`, securityEvent);
    }

    // In production, you would send this to a logging service
    // like CloudWatch, Loggly, or a custom logging endpoint
    this.sendToLoggingService(securityEvent);
  }

  // Send event to external logging service
  private async sendToLoggingService(event: SecurityEvent): Promise<void> {
    try {
      const { sendToExternalLogging, sendSecurityAlert } = await import('./logging-service');
      
      // Send to external logging service
      await sendToExternalLogging(event);
      
      // Send alerts for critical events
      await sendSecurityAlert(event);
    } catch (error) {
      console.error('Failed to send security event to logging service:', error);
    }
  }

  // Get recent events
  getRecentEvents(limit: number = 100): SecurityEvent[] {
    return this.events.slice(-limit);
  }

  // Get events by type
  getEventsByType(type: SecurityEventType): SecurityEvent[] {
    return this.events.filter(event => event.type === type);
  }

  // Get events by severity
  getEventsBySeverity(severity: SecuritySeverity): SecurityEvent[] {
    return this.events.filter(event => event.severity === severity);
  }

  // Get events for a specific user
  getEventsByUser(userId: string): SecurityEvent[] {
    return this.events.filter(event => event.userId === userId);
  }

  // Check for suspicious activity
  detectSuspiciousActivity(userId?: string): SecurityEvent[] {
    const recentEvents = this.getRecentEvents(100);
    const suspicious: SecurityEvent[] = [];

    // Check for multiple auth failures
    const authFailures = recentEvents.filter(
      event => event.type === SecurityEventType.AUTH_FAILURE
    );
    
    if (authFailures.length >= 5) {
      suspicious.push(...authFailures);
    }

    // Check for rate limit violations
    const rateLimitViolations = recentEvents.filter(
      event => event.type === SecurityEventType.RATE_LIMIT_EXCEEDED
    );
    
    if (rateLimitViolations.length >= 3) {
      suspicious.push(...rateLimitViolations);
    }

    // Check for permission denials
    const permissionDenials = recentEvents.filter(
      event => event.type === SecurityEventType.PERMISSION_DENIED
    );
    
    if (permissionDenials.length >= 10) {
      suspicious.push(...permissionDenials);
    }

    return suspicious;
  }
}

// Global security logger instance
export const securityLogger = new SecurityLogger();

// Utility functions for logging common security events
export function logAuthSuccess(request: NextRequest, userId: string): void {
  securityLogger.log({
    type: SecurityEventType.AUTH_SUCCESS,
    severity: SecuritySeverity.LOW,
    userId,
    ip: getClientIP(request),
    userAgent: request.headers.get('user-agent') || 'unknown',
    endpoint: request.nextUrl.pathname,
    method: request.method,
    details: { success: true },
  });
}

export function logAuthFailure(request: NextRequest, reason: string): void {
  securityLogger.log({
    type: SecurityEventType.AUTH_FAILURE,
    severity: SecuritySeverity.MEDIUM,
    ip: getClientIP(request),
    userAgent: request.headers.get('user-agent') || 'unknown',
    endpoint: request.nextUrl.pathname,
    method: request.method,
    details: { reason },
  });
}

export function logRateLimitExceeded(request: NextRequest, limit: number): void {
  securityLogger.log({
    type: SecurityEventType.RATE_LIMIT_EXCEEDED,
    severity: SecuritySeverity.MEDIUM,
    ip: getClientIP(request),
    userAgent: request.headers.get('user-agent') || 'unknown',
    endpoint: request.nextUrl.pathname,
    method: request.method,
    details: { limit },
  });
}

export function logPermissionDenied(request: NextRequest, userId: string, permission: string): void {
  securityLogger.log({
    type: SecurityEventType.PERMISSION_DENIED,
    severity: SecuritySeverity.HIGH,
    userId,
    ip: getClientIP(request),
    userAgent: request.headers.get('user-agent') || 'unknown',
    endpoint: request.nextUrl.pathname,
    method: request.method,
    details: { permission },
  });
}

export function logInvalidInput(request: NextRequest, userId: string, errors: string[]): void {
  securityLogger.log({
    type: SecurityEventType.INVALID_INPUT,
    severity: SecuritySeverity.LOW,
    userId,
    ip: getClientIP(request),
    userAgent: request.headers.get('user-agent') || 'unknown',
    endpoint: request.nextUrl.pathname,
    method: request.method,
    details: { errors },
  });
}

export function logFileUpload(request: NextRequest, userId: string, fileInfo: { name: string; size: number; type: string }): void {
  securityLogger.log({
    type: SecurityEventType.FILE_UPLOAD,
    severity: SecuritySeverity.LOW,
    userId,
    ip: getClientIP(request),
    userAgent: request.headers.get('user-agent') || 'unknown',
    endpoint: request.nextUrl.pathname,
    method: request.method,
    details: fileInfo,
  });
}

export function logApiAccess(request: NextRequest, userId: string, success: boolean): void {
  securityLogger.log({
    type: SecurityEventType.API_ACCESS,
    severity: success ? SecuritySeverity.LOW : SecuritySeverity.MEDIUM,
    userId,
    ip: getClientIP(request),
    userAgent: request.headers.get('user-agent') || 'unknown',
    endpoint: request.nextUrl.pathname,
    method: request.method,
    details: { success },
  });
}

export function logError(request: NextRequest, error: Error, userId?: string): void {
  securityLogger.log({
    type: SecurityEventType.ERROR,
    severity: SecuritySeverity.HIGH,
    userId,
    ip: getClientIP(request),
    userAgent: request.headers.get('user-agent') || 'unknown',
    endpoint: request.nextUrl.pathname,
    method: request.method,
    details: { 
      message: error.message,
      stack: error.stack,
      name: error.name,
    },
  });
}

// Utility to get client IP
function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for') || 
         request.headers.get('x-real-ip') || 
         'unknown';
}

// Middleware to automatically log API access
export function withSecurityLogging(request: NextRequest, userId?: string) {
  const startTime = Date.now();
  
  return {
    logSuccess: () => {
      const duration = Date.now() - startTime;
      logApiAccess(request, userId || 'anonymous', true);
    },
    logError: (error: Error) => {
      const duration = Date.now() - startTime;
      logError(request, error, userId);
    },
  };
} 