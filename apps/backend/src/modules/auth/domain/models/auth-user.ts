export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  /** Optional pet type chosen at registration: 'dog' | 'cat' | 'small_pet'. */
  petType: string | null;
  emailVerifiedAt: Date | null;
  createdAt: Date;
}

export interface AuthUserWithPassword extends AuthUser {
  passwordHash: string;
  failedLoginAttempts: number;
  lockedUntil: Date | null;
}
