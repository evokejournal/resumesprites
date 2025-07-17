
import HeroPageClient from '@/components/HeroPageClient';

// Metadata for the home page
export const metadata = {
  title: "Interactive Resume Builder - Create Animated Resumes",
  description: "Transform your static resume into a dynamic, interactive story. Create animated resumes with unique templates, password-protected links, and real-time tracking. Stand out to employers today!",
  keywords: [
    "resume builder",
    "animated resume",
    "interactive resume",
    "resume templates",
    "job application",
    "professional portfolio",
    "resume link",
    "password protected resume"
  ],
  openGraph: {
    title: "Interactive Resume Builder - Create Animated Resumes",
    description: "Transform your static resume into a dynamic, interactive story. Create animated resumes with unique templates and stand out to employers!",
    images: ["/og-home.png"],
  },
  twitter: {
    title: "Interactive Resume Builder - Create Animated Resumes",
    description: "Transform your static resume into a dynamic, interactive story. Stand out to employers!",
  }
};

export default function Home() {
  return <HeroPageClient />;
}
