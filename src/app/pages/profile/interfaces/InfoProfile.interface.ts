export interface InfoProfile {
  label: IconsType;
  content: string;
}

export type LabelProfileType =
  | 'email address'
  | 'home address'
  | 'delivery address'
  | 'phone number'
  | 'favorite pick-up point'
  | 'my company'
  | 'last session'
  | 'payment methods';

export type IconsType = Exclude<LabelProfileType, 'payment methods'>;
