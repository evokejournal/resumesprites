// Admin configuration
export const ADMIN_USERS = [
  'JmkX3pzZK3ZKURwmLIOM90E5OJC3', // Your admin user ID
];

// Admin email addresses (optional additional verification)
export const ADMIN_EMAILS = [
  'admin@resumesprites.com',
];

// Check if user is admin
export function isAdminUser(userId: string): boolean {
  return ADMIN_USERS.includes(userId);
}

// Check if email is admin
export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email);
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