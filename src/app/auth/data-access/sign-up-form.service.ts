import { Injectable, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Observable, catchError, debounceTime, map, of, switchMap } from 'rxjs';
import { UserApiService } from './user-api.service';

@Injectable({
  providedIn: 'root',
})
export class SignUpFormService {
  private fb = inject(FormBuilder);
  private userApiService = inject(UserApiService);

  initializeSignupForm(): FormGroup {
    return this.fb.group(
      {
        email: [
          '',
          {
            validators: [Validators.required, Validators.email],
            asyncValidators: [this.uniqueEmail.bind(this)],
          },
        ],
        username: [
          '',
          {
            validators: [
              Validators.required,
              Validators.minLength(6),
              Validators.maxLength(20),
              Validators.pattern(/^[a-zA-Z0-9_]+$/),
            ],
            asyncValidators: [this.uniqueUsername.bind(this)],
          },
        ],
        password: ['', [Validators.required, this.customPassword]],
        confirmPassword: ['', [Validators.required]],
        verificationCode: ['', [Validators.required]],
      },
      { validators: this.passwordShouldMatch },
    );
  }

  private customPassword(control: AbstractControl): ValidationErrors | null {
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (control.value && !passwordPattern.test(control.value)) {
      return { customPassword: true };
    }

    return null;
  }

  private passwordShouldMatch(
    control: AbstractControl,
  ): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    const errors = { passwordShouldMatch: { mismatch: true } };

    if (password?.value === confirmPassword?.value) {
      return null;
    }

    confirmPassword?.setErrors(errors);

    return errors;
  }

  private uniqueEmail = (
    control: AbstractControl,
  ): Observable<ValidationErrors | null> => {
    if (control.getRawValue() === '') {
      return of(null);
    }

    return of(control.value).pipe(
      debounceTime(500),
      switchMap((email) =>
        this.userApiService.isEmailUnique(email).pipe(
          map((response) =>
            response.message === 'Email is unique'
              ? null
              : { uniqueName: true },
          ),
          catchError(() => {
            return of(null);
          }),
        ),
      ),
    );
  };

  private uniqueUsername = (
    control: AbstractControl,
  ): Observable<ValidationErrors | null> => {
    if (control.getRawValue() === '') {
      return of(null);
    }

    return of(control.value).pipe(
      debounceTime(500),
      switchMap((username) =>
        this.userApiService.isUsernameUnique(username).pipe(
          map((response) =>
            response.message === 'Username is unique'
              ? null
              : { uniqueName: true },
          ),
          catchError(() => {
            return of(null);
          }),
        ),
      ),
    );
  };
}
