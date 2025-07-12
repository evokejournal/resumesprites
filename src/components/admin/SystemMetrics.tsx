"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Database,
  Cpu,
  HardDrive,
  Network,
  Zap,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface SystemMetricsProps {
  adminUserId: string;
}

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
  threshold: number;
}

interface PerformanceMetrics {
  cpu: SystemMetric;
  memory: SystemMetric;
  disk: SystemMetric;
  network: SystemMetric;
  responseTime: SystemMetric;
  errorRate: SystemMetric;
}

export function SystemMetrics({ adminUserId }: SystemMetricsProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cpu: {
      name: 'CPU Usage',
      value: 45,
      unit: '%',
      trend: 'up',
      status: 'good',
      threshold: 80
    },
    memory: {
      name: 'Memory Usage',
      value: 72,
      unit: '%',
      trend: 'up',
      status: 'warning',
      threshold: 85
    },
    disk: {
      name: 'Disk Usage',
      value: 68,
      unit: '%',
      trend: 'stable',
      status: 'good',
      threshold: 90
    },
    network: {
      name: 'Network I/O',
      value: 125,
      unit: 'MB/s',
      trend: 'down',
      status: 'good',
      threshold: 500
    },
    responseTime: {
      name: 'Response Time',
      value: 245,
      unit: 'ms',
      trend: 'down',
      status: 'good',
      threshold: 1000
    },
    errorRate: {
      name: 'Error Rate',
      value: 0.8,
      unit: '%',
      trend: 'up',
      status: 'warning',
      threshold: 2.0
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');

  useEffect(() => {
    fetchSystemMetrics();
  }, [adminUserId, timeRange]);

  const fetchSystemMetrics = async () => {
    try {
      const response = await fetch(`/api/admin/system-metrics?range=${timeRange}`);
      if (!response.ok) throw new Error('Failed to fetch system metrics');
      const data = await response.json();
      setMetrics(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch system metrics:', error);
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>System Metrics</CardTitle>
            <CardDescription>Loading system performance data...</CardDescription>
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
      {/* Time Range Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Performance Metrics
          </CardTitle>
          <CardDescription>
            Real-time system performance and resource utilization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            {['1h', '6h', '24h', '7d'].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">{metrics.cpu.value}%</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(metrics.cpu.trend)}
                {getStatusIcon(metrics.cpu.status)}
              </div>
            </div>
            <Progress value={metrics.cpu.value} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Threshold: {metrics.cpu.threshold}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">{metrics.memory.value}%</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(metrics.memory.trend)}
                {getStatusIcon(metrics.memory.status)}
              </div>
            </div>
            <Progress value={metrics.memory.value} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Threshold: {metrics.memory.threshold}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">{metrics.disk.value}%</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(metrics.disk.trend)}
                {getStatusIcon(metrics.disk.status)}
              </div>
            </div>
            <Progress value={metrics.disk.value} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Threshold: {metrics.disk.threshold}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network I/O</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">{metrics.network.value} {metrics.network.unit}</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(metrics.network.trend)}
                {getStatusIcon(metrics.network.status)}
              </div>
            </div>
            <Progress value={(metrics.network.value / metrics.network.threshold) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Threshold: {metrics.network.threshold} {metrics.network.unit}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">{metrics.responseTime.value} {metrics.responseTime.unit}</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(metrics.responseTime.trend)}
                {getStatusIcon(metrics.responseTime.status)}
              </div>
            </div>
            <Progress value={(metrics.responseTime.value / metrics.responseTime.threshold) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Threshold: {metrics.responseTime.threshold} {metrics.responseTime.unit}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">{metrics.errorRate.value}%</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(metrics.errorRate.trend)}
                {getStatusIcon(metrics.errorRate.status)}
              </div>
            </div>
            <Progress value={(metrics.errorRate.value / metrics.errorRate.threshold) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Threshold: {metrics.errorRate.threshold}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Performance Alerts
          </CardTitle>
          <CardDescription>Current system alerts and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(metrics).map(([key, metric]) => {
              if (metric.status === 'warning' || metric.status === 'critical') {
                return (
                  <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(metric.status)}
                      <div>
                        <div className="text-sm font-medium">{metric.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Current: {metric.value} {metric.unit} • Threshold: {metric.threshold} {metric.unit}
                        </div>
                      </div>
                    </div>
                    <Badge variant={metric.status === 'critical' ? 'destructive' : 'secondary'}>
                      {metric.status === 'critical' ? 'Critical' : 'Warning'}
                    </Badge>
                  </div>
                );
              }
              return null;
            })}
            
            {Object.values(metrics).every(m => m.status === 'good') && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-4" />
                <p className="text-muted-foreground">All systems operating normally</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* System Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Recommendations
          </CardTitle>
          <CardDescription>Optimization suggestions based on current metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.memory.value > 70 && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Database className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="text-sm font-medium">Memory Usage High</div>
                  <div className="text-xs text-muted-foreground">
                    Consider scaling up memory or optimizing application memory usage
                  </div>
                </div>
              </div>
            )}
            
            {metrics.errorRate.value > 0.5 && (
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <div>
                  <div className="text-sm font-medium">Error Rate Elevated</div>
                  <div className="text-xs text-muted-foreground">
                    Review application logs and error handling mechanisms
                  </div>
                </div>
              </div>
            )}
            
            {metrics.disk.value > 80 && (
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <HardDrive className="h-4 w-4 text-yellow-600" />
                <div>
                  <div className="text-sm font-medium">Disk Space Low</div>
                  <div className="text-xs text-muted-foreground">
                    Consider cleaning up old files or expanding storage
                  </div>
                </div>
              </div>
            )}
            
            {Object.values(metrics).every(m => m.status === 'good') && (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <div className="text-sm font-medium">System Optimized</div>
                  <div className="text-xs text-muted-foreground">
                    All systems are performing well within optimal ranges
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 