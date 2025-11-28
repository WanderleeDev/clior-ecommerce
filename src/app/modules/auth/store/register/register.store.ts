import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
  withProps,
} from '@ngrx/signals';
import { RegisterPayload, RegisterState } from './models/Register.state';
import {
  RegisterStep1,
  RegisterStep2,
  RegisterStep3,
  Steps
} from './models/RegisterStep.model';
import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


const initialState: RegisterState = {
  step1: null,
  step2: null,
  step3: null,
  isSubmitting: false,
};

export const RegisterStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withProps(() => ({
    router: inject(Router),
    authService: inject(AuthService),
  })),

  withComputed(({ step1, step2, step3 }) => ({
    isReadyToRegister: computed(() => step1() && step2() && step3()),
    registerPayload: computed(
      (): RegisterPayload => ({
        step1: step1(),
        step2: step2(),
        step3: step3(),
      }),
    ),
  })),

  withMethods(({ router, authService, ...store }) => ({
    setDataStep1: (data: RegisterStep1) => {
      patchState(store, () => ({ step1: data }));
      router.navigateByUrl('/auth/register/step-2');
    },

    setDataStep2: (data: RegisterStep2) => {
      patchState(store, () => ({ step2: data }));
      router.navigateByUrl('/auth/register/step-3');
    },

    setDataStep3: (data: RegisterStep3) => {
      patchState(store, () => ({ step3: data }));
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
  })),
);
