import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs';
import { DynamicValidatorMessageDirective } from '../../shared/form/dynamic-validator-message.directive';
import { ValidatorMessageContainerDirective } from '../../shared/form/validator-message-container.directive';
import { CountdownTimerComponent } from '../../shared/ui/components/countdown-timer/countdown-timer.component';
import { DividerComponent } from '../../shared/ui/components/divider/divider.component';
import { SnackbarService } from '../../shared/ui/components/snackbar/snackbar.service';
import { SpinnerComponent } from '../../shared/ui/components/spinner/spinner.component';
import { StepperNextDirective } from '../../shared/ui/components/stepper/stepper-buttons/stepper-buttons.directive';
import { StepperComponent } from '../../shared/ui/components/stepper/stepper.component';
import { FocusVisibleDirective } from '../../shared/ui/directives/focus-visible.directive';
import { AuthApiService } from '../data-access/auth-api.service';
import { SignUpFormService } from '../data-access/sign-up-form.service';
import { signUpActions } from '../state/sign-up.actions';
import {
  selectHasSignUpError,
  selectIsSigningUp,
  selectSignUpSuccess,
} from '../state/sign-up.reducers';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    FocusVisibleDirective,
    SpinnerComponent,
    DynamicValidatorMessageDirective,
    ValidatorMessageContainerDirective,
    DividerComponent,
    StepperComponent,
    StepperNextDirective,
    FocusVisibleDirective,
    CountdownTimerComponent,
  ],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss', '../ui/auth-shared.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent implements OnDestroy {
  private authApiService = inject(AuthApiService);
  private signupFormService = inject(SignUpFormService);
  private snackbarService = inject(SnackbarService);
  private store = inject(Store);
  protected signupForm!: FormGroup;
  protected loading$ = this.store.select(selectIsSigningUp);
  private error$ = this.store.select(selectHasSignUpError);
  private success$ = this.store.select(selectSignUpSuccess);

  constructor() {
    this.signupForm = this.signupFormService.initializeSignupForm();
    this.error$
      .pipe(
        filter((value) => !!value),
        takeUntilDestroyed(),
      )
      .subscribe((error) => {
        if (error?.error === 'Entered code does not match.') {
          this.signupForm
            .get('verificationCode')
            ?.setErrors({ codeMismatch: true });
        }
      });
    this.success$
      .pipe(
        filter((value) => !!value),
        takeUntilDestroyed(),
      )
      .subscribe(() =>
        this.snackbarService.open('Successfully created an account!', {
          messageType: 'success',
        }),
      );
  }

  ngOnDestroy(): void {
    this.store.dispatch(signUpActions.resetStateOnDestroy());
  }

  onSubmit(): void {
    this.store.dispatch(signUpActions.signUp({ user: this.signupForm.value }));
  }

  getCode(): void {
    this.authApiService
      .requestEmailVerificationCodeForNewEmail(
        this.signupForm.get('email')?.value,
      )
      .pipe(take(1))
      .subscribe();
  }
}
