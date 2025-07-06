# ResumeSprites - Dynamic Resume Builder

A Next.js application for creating and sharing interactive resumes with unique templates and Firebase backend integration.

## Features

- 🎨 Multiple creative resume templates
- 🔥 Firebase backend for data persistence
- 📱 Responsive design
- 🚀 Vercel deployment ready
- 🔐 User authentication
- 📊 Real-time data synchronization

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Deployment**: Vercel
- **Authentication**: NextAuth.js with Firebase

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd resumesprites
npm install
```

### 2. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Enable Storage (optional)

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (for server-side operations)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY=your_private_key

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### 4. Development

```bash
npm run dev
```

Visit `http://localhost:9002` to see your app.

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Add these to your Vercel project settings:

- All the Firebase variables from `.env.local`
- Set `NEXTAUTH_URL` to your production domain

## Project Structure

```
src/
├── app/                 # Next.js app router
│   ├── api/            # API routes
│   ├── builder/        # Resume builder page
│   ├── dashboard/      # User dashboard
│   └── preview/        # Resume preview
├── components/         # React components
│   ├── templates/      # Resume templates
│   └── ui/            # UI components
├── lib/               # Utilities and configurations
├── hooks/             # Custom React hooks
└── context/           # React context providers
```

## Firebase Collections

### Resumes Collection
```typescript
{
  id: string,
  userId: string,
  template: string,
  about: { name, jobTitle, summary, photo },
  contact: { email, phone, website, location },
  experience: Array<{ id, company, role, startDate, endDate, description }>,
  education: Array<{ id, institution, degree, startDate, endDate, description }>,
  skills: Array<{ id, name, level }>,
  portfolio: Array<{ id, title, url, description }>,
  references: Array<{ id, name, role, company, email, phone }>,
  custom: { title, items: Array<{ id, title, description }> },
  createdAt: string,
  updatedAt: string
}
```

## API Endpoints

- `POST /api/resumes` - Create new resume
- `GET /api/resumes?userId=<id>` - Get user's resumes
- `GET /api/resumes?id=<id>` - Get specific resume
- `PUT /api/resumes` - Update resume
- `DELETE /api/resumes?id=<id>` - Delete resume

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
