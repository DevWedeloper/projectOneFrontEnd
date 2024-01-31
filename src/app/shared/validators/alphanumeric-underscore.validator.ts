import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function alphanumericUnderscore(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const pattern = /^[a-zA-Z0-9_]+$/;
    const isValid = pattern.test(control.value);

    return isValid ? null : { alphanumericUnderscore: true };
  };
}
