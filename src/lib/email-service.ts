import { Resend } from 'resend';

// Email Service for ResumeSprites
// All transactional emails are sent from noreply@resumesprites.com (verified and active alias).
//
// Activities that trigger emails:
// 1. User signs up: sendWelcomeEmail (signup route)
// 2. User requests password reset: sendPasswordResetEmail (forgot-password route)
// 3. Resume is viewed: sendResumeViewEmail (resume-view notification route)
// 4. User completes subscription: sendSubscriptionEmail (stripe webhook route)
// 5. (Optional) Email verification: sendEmailVerification (function exists, not currently routed)
//
// To change the sender, update emailConfig.from below.
// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
export const emailConfig = {
  from: 'ResumeSprites <noreply@resumesprites.com>',
  replyTo: 'support@resumesprites.com',
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://resumesprites.com',
};

// Email templates
export interface WelcomeEmailData {
  name: string;
  email: string;
}

export interface PasswordResetEmailData {
  email: string;
  resetToken: string;
  name?: string;
}

export interface ResumeViewEmailData {
  userEmail: string;
  userName: string;
  resumeTitle: string;
  viewerInfo: {
    ip?: string;
    userAgent?: string;
    location?: string;
    timestamp: string;
  };
  resumeUrl: string;
}

export interface SubscriptionEmailData {
  name: string;
  email: string;
  plan: string;
  amount: string;
  transactionId: string;
}

export interface EmailVerificationData {
  email: string;
  name: string;
  verificationToken: string;
}

