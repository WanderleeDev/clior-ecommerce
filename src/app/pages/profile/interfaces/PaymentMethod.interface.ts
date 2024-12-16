export interface PaymentMethod {
  type: PaymentCardType;
  lastFourDigits: string;
  expiryDate: string;
  logoLight: string;
  logoDark: string;
}

export type PaymentCardType = 'visa' | 'mastercard';
