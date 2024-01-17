import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
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
import { environment } from 'src/environments/environment';
import { AuthApiService } from '../auth/auth-api.service';
import { authActions } from '../auth/state/auth.actions';
import {
  selectHasLoginError,
  selectIsLoggingIn,
} from '../auth/state/auth.reducers';
import { DynamicValidatorMessageDirective } from '../shared/form/dynamic-validator-message.directive';
import { ValidatorMessageContainerDirective } from '../shared/form/validator-message-container.directive';
import { DividerComponent } from '../shared/ui/components/divider/divider.component';
import { SpinnerComponent } from '../shared/ui/components/spinner/spinner.component';
import { FocusVisibleDirective } from '../shared/ui/directives/focus-visible.directive';
import { Router } from '@angular/router';

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
  private authApiService = inject(AuthApiService);
  private destroyRef = inject(DestroyRef);
  private route = inject(Router);
  protected loginForm!: FormGroup;
  private store = inject(Store);
  private errors$ = this.store.select(selectHasLoginError);
  protected loading$ = this.store.select(selectIsLoggingIn);
  protected clientId = environment.googleClientId;
  protected loginUri = environment.googleOAuthRedirectUrl;

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
    const redirectUri = encodeURIComponent(window.location.origin);
    google.accounts.id.initialize({
      client_id: this.clientId,
      login_uri: `${this.loginUri}?redirect_uri=${redirectUri}`,
      ux_mode: 'redirect',
      use_fedcm_for_prompt: true,
      callback: (data) => {
        this.authApiService
          .googleOAuthHandler(data.credential)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => this.route.navigate(['/']));
      },
    });
    const theme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'filled_black'
      : 'outline';
    google.accounts.id.renderButton(document.getElementById('google-btn')!, {
      theme,
      size: 'large',
      type: 'standard',
    });
    google.accounts.id.prompt();
  }

  onSubmit(): void {
    this.store.dispatch(
      authActions.login({
        user: this.loginForm.value,
      }),
    );
  }
}
