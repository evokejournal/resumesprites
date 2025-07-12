"use client";

import { useState, useEffect } from 'react';
import { MainLayout } from "@/components/MainLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { requireAdmin } from "@/lib/auth-rbac";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Users, 
  Activity, 
  AlertTriangle, 
  Database, 
  Settings,
  Eye,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

// Admin dashboard components
import { SecurityOverview } from "@/components/admin/SecurityOverview";
import { UserManagement } from "@/components/admin/UserManagement";
import { SystemMetrics } from "@/components/admin/SystemMetrics";
import { SecurityLogs } from "@/components/admin/SecurityLogs";
import { BackupManagement } from "@/components/admin/BackupManagement";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [adminUserId, setAdminUserId] = useState<string>('');

  useEffect(() => {
    // Get admin user ID from localStorage or use default
    const storedAdminId = localStorage.getItem('adminUserId');
    if (storedAdminId) {
      setAdminUserId(storedAdminId);
    } else {
      // Set default admin user ID
      setAdminUserId('JmkX3pzZK3ZKURwmLIOM90E5OJC3');
      localStorage.setItem('adminUserId', 'JmkX3pzZK3ZKURwmLIOM90E5OJC3');
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
            <h2 className="text-xl font-semibold">Loading Admin Dashboard...</h2>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!adminUserId) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold mb-4">Admin Access Required</h2>
            <p className="text-muted-foreground mb-6">
              Please provide your admin user ID to access the dashboard.
            </p>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter your user ID"
                className="w-full p-2 border rounded"
                value={adminUserId}
                onChange={(e) => setAdminUserId(e.target.value)}
              />
              <Button 
                onClick={() => {
                  localStorage.setItem('adminUserId', adminUserId);
                  window.location.reload();
                }}
                disabled={!adminUserId}
                className="w-full"
              >
                Access Dashboard
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-headline font-bold flex items-center gap-2">
                <Shield className="h-8 w-8 text-primary" />
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Security monitoring, user management, and system administration
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <UserCheck className="h-3 w-3" />
                Admin
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 inline mr-1 text-green-500" />
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingDown className="h-3 w-3 inline mr-1 text-red-500" />
                  -5% from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">3</div>
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
                <div className="text-2xl font-bold text-green-600">98%</div>
                <p className="text-xs text-muted-foreground">
                  All systems operational
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="metrics" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Metrics
              </TabsTrigger>
              <TabsTrigger value="backup" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Backup
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <SecurityOverview adminUserId={adminUserId} />
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <UserManagement adminUserId={adminUserId} />
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <SecurityLogs adminUserId={adminUserId} />
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              <SystemMetrics adminUserId={adminUserId} />
            </TabsContent>

            <TabsContent value="backup" className="space-y-4">
              <BackupManagement adminUserId={adminUserId} />
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
} 