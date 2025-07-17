"use client";

import React, { useState, useEffect } from 'react';
import { useResume } from '@/context/ResumeContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Copy, 
  Trash2, 
  RefreshCw, 
  Eye, 
  Download, 
  Plus, 
  Mail, 
  Calendar,
  Loader2,
  Crown,
  Users,
  ExternalLink
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { MainLayout } from '@/components/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { templates } from '@/lib/templates';
import { Textarea } from '@/components/ui/textarea';

export default function DashboardPageClient() {
  // ... (copy the entire DashboardPage function body from src/app/dashboard/page.tsx)
} 