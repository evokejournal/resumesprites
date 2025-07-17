import { generateMetadata } from '@/lib/seo';
import DashboardPageClient from './DashboardPageClient';

// Metadata for the dashboard page
export const metadata = generateMetadata({
  title: 'Dashboard - Manage Your Resume Links',
  description: 'Manage your resume links, track views, and monitor your professional presence. Create new links, view analytics, and download PDF versions of your resumes.',
  keywords: [
    'resume dashboard',
    'resume links',
    'resume tracking',
    'resume analytics',
    'resume management',
    'professional links'
  ],
  image: '/og-dashboard.png',
  url: '/dashboard',
});

export default function DashboardPage() {
  return <DashboardPageClient />;
} 