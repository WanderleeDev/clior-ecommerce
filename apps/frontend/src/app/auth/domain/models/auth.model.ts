export interface User {
  id: string;
  name: string;
  email: string;
  pet: string;
  avatar?: string;
  memberSince: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  pet: string;
}

export interface RecoverData {
  email: string;
}
