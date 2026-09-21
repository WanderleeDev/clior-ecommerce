export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface AuthUserWithPassword extends AuthUser {
  passwordHash: string;
}