// Branded email template generator (updated for ResumeSprites brand)
function getBrandedEmailHtml({
  title,
  body,
  ctaLabel,
  ctaUrl,
  extraHtml = "",
}: {
  title: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
  extraHtml?: string;
}) {
  return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Pixelify+Sans:wght@700&display=swap" rel="stylesheet">
          <style>
        body { background: hsl(40, 33%, 97%); font-family: 'Inter', Arial, sans-serif; color: hsl(220, 10%, 25%); margin: 0; padding: 0; }
        .container { max-width: 520px; margin: 32px auto; background: hsl(0, 0%, 100%); border-radius: 18px; box-shadow: 0 4px 32px 0 #e6b17c22; overflow: hidden; }
        .header { background: linear-gradient(120deg, hsl(25, 80%, 65%) 0%, hsl(10, 89%, 82%) 100%); color: #fff; padding: 36px 32px 18px 32px; text-align: center; border-radius: 18px 18px 0 0; }
        .brand { font-family: 'Pixelify Sans', 'Inter', Arial, sans-serif; font-size: 2.2rem; letter-spacing: 1px; font-weight: 700; margin-bottom: 6px; }
        .header h1 { margin: 0 0 8px 0; font-size: 1.5rem; font-family: 'Inter', Arial, sans-serif; font-weight: 700; }
        .header p { margin: 0; font-size: 1.1rem; }
        .content { padding: 32px; background: hsl(40, 33%, 97%); }
        .content p, .content ul, .content h3, .content h4 { font-size: 1.08rem; margin: 0 0 18px 0; }
        .button { display: inline-block; background: linear-gradient(90deg, hsl(25, 80%, 65%) 0%, hsl(10, 89%, 82%) 100%); color: #fff; padding: 14px 36px; text-decoration: none; border-radius: 999px; font-weight: 700; font-size: 1.1rem; margin: 24px 0 18px 0; box-shadow: 0 2px 8px #e6b17c33; transition: background 0.2s; border: none; }
        .button:hover { background: linear-gradient(90deg, hsl(10, 89%, 82%) 0%, hsl(25, 80%, 65%) 100%); }
        .footer { text-align: center; color: hsl(220, 10%, 55%); font-size: 0.98rem; padding: 24px 16px 16px 16px; background: hsl(0, 0%, 100%); border-radius: 0 0 18px 18px; }
        .footer a { color: hsl(25, 80%, 65%); text-decoration: underline; }
        .notice { background: #fffbe6; border: 1px solid #ffeaa7; color: #b8860b; padding: 14px 18px; border-radius: 7px; margin: 18px 0; font-size: 0.98rem; }
        ul { padding-left: 1.2em; }
        li { margin-bottom: 0.3em; }
        @media (max-width: 600px) { .container, .content, .header { padding: 16px !important; } .content { font-size: 1rem; } }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
          <img src="${logoUrl}" alt="ResumeSprites" width="220" height="48" style="display:block;margin:0 auto 12px auto;max-width:90%;height:auto;" />
          <h1>${title}</h1>
            </div>
            <div class="content">
          ${body}
          ${ctaLabel && ctaUrl ? `<div style="text-align:center;"><a href="${ctaUrl}" class="button">${ctaLabel}</a></div>` : ""}
          ${extraHtml}
        </div>
        <div class="footer">
          © 2024 ResumeSprites. All rights reserved.<br />
          Questions? Contact <a href="mailto:support@resumesprites.com">support@resumesprites.com</a>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Dynamic logo URL for email header
const logoUrl = process.env.NODE_ENV === 'production'
  ? 'https://resumesprites.com/email-logo.png'
  : 'http://localhost:9002/email-logo.png';

// Welcome Email (refactored)
export async function sendWelcomeEmail(data: WelcomeEmailData) {
  try {
    const body = `
      <p>Hi <b>${data.name}</b>,<br />We're excited to have you on board!</p>
              <p>You now have access to:</p>
      <ul style="margin-bottom:18px;">
                <li>🎨 Beautiful animated templates</li>
                <li>🔗 Password-protected resume links</li>
                <li>📊 Real-time view tracking</li>
                <li>📄 Professional PDF generation</li>
                <li>✉️ Cover letter creation</li>
              </ul>
    `;
    const html = getBrandedEmailHtml({
      title: 'Welcome to ResumeSprites! 🎉',
      body,
      ctaLabel: 'Start Building Your Resume',
      ctaUrl: `${emailConfig.baseUrl}/builder`,
      extraHtml: `<p><strong>Need help?</strong> Check out our <a href="${emailConfig.baseUrl}/templates" style="color:#667eea;">template gallery</a> for inspiration!</p>`
    });
    const { data: result, error } = await resend.emails.send({
      from: emailConfig.from,
      to: [data.email],
      subject: 'Welcome to ResumeSprites! 🎉',
      html,
    });
    if (error) {
      console.error('Welcome email error:', error);
      return { success: false, error };
    }
    return { success: true, data: result };
  } catch (error) {
    console.error('Welcome email error:', error);
    return { success: false, error };
  }
}

// Password Reset Email (refactored to use branded template)
export async function sendPasswordResetEmail(data: PasswordResetEmailData) {
  try {
    const resetUrl = `${emailConfig.baseUrl}/auth/reset-password?token=${data.resetToken}`;
    const body = `
      <p>Hi <b>${data.name || 'there'}</b>,<br />We received a request to reset your password.</p>
      <p>Click the button below to reset your password:</p>
    `;
    const extraHtml = `
      <div class="notice">
        <strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request this reset, please ignore this email.
      </div>
      <p>If the button doesn't work, copy and paste this link into your browser:<br />
        <a href="${resetUrl}" style="word-break: break-all; color: #667eea;">${resetUrl}</a>
      </p>
    `;
    const html = getBrandedEmailHtml({
      title: 'Reset Your Password',
      body,
      ctaLabel: 'Reset Password',
      ctaUrl: resetUrl,
      extraHtml,
    });
    const { data: result, error } = await resend.emails.send({
      from: emailConfig.from,
      to: [data.email],
      subject: 'Reset Your ResumeSprites Password',
      html,
    });

    if (error) {
      console.error('Password reset email error:', error);
      return { success: false, error };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error('Password reset email error:', error);
    return { success: false, error };
  }
}

// Resume View Notification Email (refactored)
export async function sendResumeViewEmail(data: ResumeViewEmailData) {
  try {
    const body = `
      <p>Hi <b>${data.userName}</b>,<br />Someone just viewed your resume!</p>
      <h3 style="margin:18px 0 8px 0;">Resume: ${data.resumeTitle}</h3>
      <div style="background:#fff;padding:16px 18px;border-radius:7px;margin-bottom:18px;">
        <p><strong>Viewed at:</strong> ${data.viewerInfo.timestamp}</p>
        ${data.viewerInfo.location ? `<p><strong>Location:</strong> ${data.viewerInfo.location}</p>` : ''}
        ${data.viewerInfo.ip ? `<p><strong>IP Address:</strong> ${data.viewerInfo.ip}</p>` : ''}
      </div>
    `;
    const html = getBrandedEmailHtml({
      title: '👀 Your Resume Was Viewed!',
      body,
      ctaLabel: 'View Your Resume',
      ctaUrl: data.resumeUrl,
      extraHtml: `<p><strong>Want to see more analytics?</strong> Check your dashboard for detailed view statistics!</p>`
    });
    const { data: result, error } = await resend.emails.send({
      from: emailConfig.from,
      to: [data.userEmail],
      subject: `👀 Someone viewed your resume: ${data.resumeTitle}`,
      html,
    });
    if (error) {
      console.error('Resume view email error:', error);
      return { success: false, error };
    }
    return { success: true, data: result };
  } catch (error) {
    console.error('Resume view email error:', error);
    return { success: false, error };
  }
}

// Subscription Confirmation Email (refactored)
export async function sendSubscriptionEmail(data: SubscriptionEmailData) {
  try {
    const body = `
      <p>Hi <b>${data.name}</b>,<br />Thank you for your purchase!</p>
      <h3 style="margin:18px 0 8px 0;">Your subscription is now active!</h3>
      <div style="background:#fff;padding:16px 18px;border-radius:7px;margin-bottom:18px;border-left:4px solid #667eea;">
        <h4 style="margin:0 0 8px 0;">Order Details:</h4>
                <p><strong>Plan:</strong> ${data.plan}</p>
                <p><strong>Amount:</strong> ${data.amount}</p>
                <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
              </div>
      <ul style="margin-bottom:18px;">
                <li>✨ Unlimited resume templates</li>
                <li>📊 Advanced analytics</li>
                <li>🔗 Unlimited resume links</li>
                <li>📄 Priority PDF generation</li>
                <li>🎨 Premium template designs</li>
              </ul>
    `;
    const html = getBrandedEmailHtml({
      title: '🎉 Welcome to ResumeSprites Premium!',
      body,
      ctaLabel: 'Go to Dashboard',
      ctaUrl: `${emailConfig.baseUrl}/dashboard`,
    });
    const { data: result, error } = await resend.emails.send({
      from: emailConfig.from,
      to: [data.email],
      subject: '🎉 Welcome to ResumeSprites Premium!',
      html,
    });
    if (error) {
      console.error('Subscription email error:', error);
      return { success: false, error };
    }
    return { success: true, data: result };
  } catch (error) {
    console.error('Subscription email error:', error);
    return { success: false, error };
  }
}

// Email Verification (refactored)
export async function sendEmailVerification(data: EmailVerificationData) {
  try {
    const verificationUrl = `${emailConfig.baseUrl}/auth/verify-email?token=${data.verificationToken}`;
    const body = `
      <p>Hi <b>${data.name}</b>,<br />Please verify your email to complete your account setup.</p>
      <p>Click the button below to verify your email address:</p>
    `;
    const extraHtml = `
      <p>If the button doesn't work, copy and paste this link into your browser:<br />
        <a href="${verificationUrl}" style="word-break: break-all; color: #667eea;">${verificationUrl}</a>
      </p>
    `;
    const html = getBrandedEmailHtml({
      title: 'Verify Your Email',
      body,
      ctaLabel: 'Verify Email',
      ctaUrl: verificationUrl,
      extraHtml,
    });
    const { data: result, error } = await resend.emails.send({
      from: emailConfig.from,
      to: [data.email],
      subject: 'Verify Your ResumeSprites Email',
      html,
    });
    if (error) {
      console.error('Email verification error:', error);
      return { success: false, error };
    }
    return { success: true, data: result };
  } catch (error) {
    console.error('Email verification error:', error);
    return { success: false, error };
  }
}

// Utility function to check if email service is configured
export function isEmailServiceConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

// Utility function to get email service status
export function getEmailServiceStatus() {
  return {
    configured: isEmailServiceConfigured(),
    provider: 'Resend',
    from: emailConfig.from,
    baseUrl: emailConfig.baseUrl,
  };
} 