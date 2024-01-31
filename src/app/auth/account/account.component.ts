import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs';
import { DynamicValidatorMessageDirective } from 'src/app/shared/form/dynamic-validator-message.directive';
import { CountdownTimerComponent } from 'src/app/shared/ui/components/countdown-timer/countdown-timer.component';
import { CustomInputComponent } from 'src/app/shared/ui/components/custom-input/custom-input.component';
import { FocusVisibleDirective } from 'src/app/shared/ui/directives/focus-visible.directive';
import { alphanumericUnderscore } from 'src/app/shared/validators/alphanumeric-underscore.validator';
import { AuthApiService } from '../data-access/auth-api.service';
import { accountSettingsActions } from '../state/account-settings.actions';
import {
  selectIsDeletingAccount,
  selectIsUpdatingEmail,
  selectIsUpdatingPassword,
  selectIsUpdatingUsername,
  selectUpdateEmailSuccess,
  selectUpdatePasswordSuccess,
  selectUpdateUsernameSuccess,
} from '../state/account-settings.reducers';
import { customPassword } from '../validators/custom-password.validator';
import { passwordShouldMatch } from '../validators/password-should-match.validator';
import { UniqueEmailValidator } from '../validators/unique-email.validator';
import { UniqueUsernameValidator } from '../validators/unique-username.validator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    CustomInputComponent,
    CountdownTimerComponent,
    DynamicValidatorMessageDirective,
    FocusVisibleDirective,
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private router = inject(Router);
  private authApiService = inject(AuthApiService);
  private uniqueEmail = inject(UniqueEmailValidator);
  private uniqueUsername = inject(UniqueUsernameValidator);
  protected updateEmailForm!: FormGroup;
  protected updateUsernameForm!: FormGroup;
  protected updatePasswordForm!: FormGroup;
  protected deleteAccountForm!: FormGroup;
  protected updateEmailLoading$ = this.store.select(selectIsUpdatingEmail);
  protected updateUsernameLoading$ = this.store.select(
    selectIsUpdatingUsername,
  );
  protected updatePasswordLoading$ = this.store.select(
    selectIsUpdatingPassword,
  );
  protected deleteAccountLoading$ = this.store.select(selectIsDeletingAccount);
  private updateEmailSuccess$ = this.store.select(selectUpdateEmailSuccess);
  private updateUsernameSuccess$ = this.store.select(
    selectUpdateUsernameSuccess,
  );
  private updatePasswordSuccess$ = this.store.select(
    selectUpdatePasswordSuccess,
  );

  constructor() {
    this.updateEmailForm = this.fb.group({
      newEmail: [
        '',
        {
          validators: [Validators.required, Validators.email],
          asyncValidators: [this.uniqueEmail.validate.bind(this.uniqueEmail)],
        },
      ],
      verificationCode: ['', [Validators.required]],
    });
    this.updateUsernameForm = this.fb.group({
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
      verificationCode: ['', [Validators.required]],
    });
    this.updatePasswordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        password: ['', Validators.required, customPassword],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordShouldMatch },
    );
    this.deleteAccountForm = this.fb.group({
      password: ['', [Validators.required]],
    });
    this.updateEmailSuccess$
      .pipe(
        filter((value) => !!value),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.updateEmailForm.reset());
    this.updateUsernameSuccess$
      .pipe(
        filter((value) => !!value),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.updateUsernameForm.reset());
    this.updatePasswordSuccess$
      .pipe(
        filter((value) => !!value),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.updatePasswordForm.reset());
  }

  getCodeFromCurrentEmail(): void {
    this.authApiService
      .requestEmailVerificationCodeForLoggedInUser()
      .pipe(take(1))
      .subscribe();
  }

  getCodeFromNewEmail(): void {
    this.authApiService
      .requestEmailVerificationCodeForNewEmail(
        this.updateEmailForm.get('newEmail')?.value,
      )
      .pipe(take(1))
      .subscribe();
  }

  onUpdateEmailSubmit(): void {
    this.store.dispatch(
      accountSettingsActions.updateUserEmail({
        newEmail: this.updateEmailForm.get('newEmail')?.value,
        verificationCode: this.updateEmailForm.get('verificationCode')?.value,
      }),
    );
  }

  onUpdateUsernameSubmit(): void {
    this.store.dispatch(
      accountSettingsActions.updateUserUsername({
        username: this.updateUsernameForm.get('username')?.value,
        verificationCode:
          this.updateUsernameForm.get('verificationCode')?.value,
      }),
    );
  }

  onUpdatePasswordSubmit(): void {
    this.store.dispatch(
      accountSettingsActions.updateUserPassword({
        password: this.updatePasswordForm.get('currentPassword')?.value,
        newPassword: this.updatePasswordForm.get('password')?.value,
      }),
    );
  }

  onDeleteAccountSubmit(): void {
    this.store.dispatch(
      accountSettingsActions.deleteAccount({
        password: this.deleteAccountForm.get('password')?.value,
      }),
    );
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }
}
