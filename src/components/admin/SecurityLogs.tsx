"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Shield, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye,
  Download,
  Clock,
  MapPin,
  User,
  Activity
} from 'lucide-react';

interface SecurityLogsProps {
  adminUserId: string;
}

interface SecurityLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  category: 'auth' | 'rate_limit' | 'permission' | 'system' | 'backup';
  message: string;
  userId?: string;
  userEmail?: string;
  ipAddress: string;
  userAgent: string;
  details: Record<string, any>;
}

export function SecurityLogs({ adminUserId }: SecurityLogsProps) {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<SecurityLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<SecurityLog | null>(null);

  useEffect(() => {
    fetchSecurityLogs();
  }, [adminUserId]);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, levelFilter, categoryFilter]);

  const fetchSecurityLogs = async () => {
    try {
      const response = await fetch('/api/admin/security-logs');
      if (!response.ok) throw new Error('Failed to fetch security logs');
      const data = await response.json();
      setLogs(data);
      setTimeout(() => setIsLoading(false), 500);
    } catch (error) {
      console.error('Failed to fetch security logs:', error);
      setIsLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = logs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Level filter
    if (levelFilter !== 'all') {
      filtered = filtered.filter(log => log.level === levelFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(log => log.category === categoryFilter);
    }

    setFilteredLogs(filtered);
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'info':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Info</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-50 text-yellow-700">Warning</Badge>;
      case 'error':
        return <Badge variant="destructive" className="bg-red-50 text-red-700">Error</Badge>;
      case 'critical':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Critical</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'auth':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700">Auth</Badge>;
      case 'rate_limit':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700">Rate Limit</Badge>;
      case 'permission':
        return <Badge variant="outline" className="bg-red-50 text-red-700">Permission</Badge>;
      case 'system':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700">System</Badge>;
      case 'backup':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Backup</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const exportLogs = () => {
    const csvContent = [
      'Timestamp,Level,Category,Message,User Email,IP Address',
      ...filteredLogs.map(log => 
        `${log.timestamp},${log.level},${log.category},"${log.message}",${log.userEmail || ''},${log.ipAddress}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Security Logs</CardTitle>
            <CardDescription>Loading security logs...</CardDescription>
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
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Logs
          </CardTitle>
          <CardDescription>
            Monitor security events, authentication attempts, and system alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs by message, email, or IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Levels</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="critical">Critical</option>
            </select>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Categories</option>
              <option value="auth">Authentication</option>
              <option value="rate_limit">Rate Limit</option>
              <option value="permission">Permission</option>
              <option value="system">System</option>
              <option value="backup">Backup</option>
            </select>
            
            <Button onClick={exportLogs} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Logs Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {formatDate(log.timestamp)}
                      </div>
                    </TableCell>
                    <TableCell>{getLevelBadge(log.level)}</TableCell>
                    <TableCell>{getCategoryBadge(log.category)}</TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={log.message}>
                        {log.message}
                      </div>
                    </TableCell>
                    <TableCell>
                      {log.userEmail ? (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          {log.userEmail}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {log.ipAddress}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLog(log)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No security logs found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Log Details Modal */}
      {selectedLog && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Log Details
            </CardTitle>
            <CardDescription>
              Detailed information about the selected security event
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Timestamp</label>
                <p className="text-sm text-muted-foreground">{formatDate(selectedLog.timestamp)}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Level</label>
                <div className="mt-1">{getLevelBadge(selectedLog.level)}</div>
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <div className="mt-1">{getCategoryBadge(selectedLog.category)}</div>
              </div>
              <div>
                <label className="text-sm font-medium">IP Address</label>
                <p className="text-sm text-muted-foreground">{selectedLog.ipAddress}</p>
              </div>
              {selectedLog.userEmail && (
                <div>
                  <label className="text-sm font-medium">User Email</label>
                  <p className="text-sm text-muted-foreground">{selectedLog.userEmail}</p>
                </div>
              )}
              {selectedLog.userId && (
                <div>
                  <label className="text-sm font-medium">User ID</label>
                  <p className="text-sm text-muted-foreground">{selectedLog.userId}</p>
                </div>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium">Message</label>
              <p className="text-sm text-muted-foreground mt-1">{selectedLog.message}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium">User Agent</label>
              <p className="text-sm text-muted-foreground mt-1 break-all">{selectedLog.userAgent}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium">Details</label>
              <pre className="text-sm text-muted-foreground mt-1 bg-gray-50 p-3 rounded overflow-auto">
                {JSON.stringify(selectedLog.details, null, 2)}
              </pre>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setSelectedLog(null)}>
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 