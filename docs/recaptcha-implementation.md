# reCAPTCHA Implementation Guide

## Overview

This document outlines the comprehensive reCAPTCHA implementation across the ResumeSprites web application to protect against automated attacks and spam.

## 🔧 **Configuration**

### Environment Variables
```bash
# reCAPTCHA v3 (Invisible)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Ldob4YrAAAAAELmDeqRtM5WQfbHZwuNOGtZTQpZ
RECAPTCHA_SECRET_KEY=6Ldob4YrAAAAADQjFG126gYdW_yzD_nhOtjeXL4YWNkN2VmODBhN2E1MXAxMA@teaching-vervet-32783.

# Optional: Force enable in development
ENABLE_RECAPTCHA=true
```

### Configuration Logic
- **Production**: Always enabled
- **Development**: Enabled when `ENABLE_RECAPTCHA=true` is set
- **Fallback**: Returns `'disabled'` token when reCAPTCHA is not configured

## 🏗️ **Architecture**

### Backend Components
- **`src/lib/recaptcha.ts`**: Core reCAPTCHA verification library
- **API Routes**: Protected endpoints with reCAPTCHA verification
- **Security Logging**: Failed reCAPTCHA attempts are logged

### Frontend Components
- **`src/hooks/use-recaptcha.ts`**: Custom hook for reCAPTCHA execution
- **`src/components/ui/recaptcha.tsx`**: ReCAPTCHA UI component (for visible captchas)
- **Form Integration**: Invisible reCAPTCHA in all protected forms

## 📋 **Protected Endpoints**

### Authentication Routes
✅ **Sign In** - `/api/auth/signin`
- Frontend: `src/components/auth/SignInForm.tsx`
- Backend: Verifies reCAPTCHA token

✅ **Sign Up** - `/api/auth/signup`
- Frontend: `src/components/auth/SignUpForm.tsx`
- Backend: Verifies reCAPTCHA token

✅ **Forgot Password** - `/api/auth/forgot-password`
- Frontend: `src/app/auth/forgot-password/page.tsx`
- Backend: Verifies reCAPTCHA token

✅ **Reset Password** - `/api/auth/reset-password`
- Frontend: `src/app/auth/reset-password/page.tsx`
- Backend: Verifies reCAPTCHA token

### Notification Routes
✅ **Resume View Notification** - `/api/notifications/resume-view`
- Backend: Verifies reCAPTCHA token

### Template Password Screens
✅ **Bouncing Resume** - `src/components/templates/password-screens/BouncingResumePasswordScreen.tsx`
✅ **Code Syntax** - `src/components/templates/password-screens/CodeSyntaxPasswordScreen.tsx`

## 🔄 **Implementation Flow**

### Frontend Flow
1. **Form Submission**: User submits protected form
2. **reCAPTCHA Execution**: `useRecaptcha().execute()` called
3. **Token Generation**: Invisible reCAPTCHA v3 generates token
4. **API Request**: Token included in request body
5. **Fallback**: If reCAPTCHA fails, form submits without token

### Backend Flow
1. **Request Validation**: Extract `recaptchaToken` from request body
2. **Token Verification**: Call Google reCAPTCHA API with secret key
3. **Score Evaluation**: Check if score meets threshold (typically 0.5+)
4. **Response**: Allow/deny based on verification result
5. **Logging**: Log failed attempts for security monitoring

## 🛡️ **Security Features**

### Rate Limiting
- All protected endpoints have rate limiting
- Failed reCAPTCHA attempts count toward rate limits
- IP-based blocking for repeated failures

### Logging & Monitoring
- Failed reCAPTCHA attempts logged with IP address
- Security metrics tracked in admin dashboard
- Real-time alerts for suspicious activity

### Graceful Degradation
- Forms work without reCAPTCHA if not configured
- Fallback to basic validation when reCAPTCHA unavailable
- No user experience disruption

## 📱 **User Experience**

### Invisible Protection
- **No user interaction required** for reCAPTCHA v3
- **Seamless experience** - users don't see captcha challenges
- **Automatic execution** on form submission

### Error Handling
- **Clear error messages** for reCAPTCHA failures
- **Retry mechanisms** built into forms
- **Fallback options** when reCAPTCHA unavailable

## 🧪 **Testing**

### Development Testing
```bash
# Test without reCAPTCHA
ENABLE_RECAPTCHA=false npm run dev

# Test with reCAPTCHA
ENABLE_RECAPTCHA=true npm run dev
```

### API Testing
```bash
# Test sign-in with reCAPTCHA
curl -X POST http://localhost:9002/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password","recaptchaToken":"test_token"}'
```

## 📊 **Monitoring**

### Admin Dashboard
- **Security Logs**: View reCAPTCHA failures
- **Success Rates**: Monitor reCAPTCHA effectiveness
- **IP Analysis**: Track suspicious IP addresses

### Metrics Tracked
- reCAPTCHA success/failure rates
- Average reCAPTCHA scores
- Geographic distribution of attempts
- Time-based attack patterns

## 🔧 **Maintenance**

### Key Rotation
- **Site Key**: Public, can be rotated without downtime
- **Secret Key**: Private, requires careful rotation
- **Backup Keys**: Maintained for emergency rollback

### Performance Monitoring
- **API Response Times**: Monitor Google reCAPTCHA API performance
- **Error Rates**: Track verification failures
- **User Impact**: Monitor for false positives

## 🚨 **Troubleshooting**

### Common Issues

#### reCAPTCHA Not Loading
```javascript
// Check if site key is configured
console.log(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY);
```

#### Verification Failures
```javascript
// Check secret key configuration
console.log(process.env.RECAPTCHA_SECRET_KEY ? 'Configured' : 'Missing');
```

#### Form Submission Errors
```javascript
// Verify token is being sent
console.log('reCAPTCHA Token:', recaptchaToken);
```

### Debug Mode
```bash
# Enable debug logging
DEBUG_RECAPTCHA=true npm run dev
```

## 📈 **Future Enhancements**

### Planned Features
- **Adaptive Thresholds**: Dynamic score thresholds based on user behavior
- **Multi-factor Integration**: Combine with other security measures
- **Analytics Dashboard**: Enhanced security metrics visualization
- **A/B Testing**: Test different reCAPTCHA configurations

### Performance Optimizations
- **Token Caching**: Cache valid tokens for short periods
- **Batch Verification**: Verify multiple tokens in single API call
- **CDN Integration**: Optimize reCAPTCHA script loading

---

## ✅ **Implementation Status**

- [x] Backend verification library
- [x] Frontend hook implementation
- [x] Authentication forms protected
- [x] Password reset flows protected
- [x] Template password screens protected
- [x] Environment configuration
- [x] Error handling and fallbacks
- [x] Security logging
- [x] Documentation

**Status**: ✅ **COMPLETE** - reCAPTCHA is fully implemented across all critical forms and endpoints. 