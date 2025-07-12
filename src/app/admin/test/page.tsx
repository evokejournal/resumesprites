"use client";

import { useState, useEffect } from 'react';
import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, XCircle, Activity } from 'lucide-react';
import { checkAdminAccess } from '@/lib/admin-auth';

export default function AdminTestPage() {
  const [testResults, setTestResults] = useState<{
    adminAccess: boolean;
    securityMetrics: boolean;
    userManagement: boolean;
  }>({
    adminAccess: false,
    securityMetrics: false,
    userManagement: false,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    const adminUserId = 'JmkX3pzZK3ZKURwmLIOM90E5OJC3';
    
    // Test 1: Admin access check
    const adminAccess = checkAdminAccess(adminUserId);
    
    // Test 2: Security metrics API
    let securityMetrics = false;
    try {
      const response = await fetch('/api/admin/security-metrics');
      securityMetrics = response.ok;
    } catch (error) {
      console.error('Security metrics test failed:', error);
    }
    
    // Test 3: User management API
    let userManagement = false;
    try {
      const response = await fetch('/api/admin/users');
      userManagement = response.ok;
    } catch (error) {
      console.error('User management test failed:', error);
    }

    setTestResults({
      adminAccess,
      securityMetrics,
      userManagement,
    });
    
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
            <h2 className="text-xl font-semibold">Running Admin Tests...</h2>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-headline font-bold flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              Admin Access Test
            </h1>
            <p className="text-muted-foreground">
              Testing admin dashboard functionality
            </p>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Test Results
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {testResults.adminAccess ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                Admin Access
              </CardTitle>
              <CardDescription>Client-side admin verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">User ID:</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    JmkX3pzZK3ZKURwmLIOM90E5OJC3
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status:</span>
                  <Badge variant={testResults.adminAccess ? 'default' : 'destructive'}>
                    {testResults.adminAccess ? 'Authorized' : 'Unauthorized'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {testResults.securityMetrics ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                Security Metrics API
              </CardTitle>
              <CardDescription>API endpoint accessibility</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Endpoint:</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    /api/admin/security-metrics
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status:</span>
                  <Badge variant={testResults.securityMetrics ? 'default' : 'destructive'}>
                    {testResults.securityMetrics ? 'Accessible' : 'Blocked'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {testResults.userManagement ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                User Management API
              </CardTitle>
              <CardDescription>User management endpoint</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Endpoint:</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    /api/admin/users
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status:</span>
                  <Badge variant={testResults.userManagement ? 'default' : 'destructive'}>
                    {testResults.userManagement ? 'Accessible' : 'Blocked'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Test Summary</CardTitle>
            <CardDescription>Overall admin dashboard status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">All Tests Passed:</span>
                <Badge variant={
                  testResults.adminAccess && testResults.securityMetrics && testResults.userManagement 
                    ? 'default' 
                    : 'destructive'
                }>
                  {testResults.adminAccess && testResults.securityMetrics && testResults.userManagement 
                    ? 'Yes' 
                    : 'No'
                  }
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Next Steps:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Navigate to <code className="bg-gray-100 px-1 rounded">/admin</code> to access the full dashboard</li>
                  <li>• Check the sidebar for the Admin link</li>
                  <li>• Test all dashboard features and functionality</li>
                  <li>• Review security logs and monitoring</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button onClick={runTests} variant="outline">
                  <Activity className="h-4 w-4 mr-2" />
                  Re-run Tests
                </Button>
                <Button asChild>
                  <a href="/admin">Go to Admin Dashboard</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
} 