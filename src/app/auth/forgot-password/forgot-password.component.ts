import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  inject,
} from '@angular/core';
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
import { SpinnerComponent } from 'src/app/shared/ui/components/spinner/spinner.component';
import { FocusVisibleDirective } from 'src/app/shared/ui/directives/focus-visible.directive';
import { passwordRecoveryActions } from '../state/password-recovery.actions';
import {
  selectForgetPasswordLoading,
  selectHasForgotPasswordError,
} from '../state/password-recovery.reducers';

@Component({
  selector: 'app-forgot-password',
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
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss', '../ui/auth-shared.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  protected forgotPasswordForm!: FormGroup;
  protected loading$ = this.store.select(selectForgetPasswordLoading);
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

  ngOnDestroy(): void {
    this.store.dispatch(passwordRecoveryActions.resetStateOnDestroy());
  }

  onSubmit(): void {
    this.store.dispatch(
      passwordRecoveryActions.forgotPassword({
        email: this.forgotPasswordForm.get('email')?.value,
      }),
    );
  }
}
