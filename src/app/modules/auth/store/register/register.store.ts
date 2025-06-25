import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { RegisterState } from './models/Register.state';
import {
  RegisterStep1,
  RegisterStep2,
  RegisterStep3,
} from './models/RegisterStep.model';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

type steps = 1 | 2 | 3;

const initialState: RegisterState = {
  step1: null,
  step2: null,
  step3: null,
};

export const RegisterStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store, router = inject(Router)) => ({
    setDataStep1: (data: RegisterStep1) => {
      patchState(store, (state) => ({ ...state, step1: data }));
      router.navigateByUrl('/auth/register/step-2');
    },

    setDataStep2: (data: RegisterStep2) => {
      patchState(store, (state) => ({ ...state, step2: data }));
      router.navigateByUrl('/auth/register/step-3');
    },

    setDataStep3: (data: RegisterStep3) =>
      patchState(store, (state) => ({ ...state, step3: data })),

    clearSteps: () => patchState(store, initialState),

    navigateByStep: (step: steps) => {
      if (![1, 2, 3].includes(step)) return;
      if (step <= 0 || step > 3) return;

      router.navigateByUrl(`/auth/register/step-${step}`);
    },
  })),
);
