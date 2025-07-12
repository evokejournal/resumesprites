"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Database, 
  Download, 
  Upload, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Play,
  Pause,
  Settings,
  HardDrive,
  Cloud,
  RefreshCw
} from 'lucide-react';

interface BackupManagementProps {
  adminUserId: string;
}

interface Backup {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'differential';
  status: 'completed' | 'in_progress' | 'failed' | 'scheduled';
  size: string;
  createdAt: string;
  completedAt?: string;
  duration?: string;
  location: 'local' | 'cloud';
  retention: string;
  compression: boolean;
  encryption: boolean;
}

export function BackupManagement({ adminUserId }: BackupManagementProps) {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);

  useEffect(() => {
    fetchBackups();
  }, [adminUserId]);

  const fetchBackups = async () => {
    try {
      const response = await fetch('/api/admin/backups');
      if (!response.ok) throw new Error('Failed to fetch backups');
      const data = await response.json();
      setBackups(data);
      setTimeout(() => setIsLoading(false), 500);
    } catch (error) {
      console.error('Failed to fetch backups:', error);
      setIsLoading(false);
    }
  };

  const createBackup = async () => {
    setIsCreatingBackup(true);
    setBackupProgress(0);
    
    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCreatingBackup(false);
          fetchBackups(); // Refresh the list
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const restoreBackup = async (backupId: string) => {
    try {
      // TODO: Implement actual restore functionality
      console.log(`Restoring backup ${backupId}`);
      alert(`Restore initiated for backup ${backupId}`);
    } catch (error) {
      console.error('Failed to restore backup:', error);
    }
  };

  const deleteBackup = async (backupId: string) => {
    try {
      // TODO: Implement actual delete functionality
      console.log(`Deleting backup ${backupId}`);
      setBackups(prev => prev.filter(backup => backup.id !== backupId));
    } catch (error) {
      console.error('Failed to delete backup:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'scheduled':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'full':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700">Full</Badge>;
      case 'incremental':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Incremental</Badge>;
      case 'differential':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Differential</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getLocationIcon = (location: string) => {
    return location === 'cloud' ? <Cloud className="h-4 w-4" /> : <HardDrive className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBackupStats = () => {
    const total = backups.length;
    const completed = backups.filter(b => b.status === 'completed').length;
    const failed = backups.filter(b => b.status === 'failed').length;
    const scheduled = backups.filter(b => b.status === 'scheduled').length;
    
    return { total, completed, failed, scheduled };
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Backup Management</CardTitle>
            <CardDescription>Loading backup information...</CardDescription>
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

  const stats = getBackupStats();

  return (
    <div className="space-y-6">
      {/* Backup Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Backups</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Database className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.scheduled}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backup Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Backup Management
          </CardTitle>
          <CardDescription>
            Create, restore, and manage system backups
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={createBackup} 
              disabled={isCreatingBackup}
              className="flex items-center gap-2"
            >
              {isCreatingBackup ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isCreatingBackup ? 'Creating Backup...' : 'Create Backup'}
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Restore from File
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Backup Settings
            </Button>
          </div>

          {isCreatingBackup && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Creating backup...</span>
                <span>{backupProgress}%</span>
              </div>
              <Progress value={backupProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Backups Table */}
      <Card>
        <CardHeader>
          <CardTitle>Backup History</CardTitle>
          <CardDescription>Recent backups and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backups.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{backup.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Retention: {backup.retention}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(backup.type)}</TableCell>
                    <TableCell>{getStatusBadge(backup.status)}</TableCell>
                    <TableCell>{backup.size}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getLocationIcon(backup.location)}
                        <span className="capitalize">{backup.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {formatDate(backup.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {backup.status === 'completed' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => restoreBackup(backup.id)}
                            >
                              <Upload className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // TODO: Implement download
                                console.log(`Downloading backup ${backup.id}`);
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteBackup(backup.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {backups.length === 0 && (
            <div className="text-center py-8">
              <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No backups found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Backup Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Backup Configuration
          </CardTitle>
          <CardDescription>Current backup settings and policies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Schedule</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Full Backup:</span>
                    <span>Weekly (Sunday 2:00 AM)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Incremental Backup:</span>
                    <span>Daily (2:00 AM)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Retention:</span>
                    <span>30 days</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Storage</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Primary Location:</span>
                    <span>Cloud (AWS S3)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Secondary Location:</span>
                    <span>Local Storage</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compression:</span>
                    <span>Enabled</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Encryption:</span>
                    <span>Enabled (AES-256)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 