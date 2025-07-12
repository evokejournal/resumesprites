# Admin Dashboard Documentation

## Overview

The Admin Dashboard provides comprehensive security monitoring, user management, and system administration capabilities for ResumeSprites. It's designed with enterprise-level security features and real-time monitoring.

## Access

### Prerequisites
- Admin user account with elevated permissions
- Valid authentication token

### Getting Access
1. Navigate to `/admin` in your browser
2. Enter your admin user ID when prompted
3. The system will validate your admin privileges

### Admin User Setup
To set up an admin user:
1. Use the Firebase Admin SDK to set custom claims
2. Set the user's role to 'admin' in their custom claims
3. The user will automatically see the Admin link in the sidebar

## Features

### 1. Security Overview
- **Real-time System Health**: Monitor CPU, memory, disk, and network usage
- **Security Alerts**: View recent security incidents and suspicious activity
- **Quick Actions**: Access common administrative tasks
- **Recent Activity**: Monitor latest security events

### 2. User Management
- **User List**: View all registered users with filtering and search
- **User Actions**: Suspend, activate, or delete user accounts
- **Role Management**: View and manage user roles and permissions
- **User Statistics**: Monitor user activity and subscription status

### 3. Security Logs
- **Event Logging**: Comprehensive security event tracking
- **Filtering**: Filter logs by level, category, and time range
- **Export**: Download security logs in CSV format
- **Real-time Monitoring**: Live updates of security events

### 4. System Metrics
- **Performance Monitoring**: Track system performance metrics
- **Resource Utilization**: Monitor CPU, memory, disk, and network usage
- **Response Time**: Track API response times and error rates
- **Alerts**: Configure and monitor system alerts

### 5. Backup Management
- **Backup History**: View all system backups
- **Manual Backups**: Create on-demand backups
- **Restore Operations**: Restore from backup files
- **Configuration**: Manage backup schedules and settings

## Security Features

### Authentication & Authorization
- **Role-Based Access Control (RBAC)**: Strict permission management
- **Admin Authentication**: Multi-factor authentication for admin access
- **Session Management**: Secure session handling with automatic timeouts

### Rate Limiting
- **API Protection**: Rate limiting on all admin endpoints
- **Brute Force Protection**: Prevents automated attacks
- **Configurable Limits**: Adjustable rate limits per endpoint

### Logging & Monitoring
- **Security Logging**: Comprehensive security event logging
- **Audit Trails**: Complete audit trail for all admin actions
- **Real-time Alerts**: Immediate notification of security incidents

### Data Protection
- **Encryption**: All sensitive data encrypted at rest and in transit
- **Input Validation**: Strict input validation and sanitization
- **SQL Injection Protection**: Parameterized queries and input sanitization

## API Endpoints

### Security Metrics
```
GET /api/admin/security-metrics
```
Returns real-time security metrics and system health data.

### User Management
```
GET /api/admin/users
```
Returns list of all users with filtering and pagination.

### System Metrics
```
GET /api/admin/system-metrics?range=24h
```
Returns system performance metrics for specified time range.

### Security Logs
```
GET /api/admin/security-logs?level=warning&category=auth
```
Returns filtered security logs with various query parameters.

### Backup Management
```
GET /api/admin/backups
POST /api/admin/backups
DELETE /api/admin/backups/:id
```
Manage system backups and restoration.

## Configuration

### Environment Variables
```bash
# Admin access
ADMIN_EMAIL=admin@resumesprites.com
ADMIN_USER_ID=your-admin-user-id

# Security settings
SECURITY_LOG_LEVEL=info
RATE_LIMIT_ENABLED=true
ENCRYPTION_ENABLED=true

# Monitoring
MONITORING_ENABLED=true
ALERT_EMAIL=alerts@resumesprites.com
```

### Security Settings
- **Session Timeout**: 30 minutes for admin sessions
- **Rate Limits**: 100 requests per 15 minutes for admin APIs
- **Log Retention**: 90 days for security logs
- **Backup Retention**: 30 days for automated backups

## Best Practices

### Access Control
1. **Principle of Least Privilege**: Only grant necessary permissions
2. **Regular Access Reviews**: Review admin access quarterly
3. **Multi-Factor Authentication**: Enable MFA for all admin accounts
4. **Session Management**: Use secure sessions with automatic timeouts

### Monitoring
1. **Real-time Alerts**: Set up alerts for critical security events
2. **Regular Audits**: Conduct regular security audits
3. **Log Analysis**: Regularly analyze security logs for patterns
4. **Performance Monitoring**: Monitor system performance continuously

### Data Protection
1. **Encryption**: Ensure all sensitive data is encrypted
2. **Backup Security**: Secure backup storage and access
3. **Data Retention**: Follow data retention policies
4. **Privacy Compliance**: Ensure GDPR and privacy compliance

## Troubleshooting

### Common Issues

#### Access Denied
- Verify admin user ID is correct
- Check user has admin role in Firebase
- Ensure authentication token is valid

#### Rate Limit Exceeded
- Wait for rate limit window to reset
- Contact system administrator if persistent
- Check for automated requests or bots

#### Performance Issues
- Monitor system resources
- Check for high CPU or memory usage
- Review recent changes or deployments

### Support
For admin dashboard issues:
1. Check security logs for error details
2. Review system metrics for performance issues
3. Contact system administrator with error details
4. Include relevant logs and metrics in support requests

## Development

### Adding New Features
1. Follow security-first development practices
2. Implement proper authentication and authorization
3. Add comprehensive logging for all actions
4. Include input validation and sanitization
5. Test thoroughly in staging environment

### Security Considerations
- Always validate admin permissions
- Log all administrative actions
- Implement rate limiting on new endpoints
- Use parameterized queries for database operations
- Encrypt sensitive data in transit and at rest 