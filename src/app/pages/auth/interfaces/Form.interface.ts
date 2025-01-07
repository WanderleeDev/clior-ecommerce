export interface AccountData {
  email: string;
  password: string;
  confirmPassword: string;
  secretKey: string;
}

export interface PersonalData {
  name: string;
  surname: string;
  phone: string;
  age: string;
}

export type PrevDataUser = PersonalData & Omit<AccountData, 'confirmPassword'>;
