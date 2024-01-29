import { AbstractControl, ValidationErrors } from '@angular/forms';

export function customPassword(
  control: AbstractControl,
): ValidationErrors | null {
  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  if (control.value && !passwordPattern.test(control.value)) {
    return { customPassword: true };
  }

  return null;
}
