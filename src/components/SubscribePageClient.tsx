"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Sparkles, Zap, Shield, Users, Clock, Star } from 'lucide-react';
import { MainLayout } from '@/components/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const premiumFeatures = [
  { icon: <Sparkles className="h-5 w-5" />, text: "Unlimited resume links" },
  { icon: <Zap className="h-5 w-5" />, text: "Priority support" },
  { icon: <Shield className="h-5 w-5" />, text: "Advanced security features" },
  { icon: <Users className="h-5 w-5" />, text: "Team collaboration tools" },
  { icon: <Clock className="h-5 w-5" />, text: "Real-time analytics" },
  { icon: <Star className="h-5 w-5" />, text: "Premium templates" },
];

export default function SubscribePageClient() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to purchase.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

    return (
        <MainLayout>
            <div className="flex flex-col items-center text-center space-y-6">
                <div>
                    <h1 className="text-4xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Purchase ResumeSprites for Life!</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        Support our development during our early release period and get lifetime access before we move to a subscription model. This is a special one-time purchase for our foundational users.
                    </p>
                </div>

                <Card className="w-full max-w-md shadow-lg border-amber-500/20">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-bold">Lifetime Access</CardTitle>
                        <CardDescription>One-time purchase. All features, forever.</CardDescription>
                        <div className="flex items-baseline justify-center gap-2 pt-4">
                           <span className="text-5xl font-bold">$20</span>
                           <span className="text-xl text-muted-foreground">one-time</span>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 text-left">
                        <ul className="space-y-3">
                            {premiumFeatures.map((feature, index) => (
                                <li key={index} className="flex items-start">
                                    <Check className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span>{feature.text}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full text-lg bg-gradient-to-t from-yellow-400 to-orange-500 text-white font-bold hover:opacity-95" size="lg" onClick={handlePurchase} disabled={loading}>
                            {loading ? 'Redirecting...' : 'Purchase for Life!'}
                        </Button>
                    </CardFooter>
                </Card>

                 <div className="text-center text-sm text-muted-foreground pt-4">
                    <p>This is a limited-time offer for early supporters.</p>
                    <p>Thank you for helping us build the future of resumes!</p>
                </div>
            </div>
        </MainLayout>
    );
} 