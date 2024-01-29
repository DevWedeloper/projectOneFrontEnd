import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';
import { DynamicValidatorMessageDirective } from 'src/app/shared/form/dynamic-validator-message.directive';
import { ValidatorMessageContainerDirective } from 'src/app/shared/form/validator-message-container.directive';
import { FocusVisibleDirective } from 'src/app/shared/ui/directives/focus-visible.directive';
import { passwordRecoveryActions } from '../state/password-recovery.actions';
import { selectHasForgotPasswordError } from '../state/password-recovery.reducers';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    DynamicValidatorMessageDirective,
    ValidatorMessageContainerDirective,
    FocusVisibleDirective,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss', '../ui/auth-shared.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  protected forgotPasswordForm!: FormGroup;
  private error$ = this.store.select(selectHasForgotPasswordError);

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.error$
      .pipe(
        filter((value) => !!value),
        takeUntilDestroyed(),
      )
      .subscribe((error) => {
        if (error?.error === 'User not found.') {
          this.forgotPasswordForm
            .get('email')
            ?.setErrors({ noEmailRegistered: true });
        }
      });
  }

  onSubmit(): void {
    this.store.dispatch(
      passwordRecoveryActions.forgotPassword({
        email: this.forgotPasswordForm.get('email')?.value,
      }),
    );
  }
}
