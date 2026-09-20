import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import type { User } from '../../domain/models/auth.model';

interface AuthState {
  user: User | null;
}

const MOCK_SESSION: User = {
  id: 'u-1',
  name: 'Mariana Torres',
  email: 'mariana@ejemplo.com',
  pet: 'Rocky · Labrador 3 años',
  memberSince: 'Enero 2024',
};

const initialState: AuthState = {
  user: MOCK_SESSION,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    current: computed(() => store.user()),
    isLoggedIn: computed(() => store.user() !== null),
  })),
  withMethods((store) => ({
    set(user: User | null): void {
      patchState(store, { user });
    },
    clear(): void {
      patchState(store, { user: null });
    },
  })),
);
