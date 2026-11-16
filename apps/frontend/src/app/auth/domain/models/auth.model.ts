export type PetType = 'dog' | 'cat' | 'small_pet';

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
  /** Optional pet type used to personalize catalog recommendations. */
  petType?: PetType;
}

export interface RegisterResult {
  message: string;
}

export interface RecoverData {
  email: string;
}
