import { DestroyRef, inject, signal, type Signal } from '@angular/core';

export const RESEND_COOLDOWN_SECONDS = 60;

export interface ResendCooldown {
  /** Seconds left before the button becomes usable again. `0` means ready. */
  readonly remaining: Signal<number>;
  start(): void;
}

/**
 * Countdown shared by the two screens that can resend a verification email
 * (`/registro` success state and `/verificar` failure state).
 *
 * Every step lives in a signal so the button label reacts on its own, and the
 * interval is cleared when the view is destroyed to keep SSR and navigation
 * clean. Must be called in an injection context (a component field initializer).
 */
export function createResendCooldown(seconds: number = RESEND_COOLDOWN_SECONDS): ResendCooldown {
  const destroyRef = inject(DestroyRef);
  const remaining = signal(0);
  let timer: ReturnType<typeof setInterval> | null = null;

  const stop = (): void => {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  };

  destroyRef.onDestroy(stop);

  return {
    remaining: remaining.asReadonly(),
    start(): void {
      stop();
      remaining.set(seconds);
      timer = setInterval(() => {
        const next = remaining() - 1;
        remaining.set(next > 0 ? next : 0);
        if (next <= 0) stop();
      }, 1000);
    },
  };
}
