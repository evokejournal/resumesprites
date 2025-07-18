"use client";

import React, { useEffect, useRef } from 'react';
import { recaptchaConfig } from '@/lib/recaptcha';

interface ReCaptchaProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  className?: string;
  theme?: 'light' | 'dark';
  size?: 'normal' | 'compact' | 'invisible';
}

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      render: (container: string | HTMLElement, options: any) => number;
      execute: (siteKey: string, options: any) => Promise<string>;
      reset: (widgetId: number) => void;
    };
  }
}

export function ReCaptcha({ 
  onVerify, 
  onError, 
  onExpire, 
  className = '',
  theme = 'light',
  size = 'normal'
}: ReCaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Load reCAPTCHA script if not already loaded
    if (!window.grecaptcha) {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaConfig.siteKey}`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    // Initialize reCAPTCHA when ready
    const initRecaptcha = () => {
      if (!window.grecaptcha || !containerRef.current || !recaptchaConfig.siteKey) {
        return;
      }

      window.grecaptcha.ready(() => {
        if (size === 'invisible') {
          // For invisible reCAPTCHA, we'll execute it programmatically
          return;
        }

        // Render visible reCAPTCHA
        widgetIdRef.current = window.grecaptcha.render(containerRef.current!, {
          sitekey: recaptchaConfig.siteKey,
          theme,
          size,
          callback: (token: string) => {
            onVerify(token);
          },
          'expired-callback': () => {
            onExpire?.();
          },
          'error-callback': () => {
            onError?.();
          },
        });
      });
    };

    // Wait for script to load
    if (window.grecaptcha) {
      initRecaptcha();
    } else {
      const checkInterval = setInterval(() => {
        if (window.grecaptcha) {
          clearInterval(checkInterval);
          initRecaptcha();
        }
      }, 100);
    }

    return () => {
      // Cleanup
      if (widgetIdRef.current && window.grecaptcha) {
        window.grecaptcha.reset(widgetIdRef.current);
      }
    };
  }, [onVerify, onError, onExpire, theme, size]);

  // Function to execute invisible reCAPTCHA
  const executeInvisible = async (): Promise<string> => {
    if (!window.grecaptcha || !recaptchaConfig.siteKey) {
      throw new Error('reCAPTCHA not loaded');
    }

    try {
      const token = await window.grecaptcha.execute(recaptchaConfig.siteKey, { action: 'submit' });
      onVerify(token);
      return token;
    } catch (error) {
      onError?.();
      throw error;
    }
  };

  if (size === 'invisible') {
    return <div ref={containerRef} className={className} />;
  }

  return (
    <div 
      ref={containerRef} 
      className={`recaptcha-container ${className}`}
      style={{ minHeight: size === 'compact' ? '78px' : '78px' }}
    />
  );
} 