export interface StoreLocation {
  name: string;
  address: string;
  hours: string;
  phone: string;
  location: Location;
}

export interface Location {
  lat: number;
  lng: number;
}
