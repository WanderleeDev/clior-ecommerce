export type PetType = 'dog' | 'cat' | 'small_pet';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  petType: PetType | null;
  /** ISO timestamp as delivered by the API. */
  createdAt: string;
  avatar?: string;
  /** Display-only labels derived by the adapter; views may render them directly. */
  pet?: string;
  memberSince?: string;
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