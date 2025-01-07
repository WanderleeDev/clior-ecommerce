import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordMatchValidator(
  control: AbstractControl,
): ValidationErrors | null {
  if (!control || !control.parent) {
    return null;
  }

  const password = control.parent.get('password');
  const confirmPassword = control;

  if (!password || !confirmPassword || !password.value) {
    return null;
  }

  return password.value === confirmPassword.value
    ? null
    : { passwordMismatch: true };
}
