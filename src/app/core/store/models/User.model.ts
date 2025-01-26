export interface UserState {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  image: string | null;
  email: string;
  phone: string;
  role: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
}

export const NULL_USER: UserState = {
  id: '0000-0000-0000',
  firstName: 'Guest',
  lastName: 'User',
  age: 0,
  image: null,
  email: 'email@notprovided.error',
  phone: '000-000-0000',
  role: 'guest',
  address: 'No address provided',
  city: 'No city provided',
  state: 'No state provided',
  zip: 'No zip provided',
};
