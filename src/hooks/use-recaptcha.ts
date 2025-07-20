"use client";

import { useCallback } from 'react';
import { recaptchaConfig } from '@/lib/recaptcha';

export function useRecaptcha() {
  const execute = useCallback(async (): Promise<string> => {
    if (!recaptchaConfig.enabled) {
      return 'disabled';
    }

    if (!window.grecaptcha || !recaptchaConfig.siteKey) {
      throw new Error('reCAPTCHA not loaded');
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
  }, []);

  return { execute };
} 