import { User } from '../store/models/User.model';

export const NULL_USER: User = {
  id: '0000-0000-0000',
  firstName: 'Guest',
  lastName: 'User',
  age: 0,
  email: 'email@notprovided.error',
  phone: '000-000-0000',
  role: 'guest',
  address: 'No address provided',
  city: 'No city provided',
  state: 'No state provided',
  zip: 'No zip provided',
};

export const EmptyUser: User = {
  id: '',
  firstName: '',
  lastName: '',
  age: 0,
  email: '',
  phone: '',
  role: 'guest',
  address: 'No address provided',
  city: 'No city provided',
  state: 'No state provided',
  zip: 'No zip provided',
};
