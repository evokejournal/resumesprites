# Site Lock Setup for Kickstarter Campaign

## Overview
This feature allows you to lock down the website while keeping the hero page accessible, perfect for a Kickstarter campaign launch.

## Environment Variables

Add these to your `.env.local` file:

```bash
# Site Lock Configuration
# Set to 'true' to lock the site for Kickstarter campaign
NEXT_PUBLIC_SITE_LOCKED=false

# Admin Configuration
# Your admin email address
ADMIN_EMAIL=your-email@example.com
```

## How It Works

### When Site is Locked (`NEXT_PUBLIC_SITE_LOCKED=true`):

1. **Hero Page** - Remains fully accessible with template carousel
2. **Kickstarter Message** - Shows instead of login/signup buttons
3. **All Other Routes** - Redirect to hero page with locked message
4. **API Endpoints** - Return 403 error for non-admin users
5. **Admin Access** - Your admin account can access everything normally

### When Site is Unlocked (`NEXT_PUBLIC_SITE_LOCKED=false`):

1. **Full Functionality** - All features work normally
2. **No Restrictions** - Users can sign up, build resumes, etc.

## Admin Access

- Only users with emails listed in `ADMIN_EMAILS` (in `src/lib/admin-config.ts`) can access locked features
- Admin users bypass all restrictions
- You can add multiple admin emails to the array

## Deployment

### To Lock the Site:
1. Set `NEXT_PUBLIC_SITE_LOCKED=true` in your environment
2. Deploy the changes
3. Site will be locked immediately

### To Unlock the Site:
1. Set `NEXT_PUBLIC_SITE_LOCKED=false` in your environment
2. Deploy the changes
3. Site will be fully functional immediately

## Customization

### Kickstarter Message
Edit the message in `src/components/HeroPageClient.tsx` around line 150.

### Admin Emails
Add more admin emails in `src/lib/admin-config.ts`.

### Public Routes
Modify the `PUBLIC_ROUTES` array in `src/middleware.ts` if needed. 