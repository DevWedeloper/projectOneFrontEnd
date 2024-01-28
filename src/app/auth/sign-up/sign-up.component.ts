import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, take } from 'rxjs';
import { DynamicValidatorMessageDirective } from 'src/app/shared/form/dynamic-validator-message.directive';
import { ValidatorMessageContainerDirective } from 'src/app/shared/form/validator-message-container.directive';
import { DividerComponent } from 'src/app/shared/ui/components/divider/divider.component';
import { SpinnerComponent } from 'src/app/shared/ui/components/spinner/spinner.component';
import { StepperNextDirective } from 'src/app/shared/ui/components/stepper/stepper-buttons/stepper-buttons.directive';
import { StepperComponent } from 'src/app/shared/ui/components/stepper/stepper.component';
import { FocusVisibleDirective } from 'src/app/shared/ui/directives/focus-visible.directive';
import { AuthApiService } from '../auth-api.service';
import { SignUpFormService } from '../data-access/sign-up-form.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FocusVisibleDirective,
    SpinnerComponent,
    DynamicValidatorMessageDirective,
    ValidatorMessageContainerDirective,
    DividerComponent,
    StepperComponent,
    StepperNextDirective,
    FocusVisibleDirective,
  ],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss', '../ui/auth-shared.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent {
  private authApiService = inject(AuthApiService);
  private signupFormService = inject(SignUpFormService);
  protected signupForm!: FormGroup;
  protected loading$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.signupForm = this.signupFormService.initializeSignupForm();
  }

  onSubmit(): void {
    console.log(this.signupForm.value);
  }

  getCode(): void {
    this.authApiService
      .requestEmailVerificationCode(this.signupForm.get('email')?.value)
      .pipe(take(1))
      .subscribe();
  }
}
