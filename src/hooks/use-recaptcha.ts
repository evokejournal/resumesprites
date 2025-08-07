"use client";

import { useCallback, useEffect, useState } from 'react';
import { recaptchaConfig } from '@/lib/recaptcha';

// Global type declaration for reCAPTCHA
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      render: (container: string | HTMLElement, options: any) => number;
      reset: (widgetId: number) => void;
    };
  }
}

export function useRecaptcha() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load reCAPTCHA script
  useEffect(() => {
    if (!recaptchaConfig.enabled || !recaptchaConfig.siteKey) {
      return;
    }

    // Check if already loaded
    if (window.grecaptcha) {
      setIsLoaded(true);
      return;
    }

    // Load the script
    const loadRecaptcha = () => {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaConfig.siteKey}`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        // Wait for grecaptcha to be available
        const checkInterval = setInterval(() => {
          if (window.grecaptcha) {
            clearInterval(checkInterval);
            setIsLoaded(true);
          }
        }, 100);
      };
      
      script.onerror = () => {
        console.error('Failed to load reCAPTCHA script');
        setIsLoaded(false);
      };
      
      document.head.appendChild(script);
    };

    loadRecaptcha();
  }, []);

  const execute = useCallback(async (): Promise<string> => {
    if (!recaptchaConfig.enabled) {
      return 'disabled';
    }

    if (!recaptchaConfig.siteKey) {
      console.warn('reCAPTCHA site key not configured');
      return 'disabled';
    }

    if (isLoading) {
      throw new Error('reCAPTCHA execution already in progress');
    }

    setIsLoading(true);

    try {
      // Wait for reCAPTCHA to be loaded
      if (!isLoaded) {
        // Wait up to 5 seconds for reCAPTCHA to load
        let attempts = 0;
        while (!window.grecaptcha && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
        
        if (!window.grecaptcha) {
          throw new Error('reCAPTCHA failed to load within timeout');
        }
      }

      return new Promise((resolve, reject) => {
        window.grecaptcha.ready(async () => {
          try {
            const token = await window.grecaptcha.execute(recaptchaConfig.siteKey, { 
              action: 'submit' 
            });
            resolve(token);
          } catch (error) {
            reject(error);
          }
        });
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, isLoading]);

  return { execute, isLoaded, isLoading };
} 