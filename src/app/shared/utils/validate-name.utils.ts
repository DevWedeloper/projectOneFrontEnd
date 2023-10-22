import { AbstractControl } from '@angular/forms';

export function validateName(
  control: AbstractControl
): { [key: string]: boolean } | null {
  const namePattern = /^[a-zA-Z0-9_]+$/;
  const name = control.value;
  const errors: { [key: string]: boolean } = {};

  if (name.length < 6) {
    errors['minLength'] = true;
  }

  if (name.length > 20) {
    errors['maxLength'] = true;
  }

  if (!namePattern.test(name)) {
    errors['validSymbol'] = true;
  }

  if (Object.keys(errors).length > 0) {
    return errors;
  }

  return null;
}
