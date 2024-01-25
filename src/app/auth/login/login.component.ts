import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
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
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';
import { AuthService } from '../auth.service';
import { authActions } from '../state/auth.actions';
import {
  selectHasLoginError,
  selectIsLoggingIn,
} from '../state/auth.reducers';
import { DynamicValidatorMessageDirective } from '../../shared/form/dynamic-validator-message.directive';
import { ValidatorMessageContainerDirective } from '../../shared/form/validator-message-container.directive';
import { DividerComponent } from '../../shared/ui/components/divider/divider.component';
import { SpinnerComponent } from '../../shared/ui/components/spinner/spinner.component';
import { FocusVisibleDirective } from '../../shared/ui/directives/focus-visible.directive';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  protected loginForm!: FormGroup;
  private store = inject(Store);
  private errors$ = this.store.select(selectHasLoginError);
  protected loading$ = this.store.select(selectIsLoggingIn);

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.errors$
      .pipe(
        filter((value) => !!value),
        takeUntilDestroyed(),
      )
      .subscribe((error) => {
        if (error?.error.error === 'Invalid username') {
          this.loginForm.get('username')?.setErrors({ invalidUsername: true });
        }
        if (error?.error.error === 'Invalid password') {
          this.loginForm.get('password')?.setErrors({ invalidPassword: true });
        }
      });
  }

  ngOnInit(): void {
    this.authService.initializeGoogleOAuth();
  }

  onSubmit(): void {
    this.store.dispatch(
      authActions.login({
        user: this.loginForm.value,
      }),
    );
  }
}
