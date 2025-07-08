"use client";

import { useState } from 'react';
import { useResume } from '@/context/ResumeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Copy, Eye, Trash2, ExternalLink, Lock, Calendar, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { MainLayout } from '@/components/MainLayout';

export default function DashboardPage() {
  const { generatedLinks, generateResumeLink, deleteGeneratedLink } = useResume();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleGenerateLink = async () => {
    if (!password.trim()) {
      toast({
        title: "Password required",
        description: "Please enter a password for your resume link.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const newLink = await generateResumeLink(password);
      setPassword('');
      toast({
        title: "Link generated!",
        description: `Your resume link has been created with ID: ${newLink.shortId}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate resume link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = (shortId: string) => {
    const link = `${window.location.origin}/resume/${shortId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied!",
      description: "Resume link has been copied to clipboard.",
    });
  };

  const handleDeleteLink = async (id: string) => {
    setIsDeleting(id);
    try {
      await deleteGeneratedLink(id);
      toast({
        title: "Link deleted",
        description: "Your resume link has been permanently deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const getTotalViews = (link: any) => {
    return link.views?.length || 0;
  };

  const getLastViewed = (link: any) => {
    if (!link.views || link.views.length === 0) return 'Never';
    const lastView = link.views[link.views.length - 1];
    return formatDate(lastView.timestamp);
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto p-6 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Link Dashboard</h1>
            <p className="text-muted-foreground">
              Generate and manage password-protected resume links for sharing your professional profile.
            </p>
          </div>

          {/* Generate New Link */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Generate New Resume Link
              </CardTitle>
              <CardDescription>
                Create a new password-protected link to share your current resume. Each link takes a snapshot of your current data and template.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password for this link"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleGenerateLink()}
                  />
                </div>
                <Button 
                  onClick={handleGenerateLink} 
                  disabled={isGenerating || !password.trim()}
                  className="min-w-[140px]"
                >
                  {isGenerating ? 'Generating...' : 'Generate Link'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Existing Links */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Your Resume Links</h2>
            
            {generatedLinks.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Lock className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No links yet</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    Generate your first resume link to start sharing your professional profile with password protection.
                  </p>
                </CardContent>
              </Card>
            ) : (
              generatedLinks.map((link) => (
                <Card key={link.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="secondary" className="font-mono text-sm">
                            {link.shortId}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {link.templateSnapshot}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            Created {formatDate(link.createdAt)}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            {getTotalViews(link)} view{getTotalViews(link) !== 1 ? 's' : ''}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Eye className="h-4 w-4" />
                            Last viewed {getLastViewed(link)}
                          </div>
                        </div>

                        {/* View Details */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="mr-2">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Link Details - {link.shortId}</DialogTitle>
                              <DialogDescription>
                                Detailed information about this resume link and its usage.
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2">Link Information</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Short ID:</span>
                                    <div className="font-mono">{link.shortId}</div>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Template:</span>
                                    <div>{link.templateSnapshot}</div>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Created:</span>
                                    <div>{new Date(link.createdAt).toLocaleString()}</div>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Total Views:</span>
                                    <div>{getTotalViews(link)}</div>
                                  </div>
                                </div>
                              </div>

                              {link.views && link.views.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-2">View History</h4>
                                  <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {link.views.map((view, index) => (
                                      <div key={index} className="flex justify-between items-center text-sm p-2 bg-muted rounded">
                                        <span>{new Date(view.timestamp).toLocaleString()}</span>
                                        {view.ip && <span className="text-muted-foreground">{view.ip}</span>}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyLink(link.shortId)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/resume/${link.shortId}`, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isDeleting === link.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Resume Link</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the link "{link.shortId}"? This action cannot be undone and the link will no longer be accessible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteLink(link.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
} 