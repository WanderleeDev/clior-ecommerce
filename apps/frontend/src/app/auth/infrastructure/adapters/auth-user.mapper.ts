import type { PetType, User } from '../../domain/models/auth.model';

/** Shape delivered by `POST /auth/login`, `POST /auth/refresh` and `GET /auth/me`. */
export interface ApiUser {
  id: string;
  email: string;
  name: string;
  role: string;
  petType: string | null;
  createdAt: string;
  emailVerifiedAt?: string | null;
}

const PET_LABELS: Record<PetType, string> = {
  dog: 'Perro',
  cat: 'Gato',
  small_pet: 'Mascota pequeña',
};

const MEMBER_SINCE = new Intl.DateTimeFormat('es', { month: 'long', year: 'numeric' });

export function toUser(api: ApiUser): User {
  const petType = isPetType(api.petType) ? api.petType : null;
  return {
    id: api.id,
    email: api.email,
    name: api.name,
    role: api.role,
    petType,
    createdAt: api.createdAt,
    pet: petType ? PET_LABELS[petType] : undefined,
    memberSince: MEMBER_SINCE.format(new Date(api.createdAt)),
  };
}

function isPetType(value: string | null): value is PetType {
  return value === 'dog' || value === 'cat' || value === 'small_pet';
}