import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ThemeService } from '../../shared/data-access/theme.service';
import { selectIsCurrentUserAdmin } from '../state/auth.reducers';
import { AuthApiService } from './auth-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private store = inject(Store);
  private authApiService = inject(AuthApiService);
  private destroyRef = inject(DestroyRef);
  private route = inject(Router);
  private themeService = inject(ThemeService);
  protected clientId = environment.googleClientId;
  protected loginUri = environment.googleOAuthRedirectUrl;
  isCurrentUserAdmin$ = this.store.select(selectIsCurrentUserAdmin);

  isAuthenticated(): Observable<boolean> {
    return this.authApiService.isLoggedIn().pipe(
      map(() => true),
      catchError(() =>
        this.authApiService.refreshToken().pipe(
          map(() => true),
          catchError(() => of(false)),
        ),
      ),
    );
  }

  initializeGoogleOAuth(text: 'signup_with' | 'signin_with'): void {
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
    this.themeService.isDarkMode$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        const theme = value ? 'filled_black' : 'outline';
        google.accounts.id.renderButton(
          document.getElementById('google-btn')!,
          {
            theme,
            size: 'large',
            type: 'standard',
            text,
          },
        );
      });
    google.accounts.id.prompt();
  }
}
