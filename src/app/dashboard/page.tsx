"use client";

import { useState, useEffect } from 'react';
import { useResume } from '@/context/ResumeContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Copy, Eye, Trash2, ExternalLink, Lock, Calendar, Users, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { MainLayout } from '@/components/MainLayout';
import { templates } from '@/lib/templates';
import { Textarea } from '@/components/ui/textarea';

export default function DashboardPage() {
  const { generatedLinks, generateResumeLink, deleteGeneratedLink, refreshLinks, resumeData } = useResume();
  const { user } = useAuth();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [coverLetterModal, setCoverLetterModal] = useState<{ open: boolean, linkId: string | null }>({ open: false, linkId: null });
  const [coverLetterFields, setCoverLetterFields] = useState({
    name: '',
    occupation: '',
    company: '',
    address: '',
    content: '',
  });
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Refresh links when dashboard loads or becomes visible
  useEffect(() => {
    const loadLinks = async () => {
      setIsRefreshing(true);
      try {
        await refreshLinks();
      } catch (error) {
        console.error('Failed to load links on mount:', error);
      } finally {
        setIsRefreshing(false);
      }
    };
    loadLinks();
  }, []); // Only run once when component mounts

  // Refresh links when page becomes visible (user navigates back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshLinks();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refreshLinks]);

  const currentTemplate = templates.find(t => t.id === resumeData.template);

  const handleRefreshLinks = async () => {
    setIsRefreshing(true);
    try {
      await refreshLinks();
      toast({
        title: "Links refreshed",
        description: "Your resume links have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh links. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

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
      setModalOpen(false);
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

  const openCoverLetterModal = (link: any) => {
    setCoverLetterFields({
      name: resumeData.about.name,
      occupation: resumeData.about.jobTitle,
      company: '',
      address: '',
      content: resumeData.coverLetter || '',
    });
    setCoverLetterModal({ open: true, linkId: link.id });
  };

  const handleCoverLetterField = (field: string, value: string) => {
    setCoverLetterFields(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateCoverLetterPDF = async () => {
    if (!coverLetterModal.linkId) return;
    setIsGeneratingPDF(true);
    const link = generatedLinks.find(l => l.id === coverLetterModal.linkId);
    if (!link) return;
    try {
      const res = await fetch('/api/resumes/cover-letter-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: coverLetterFields.name,
          occupation: coverLetterFields.occupation,
          company: coverLetterFields.company,
          address: coverLetterFields.address,
          content: coverLetterFields.content,
          templateId: link.templateSnapshot,
          resumeUrl: `${window.location.origin}/resume/${link.shortId}`,
          password: link.password,
        }),
      });
      if (!res.ok) throw new Error('Failed to generate PDF');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cover-letter.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setCoverLetterModal({ open: false, linkId: null });
      toast({ title: 'PDF generated!', description: 'Your cover letter PDF has been downloaded.' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to generate PDF.', variant: 'destructive' });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadPDF = async (link: any) => {
    try {
      const res = await fetch('/api/resumes/minimal-link-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: link.resumeDataSnapshot?.about?.name || '',
          occupation: link.resumeDataSnapshot?.about?.jobTitle || '',
          resumeUrl: `${window.location.origin}/resume/${link.shortId}`,
          password: link.password,
        }),
      });
      if (!res.ok) throw new Error('Failed to generate PDF');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume-link.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast({ title: 'PDF generated!', description: 'Your resume link PDF has been downloaded.' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to generate PDF.', variant: 'destructive' });
    }
  };

  function formatDateDDMMYY(dateString: string) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto p-6 max-w-6xl">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Link Dashboard</h1>
                <p className="text-muted-foreground">
                  Generate and manage password-protected resume links for sharing your professional profile.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshLinks}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
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
              <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogTrigger asChild>
                  <Button className="min-w-[140px]">Generate Link</Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Set Password & Confirm</DialogTitle>
                    <DialogDescription>
                      This link will use your current template and data snapshot.
                    </DialogDescription>
                  </DialogHeader>
                  <form autoComplete="off">
                  <div className="flex flex-col items-center gap-4 py-2">
                    {currentTemplate && (
                      <div className="mb-2">
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-muted-foreground mb-1">Current Template</span>
                          <div className="w-32 h-20 flex items-center justify-center border rounded bg-muted">
                            {currentTemplate.previewComponent}
                          </div>
                          <span className="text-sm mt-1">{currentTemplate.name}</span>
                        </div>
                      </div>
                    )}
                    <div className="w-full">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password for this link"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleGenerateLink()}
                        autoFocus
                        autoComplete="new-password"
                      />
                    </div>
                    <Button
                      onClick={handleGenerateLink}
                      disabled={isGenerating || !password.trim()}
                      className="w-full mt-2"
                    >
                      {isGenerating ? 'Generating...' : 'Confirm & Generate'}
                    </Button>
                  </div>
                  </form>
                </DialogContent>
              </Dialog>
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
              generatedLinks.map((link) => {
                const template = templates.find(t => t.id === link.templateSnapshot);
                return (
                  <Card key={link.id} className="hover:shadow-lg transition-shadow rounded-xl border border-gray-200 bg-white/90 group">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-6">
                        {/* Template Preview */}
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform cursor-pointer relative" title={template?.name}>
                            {template?.previewComponent}
                            <span className="absolute bottom-1 left-1 right-1 text-center text-[11px] text-gray-500 bg-white/80 rounded px-1 py-0.5 shadow-sm pointer-events-none">{template?.name}</span>
                          </div>
                        </div>
                        {/* Link Info and Actions */}
                        <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              {/* badges removed */}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2 text-xs text-gray-500">
                              <div className="flex items-center gap-1">{formatDateDDMMYY(link.createdAt)}</div>
                              <div className="flex items-center gap-1"><Users className="h-4 w-4" />{getTotalViews(link)} view{getTotalViews(link) !== 1 ? 's' : ''}</div>
                              <div className="flex items-center gap-1"><Eye className="h-4 w-4" />Last viewed {getLastViewed(link)}</div>
                            </div>
                            {/* Move action buttons below info */}
                            <div className="flex flex-col sm:flex-row gap-2 mt-2">
                              <Button variant="outline" size="sm" onClick={() => handleCopyLink(link.shortId)} className="flex-1"><Copy className="h-4 w-4 mr-2" />Copy</Button>
                              <Button variant="outline" size="sm" onClick={() => window.open(`/resume/${link.shortId}`, '_blank')} className="flex-1"><ExternalLink className="h-4 w-4 mr-2" />View</Button>
                              <Button variant="outline" size="sm" onClick={() => handleDownloadPDF(link)} className="flex-1">Download PDF</Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm" disabled={isDeleting === link.id} className="flex-1"><Trash2 className="h-4 w-4" /></Button>
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
                                    <AlertDialogAction onClick={() => handleDeleteLink(link.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Cover Letter Modal */}
        <Dialog open={coverLetterModal.open} onOpenChange={open => setCoverLetterModal({ open, linkId: coverLetterModal.linkId })}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Generate Cover Letter</DialogTitle>
              <DialogDescription>
                Create a professional cover letter styled to match your template.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label>Name</Label>
                  <Input value={coverLetterFields.name} onChange={e => handleCoverLetterField('name', e.target.value)} />
                </div>
                <div className="flex-1">
                  <Label>Occupation</Label>
                  <Input value={coverLetterFields.occupation} onChange={e => handleCoverLetterField('occupation', e.target.value)} />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label>Company Name (optional)</Label>
                  <Input value={coverLetterFields.company} onChange={e => handleCoverLetterField('company', e.target.value)} />
                </div>
                <div className="flex-1">
                  <Label>Company Address (optional)</Label>
                  <Input value={coverLetterFields.address} onChange={e => handleCoverLetterField('address', e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Cover Letter Content</Label>
                <Textarea
                  rows={10}
                  value={coverLetterFields.content}
                  onChange={e => handleCoverLetterField('content', e.target.value)}
                  placeholder="Write or edit your cover letter here..."
                />
              </div>
              {/* PDF generation button will be added here */}
              <Button className="w-full" onClick={handleGenerateCoverLetterPDF} disabled={isGeneratingPDF}>
                {isGeneratingPDF ? 'Generating...' : 'Generate PDF'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </MainLayout>
    </ProtectedRoute>
  );
} 