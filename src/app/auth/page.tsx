"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignInForm } from '@/components/auth/SignInForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, UserPlus, LogIn } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Check if site is locked
  const isSiteLocked = process.env.NEXT_PUBLIC_SITE_LOCKED === 'true';

  // Generate random particle positions and animation params only on the client after hydration
  const [particles, setParticles] = useState<{ left: number; top: number; duration: number; delay: number }[]>([]);
  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 8 + Math.random() * 4,
        delay: Math.random() * 5,
      }))
    );
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Animated background */}
      <div
        className="[--aurora:repeating-linear-gradient(100deg,hsl(var(--primary)/0.1)_10%,hsl(var(--accent)/0.15)_15%,hsl(var(--primary)/0.1)_20%)] [background-image:var(--aurora),var(--aurora)] [background-size:200%_100%] [background-position:50%_50%,50%_50%] filter blur-[10px] after:content-[''] after:absolute after:inset-0 after:bg-background/80 after:z-[-1] animate-[aurora_15s_linear_infinite] fixed inset-0"
      ></div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
            }}
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </motion.div>

          {/* Auth card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/50 p-8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-4"
              >
                <h1 className="text-2xl font-bold font-headline flex items-baseline justify-center gap-x-1">
                  <span>Resume</span><span className="font-pixelify text-3xl text-primary">Sprites</span>
                </h1>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-3xl font-bold font-headline text-foreground"
              >
                {isSignUp ? 'Join ResumeSprites' : 'Welcome Back'}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-muted-foreground mt-2"
              >
                {isSignUp 
                  ? 'Create your account and start building amazing resumes'
                  : 'Sign in to continue building your career story'
                }
              </motion.p>
            </div>

            {/* Form */}
            <AnimatePresence mode="wait">
              {isSignUp && !isSiteLocked ? (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SignUpForm />
                </motion.div>
              ) : (
                <motion.div
                  key="signin"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SignInForm />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toggle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-6 text-center"
            >
              {isSiteLocked ? (
                // When site is locked, only show sign-in option
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Site is currently locked for Kickstarter campaign
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Only existing users can sign in
                  </p>
                </div>
              ) : (
                // Normal toggle when site is unlocked
                <>
                  <p className="text-sm text-muted-foreground">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                  </p>
                  <Button
                    variant="link"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    {isSignUp ? (
                      <>
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Sign Up
                      </>
                    )}
                  </Button>
                </>
              )}
              {!isSignUp && (
                <div className="mt-2">
                  <Link href="/auth/forgot-password" className="text-xs text-muted-foreground hover:text-primary underline">
                    Forgot your password?
                  </Link>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 