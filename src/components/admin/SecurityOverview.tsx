"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  Activity
} from 'lucide-react';

interface SecurityOverviewProps {
  adminUserId: string;
}

interface SecurityMetrics {
  totalUsers: number;
  activeUsers: number;
  securityAlerts: number;
  rateLimitViolations: number;
  authFailures: number;
  permissionDenials: number;
  systemHealth: number;
  lastBackup: string;
  suspiciousActivity: number;
}

interface SecurityLog {
  id: string;
  timestamp: string;
  level: string;
  category: string;
  message: string;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
}

export function SecurityOverview({ adminUserId }: SecurityOverviewProps) {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalUsers: 1234,
    activeUsers: 89,
    securityAlerts: 3,
    rateLimitViolations: 12,
    authFailures: 8,
    permissionDenials: 5,
    systemHealth: 98,
    lastBackup: '2024-01-15T10:30:00Z',
    suspiciousActivity: 2,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [logsError, setLogsError] = useState('');

  useEffect(() => {
    fetchSecurityMetrics();
    fetchSecurityLogs();
  }, [adminUserId]);

  const fetchSecurityMetrics = async () => {
    try {
      const response = await fetch('/api/admin/security-metrics', {
        headers: {
          'x-user-id': adminUserId,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch security metrics');
      const data = await response.json();
      setMetrics(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch security metrics:', error);
      setIsLoading(false);
    }
  };

  const fetchSecurityLogs = async () => {
    try {
      setLogsLoading(true);
      const response = await fetch('/api/admin/security-logs', {
        headers: {
          'x-user-id': adminUserId,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch security logs');
      const data = await response.json();
      setLogs(data);
      setLogsLoading(false);
    } catch (error: any) {
      setLogsError(error.message || 'Error loading logs');
      setLogsLoading(false);
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-green-600';
    if (health >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthStatus = (health: number) => {
    if (health >= 90) return 'Excellent';
    if (health >= 70) return 'Good';
    if (health >= 50) return 'Fair';
    return 'Poor';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Security Overview</CardTitle>
            <CardDescription>Loading security metrics...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            System Health Overview
          </CardTitle>
          <CardDescription>
            Real-time security and system status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall System Health</span>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${getHealthColor(metrics.systemHealth)}`}>
                {metrics.systemHealth}%
              </span>
              <Badge variant={metrics.systemHealth >= 90 ? 'default' : 'secondary'}>
                {getHealthStatus(metrics.systemHealth)}
              </Badge>
            </div>
          </div>
          <Progress value={metrics.systemHealth} className="h-2" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.totalUsers}</div>
              <div className="text-xs text-muted-foreground">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{metrics.activeUsers}</div>
              <div className="text-xs text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{metrics.securityAlerts}</div>
              <div className="text-xs text-muted-foreground">Security Alerts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{metrics.suspiciousActivity}</div>
              <div className="text-xs text-muted-foreground">Suspicious Activity</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Incidents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Recent Security Incidents
            </CardTitle>
            <CardDescription>Last 24 hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium">Rate Limit Violations</span>
              </div>
              <Badge variant="destructive">{metrics.rateLimitViolations}</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium">Authentication Failures</span>
              </div>
              <Badge variant="destructive">{metrics.authFailures}</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium">Permission Denials</span>
              </div>
              <Badge variant="secondary">{metrics.permissionDenials}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              View Security Logs
            </Button>
            
            <Button className="w-full justify-start" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            
            <Button className="w-full justify-start" variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              Security Settings
            </Button>
            
            <Button className="w-full justify-start" variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              Schedule Backup
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Security Activity
          </CardTitle>
          <CardDescription>Latest security events and actions</CardDescription>
        </CardHeader>
        <CardContent>
          {logsLoading ? (
            <div className="animate-pulse space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-100 rounded" />
              ))}
            </div>
          ) : logsError ? (
            <div className="text-red-600">{logsError}</div>
          ) : logs.length === 0 ? (
            <div className="text-muted-foreground">No recent security activity.</div>
          ) : (
            <div className="space-y-3">
              {logs.slice(0, 8).map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${log.level === 'error' || log.level === 'critical' ? 'bg-red-500' : log.level === 'warning' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                    <div>
                      <div className="text-sm font-medium">{log.message}</div>
                      <div className="text-xs text-muted-foreground">
                        {log.userEmail || log.userId || log.ipAddress || 'System'} • {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <Badge variant={log.level === 'error' || log.level === 'critical' ? 'destructive' : log.level === 'warning' ? 'secondary' : 'outline'}>
                    {log.category}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 