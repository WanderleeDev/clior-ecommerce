export interface User {
  id: string;
  firstName: string;
  surname: string;
  age: number;
  email: string;
  phone: string;
  role: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
}
