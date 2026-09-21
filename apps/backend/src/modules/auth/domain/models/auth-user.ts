export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  emailVerifiedAt: Date | null;
  createdAt: Date;
}

export interface AuthUserWithPassword extends AuthUser {
  passwordHash: string;
  failedLoginAttempts: number;
  lockedUntil: Date | null;
}
