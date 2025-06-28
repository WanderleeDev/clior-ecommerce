import {
  RegisterStep1,
  RegisterStep2,
  RegisterStep3,
} from './RegisterStep.model';

export interface RegisterState {
  step1: RegisterStep1 | null;
  step2: RegisterStep2 | null;
  step3: RegisterStep3 | null;
  isSubmitting: boolean;
}

export type RegisterPayload = Omit<RegisterState, 'isSubmitting'>;
