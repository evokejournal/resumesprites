# Deployment Guide - ResumeSprites

## Step 1: Firebase Setup

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `resumesprites` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### 1.2 Enable Authentication
1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Enable "Email/Password" provider
3. Click "Save"

### 1.3 Create Firestore Database
1. Go to "Firestore Database" → "Create database"
2. Choose "Start in test mode" (for development)
3. Select a location close to your users
4. Click "Done"

### 1.4 Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" → "Web"
4. Register app with name "ResumeSprites Web"
5. Copy the config object

### 1.5 Create Service Account (for Admin SDK)
1. In Project Settings → "Service accounts"
2. Click "Generate new private key"
3. Download the JSON file
4. Keep this file secure - never commit it to git

## Step 2: Environment Variables

### 2.1 Local Development
Create `.env.local` in your project root:

```env
# Firebase Configuration (from step 1.4)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (from step 1.5 JSON file)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# NextAuth
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:9002
```

### 2.2 Generate NextAuth Secret
```bash
openssl rand -base64 32
```

## Step 3: Vercel Deployment

### 3.1 Prepare Repository
```bash
# Commit all changes
git add .
git commit -m "Add Firebase integration and Vercel deployment config"
git push origin main
```

### 3.2 Deploy to Vercel
1. Go to [Vercel](https://vercel.com/)
2. Sign in with GitHub
3. Click "New Project"
4. Import your repository
5. Configure project:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### 3.3 Add Environment Variables in Vercel
1. In your Vercel project dashboard
2. Go to "Settings" → "Environment Variables"
3. Add all variables from `.env.local`
4. Set `NEXTAUTH_URL` to your Vercel domain (e.g., `https://your-project.vercel.app`)

### 3.4 Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Your app will be live at the provided URL

## Step 4: Post-Deployment

### 4.1 Test Firebase Connection
1. Visit your deployed app
2. Try creating a resume
3. Check Firebase Console to see if data is being saved

### 4.2 Set Up Custom Domain (Optional)
1. In Vercel dashboard → "Settings" → "Domains"
2. Add your custom domain
3. Update `NEXTAUTH_URL` to your custom domain

### 4.3 Security Rules (Firestore)
Update Firestore security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /resumes/{resumeId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Troubleshooting

### Common Issues

1. **Build Errors**: Check Vercel build logs for missing dependencies
2. **Firebase Connection**: Verify environment variables are set correctly
3. **Authentication Issues**: Ensure Firebase Auth is enabled and configured
4. **CORS Errors**: Check if Firebase project settings allow your domain

### Useful Commands

```bash
# Test build locally
npm run build

# Check for TypeScript errors
npm run typecheck

# Run linting
npm run lint

# Test development server
npm run dev
```

## Next Steps

1. Set up Firebase Storage for file uploads
2. Implement user management features
3. Add analytics tracking
4. Set up monitoring and error reporting
5. Configure CI/CD pipelines 