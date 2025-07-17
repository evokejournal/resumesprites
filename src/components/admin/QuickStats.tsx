"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity, AlertTriangle, Database, TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface QuickStatsProps {
  adminUserId: string;
}

export default function QuickStats({ adminUserId }: QuickStatsProps) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    securityAlerts: 0,
    systemHealth: 0,
    loading: true,
    error: '',
  });

  useEffect(() => {
    let isMounted = true;
    async function fetchStats() {
      try {
        // Fetch security metrics (includes totalUsers, activeUsers, securityAlerts, systemHealth)
        const res = await fetch('/api/admin/security-metrics');
        if (!res.ok) throw new Error('Failed to fetch metrics');
        const data = await res.json();
        if (isMounted) {
          setStats({
            totalUsers: data.totalUsers || 0,
            activeUsers: data.activeUsers || 0,
            securityAlerts: data.securityAlerts || 0,
            systemHealth: data.systemHealth || 0,
            loading: false,
            error: '',
          });
        }
      } catch (error: any) {
        if (isMounted) {
          setStats(s => ({ ...s, loading: false, error: error.message || 'Error loading stats' }));
        }
      }
    }
    fetchStats();
    return () => { isMounted = false; };
  }, [adminUserId]);

  if (stats.loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <Card key={i}><CardContent className="h-20" /></Card>
        ))}
      </div>
    );
  }
  if (stats.error) {
    return <div className="text-red-600">{stats.error}</div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3 inline mr-1 text-green-500" />
            Live
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
          <p className="text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3 inline mr-1 text-green-500" />
            Live
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{stats.securityAlerts}</div>
          <p className="text-xs text-muted-foreground">
            <Clock className="h-3 w-3 inline mr-1" />
            Last 24 hours
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Health</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.systemHealth}%</div>
          <p className="text-xs text-muted-foreground">
            All systems operational
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 