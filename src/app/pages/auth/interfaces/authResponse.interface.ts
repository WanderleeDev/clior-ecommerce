import { AuthState } from '../../../core/store/models/Auth.model';

export type AuthLoginSuccess = Pick<AuthState, 'token' | 'role'>;
