import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { RegisterPayload, RegisterState } from './models/Register.state';
import {
  RegisterStep1,
  RegisterStep2,
  RegisterStep3,
} from './models/RegisterStep.model';
import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export type Steps = 1 | 2 | 3;

const initialState: RegisterState = {
  step1: null,
  step2: null,
  step3: null,
  isSubmitting: false,
};

export const RegisterStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => ({
    isReadyToRegister: computed(
      () => store.step1() && store.step2() && store.step3(),
    ),
    registerPayload: computed(
      (): RegisterPayload => ({
        step1: store.step1(),
        step2: store.step2(),
        step3: store.step3(),
      }),
    ),
  })),

  withMethods(
    (store, router = inject(Router), authService = inject(AuthService)) => ({
      setDataStep1: (data: RegisterStep1) => {
        patchState(store, (state) => ({ ...state, step1: data }));
        router.navigateByUrl('/auth/register/step-2');
      },

      setDataStep2: (data: RegisterStep2) => {
        patchState(store, (state) => ({ ...state, step2: data }));
        router.navigateByUrl('/auth/register/step-3');
      },

      setDataStep3: (data: RegisterStep3) => {
        patchState(store, (state) => ({
          ...state,
          step3: data,
        }));
      },

      sendRegister: async () => {
        if (!store.isReadyToRegister()) return;

        patchState(store, { isSubmitting: true });
        await authService.register(store.registerPayload());
        patchState(store, initialState);
      },

      navigateByStep: (step: Steps) => {
        if (step > 3 || step <= 0 || store.isSubmitting()) return;

        router.navigateByUrl(`/auth/register/step-${step}`);
      },

      clearSteps: () => patchState(store, initialState),
    }),
  ),
);
