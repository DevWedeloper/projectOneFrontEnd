import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { alphanumericUnderscore } from 'src/app/shared/validators/alphanumeric-underscore.validator';
import { customPassword } from '../validators/custom-password.validator';
import { passwordShouldMatch } from '../validators/password-should-match.validator';
import { UniqueEmailValidator } from '../validators/unique-email.validator';
import { UniqueUsernameValidator } from '../validators/unique-username.validator';

@Injectable({
  providedIn: 'root',
})
export class SignUpFormService {
  private fb = inject(FormBuilder);
  private uniqueEmail = inject(UniqueEmailValidator);
  private uniqueUsername = inject(UniqueUsernameValidator);

  initializeSignupForm(): FormGroup {
    return this.fb.group(
      {
        email: [
          '',
          {
            validators: [Validators.required, Validators.email],
            asyncValidators: [this.uniqueEmail.validate.bind(this.uniqueEmail)],
          },
        ],
        username: [
          '',
          {
            validators: [
              Validators.required,
              Validators.minLength(6),
              Validators.maxLength(20),
              alphanumericUnderscore,
            ],
            asyncValidators: [
              this.uniqueUsername.validate.bind(this.uniqueUsername),
            ],
          },
        ],
        password: ['', [Validators.required, customPassword]],
        confirmPassword: ['', [Validators.required]],
        verificationCode: ['', [Validators.required]],
      },
      { validators: passwordShouldMatch },
    );
  }
}
