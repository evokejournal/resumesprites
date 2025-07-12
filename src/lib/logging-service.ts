import { SecurityEvent } from './security-logger';

// Logging service providers
export enum LoggingProvider {
  CONSOLE = 'console',
  CLOUDWATCH = 'cloudwatch',
  LOGGLY = 'loggly',
  SENTRY = 'sentry',
  CUSTOM = 'custom',
}

// Logging service configuration
interface LoggingConfig {
  provider: LoggingProvider;
  endpoint?: string;
  apiKey?: string;
  region?: string;
  logGroup?: string;
  logStream?: string;
  batchSize?: number;
  flushInterval?: number;
}

// Base logging service interface
interface LoggingService {
  log(event: SecurityEvent): Promise<void>;
  logBatch(events: SecurityEvent[]): Promise<void>;
  flush(): Promise<void>;
}

// Console logging service (development)
class ConsoleLoggingService implements LoggingService {
  async log(event: SecurityEvent): Promise<void> {
    console.log(`[SECURITY] ${event.type}:`, {
      timestamp: event.timestamp,
      severity: event.severity,
      userId: event.userId,
      ip: event.ip,
      endpoint: event.endpoint,
      method: event.method,
      details: event.details,
    });
  }

  async logBatch(events: SecurityEvent[]): Promise<void> {
    for (const event of events) {
      await this.log(event);
    }
  }

  async flush(): Promise<void> {
    // No-op for console logging
  }
}

// Custom HTTP logging service
class CustomLoggingService implements LoggingService {
  private endpoint: string;
  private apiKey?: string;
  private batchQueue: SecurityEvent[] = [];
  private batchSize: number;
  private flushInterval: number;
  private flushTimer?: NodeJS.Timeout;

  constructor(config: LoggingConfig) {
    this.endpoint = config.endpoint!;
    this.apiKey = config.apiKey;
    this.batchSize = config.batchSize || 10;
    this.flushInterval = config.flushInterval || 5000; // 5 seconds

    // Set up periodic flushing
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  async log(event: SecurityEvent): Promise<void> {
    this.batchQueue.push(event);

    if (this.batchQueue.length >= this.batchSize) {
      await this.flush();
    }
  }

  async logBatch(events: SecurityEvent[]): Promise<void> {
    this.batchQueue.push(...events);

    if (this.batchQueue.length >= this.batchSize) {
      await this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.batchQueue.length === 0) return;

    const events = [...this.batchQueue];
    this.batchQueue = [];

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
        },
        body: JSON.stringify({ events }),
      });

      if (!response.ok) {
        console.error('Failed to send logs to external service:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending logs to external service:', error);
    }
  }

  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
  }
}

// Sentry logging service
class SentryLoggingService implements LoggingService {
  private dsn: string;

  constructor(config: LoggingConfig) {
    this.dsn = config.endpoint!;
  }

  async log(event: SecurityEvent): Promise<void> {
    // Only log high severity events to Sentry
    if (event.severity === 'high' || event.severity === 'critical') {
      try {
        await fetch(this.dsn, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `Security Event: ${event.type}`,
            level: event.severity,
            tags: {
              type: event.type,
              userId: event.userId,
              ip: event.ip,
            },
            extra: event.details,
          }),
        });
      } catch (error) {
        console.error('Failed to send to Sentry:', error);
      }
    }
  }

  async logBatch(events: SecurityEvent[]): Promise<void> {
    for (const event of events) {
      await this.log(event);
    }
  }

  async flush(): Promise<void> {
    // No-op for Sentry
  }
}

// Logging service factory
export class LoggingServiceFactory {
  private static instance: LoggingService | null = null;

  static getInstance(): LoggingService {
    if (!this.instance) {
      const provider = (process.env.LOGGING_PROVIDER as LoggingProvider) || LoggingProvider.CONSOLE;
      
      switch (provider) {
        case LoggingProvider.CUSTOM:
          this.instance = new CustomLoggingService({
            provider: LoggingProvider.CUSTOM,
            endpoint: process.env.LOGGING_ENDPOINT!,
            apiKey: process.env.LOGGING_API_KEY,
            batchSize: parseInt(process.env.LOGGING_BATCH_SIZE || '10'),
            flushInterval: parseInt(process.env.LOGGING_FLUSH_INTERVAL || '5000'),
          });
          break;
        
        case LoggingProvider.SENTRY:
          this.instance = new SentryLoggingService({
            provider: LoggingProvider.SENTRY,
            endpoint: process.env.SENTRY_DSN!,
          });
          break;
        
        case LoggingProvider.CONSOLE:
        default:
          this.instance = new ConsoleLoggingService();
          break;
      }
    }

    return this.instance;
  }

  static destroy(): void {
    if (this.instance && 'destroy' in this.instance) {
      (this.instance as any).destroy();
    }
    this.instance = null;
  }
}

// Utility functions for external logging
export async function sendToExternalLogging(event: SecurityEvent): Promise<void> {
  const loggingService = LoggingServiceFactory.getInstance();
  await loggingService.log(event);
}

export async function sendBatchToExternalLogging(events: SecurityEvent[]): Promise<void> {
  const loggingService = LoggingServiceFactory.getInstance();
  await loggingService.logBatch(events);
}

// Alert system for critical security events
export async function sendSecurityAlert(event: SecurityEvent): Promise<void> {
  if (event.severity === 'critical' || event.severity === 'high') {
    // Send to external alerting service (e.g., Slack, email, PagerDuty)
    const alertEndpoint = process.env.SECURITY_ALERT_ENDPOINT;
    
    if (alertEndpoint) {
      try {
        await fetch(alertEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `Security Alert: ${event.type}`,
            severity: event.severity,
            message: `Security event detected on ${event.endpoint}`,
            details: event,
            timestamp: event.timestamp,
          }),
        });
      } catch (error) {
        console.error('Failed to send security alert:', error);
      }
    }
  }
} 