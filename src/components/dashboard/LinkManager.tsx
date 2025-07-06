"use client";

import { useState } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MoreHorizontal, PlusCircle, Copy, Trash2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useResume } from '@/context/ResumeContext';

export function LinkManager() {
  const { toast } = useToast();
  const { resumeData, generatedLinks, addGeneratedLink, deleteGeneratedLink } = useResume();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [password, setPassword] = useState('');

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Copied to clipboard!",
      description: "The link has been copied successfully.",
    });
  };

  const handleGenerateLink = () => {
    if (!password) {
        toast({
            variant: 'destructive',
            title: "Password Required",
            description: "Please enter a password to create a secure link.",
        });
        return;
    }

    addGeneratedLink({
        id: `link${Date.now()}`,
        url: `https://resumespri.tes/${Math.random().toString(36).substring(2, 8)}`,
        password: password,
        views: 0,
        lastAccessed: 'Never',
        resumeDataSnapshot: { ...resumeData }, // Create a snapshot
    });

    toast({
        title: "Link Created!",
        description: "Your new unique link is ready.",
    });

    setPassword('');
    setIsDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Links</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Link
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new shareable link</DialogTitle>
                    <DialogDescription>
                       Generate a unique, password-protected URL for your resume. A password is required.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                          id="password" 
                          type="password" 
                          placeholder="Enter a strong password" 
                          required 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleGenerateLink}>Generate Link</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>URL</TableHead>
              <TableHead>PDF</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Last Accessed</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {generatedLinks.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        No links generated yet. Create one to get started!
                    </TableCell>
                </TableRow>
            )}
            {generatedLinks.map((link) => (
              <TableRow key={link.id}>
                <TableCell className="font-medium">{link.url}</TableCell>
                <TableCell>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/cover-letter-pdf/${link.id}`} target="_blank">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Link>
                  </Button>
                </TableCell>
                <TableCell>{link.views}</TableCell>
                <TableCell>{link.lastAccessed}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleCopy(link.url)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deleteGeneratedLink(link.id)} className="text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Link
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
