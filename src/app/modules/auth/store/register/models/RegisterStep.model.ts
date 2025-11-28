export interface RegisterStep1 {
  name: string;
  surname: string;
  phone: string;
  age: string;
}

export interface RegisterStep2 {
  email: string;
  password: string;
  confirmPassword: string;
  secretKey: string;
}

export interface RegisterStep3 {
  acceptTermAndConditions: boolean;
}

export type Steps = 1 | 2 | 3;
