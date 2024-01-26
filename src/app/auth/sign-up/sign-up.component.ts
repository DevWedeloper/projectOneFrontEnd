import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { DynamicValidatorMessageDirective } from 'src/app/shared/form/dynamic-validator-message.directive';
import { ValidatorMessageContainerDirective } from 'src/app/shared/form/validator-message-container.directive';
import { DividerComponent } from 'src/app/shared/ui/components/divider/divider.component';
import { SpinnerComponent } from 'src/app/shared/ui/components/spinner/spinner.component';
import { FocusVisibleDirective } from 'src/app/shared/ui/directives/focus-visible.directive';
import { AuthService } from '../auth.service';
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
  ],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss', '../ui/auth-shared.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent implements OnInit {
  private authService = inject(AuthService);
  private signupFormService = inject(SignUpFormService);
  protected signupForm!: FormGroup;
  protected loading$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.signupForm = this.signupFormService.initializeSignupForm();
  }

  ngOnInit(): void {
    this.authService.initializeGoogleOAuth('signup_with');
  }

  onSubmit(): void {
    console.log(this.signupForm.value);
  }
}
