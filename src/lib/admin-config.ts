// Admin configuration
export const ADMIN_EMAILS = [
  process.env.ADMIN_EMAIL || 'admin@resumesprites.com',
  'berostwo@gmail.com', // Your admin email
  // Add more admin emails here if needed
];

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export function isAdminUser(user: any): boolean {
  if (!user || !user.email) return false;
  return isAdmin(user.email);
}

// Get admin user info
export function getAdminUserInfo(userId: string) {
  if (!isAdminUser(userId)) {
    return null;
  }

  return {
    id: userId,
    role: 'admin',
    permissions: [
      'manage:users',
      'view:analytics',
      'manage:system',
      'view:security_logs',
      'manage:backups'
    ]
  };
} 