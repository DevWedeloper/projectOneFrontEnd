import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs';
import { DynamicValidatorMessageDirective } from 'src/app/shared/form/dynamic-validator-message.directive';
import { ValidatorMessageContainerDirective } from 'src/app/shared/form/validator-message-container.directive';
import { SpinnerComponent } from 'src/app/shared/ui/components/spinner/spinner.component';
import { FocusVisibleDirective } from 'src/app/shared/ui/directives/focus-visible.directive';
import { passwordRecoveryActions } from '../state/password-recovery.actions';
import {
  selectHasResetPasswordError,
  selectIsResettingPassword,
} from '../state/password-recovery.reducers';
import { customPassword } from '../validators/custom-password.validator';
import { passwordShouldMatch } from '../validators/password-should-match.validator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    DynamicValidatorMessageDirective,
    ValidatorMessageContainerDirective,
    FocusVisibleDirective,
    SpinnerComponent,
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss', '../ui/auth-shared.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  protected resetPasswordForm!: FormGroup;
  protected loading$ = this.store.select(selectIsResettingPassword);
  private error$ = this.store.select(selectHasResetPasswordError);

  constructor() {
    this.resetPasswordForm = this.fb.group(
      {
        password: ['', [Validators.required, customPassword]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordShouldMatch },
    );
    this.error$
      .pipe(
        filter((value) => !!value),
        takeUntilDestroyed(),
      )
      .subscribe((error) => {
        if (error?.error === 'Reset password token not found.') {
          this.resetPasswordForm
            .get('confirmPassword')
            ?.setErrors({ resetPasswordTokenExpired: true });
        }
      });
  }

  onSubmit(): void {
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      this.store.dispatch(
        passwordRecoveryActions.resetPassword({
          password: this.resetPasswordForm.get('password')?.value,
          token: params['token'],
        }),
      );
    });
  }
}
