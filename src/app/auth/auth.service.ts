import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  Subject,
  of,
  throwError,
  timer,
} from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthApiService } from './auth-api.service';
import { AuthResponse } from './interface/auth-response.interface';
import { DecodedToken } from './interface/decoded-token.interface';
import { User } from './interface/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private authApiService = inject(AuthApiService);
  private accessTokenKey = 'access_token';
  private currentUser = 'current_user';
  private userRole$ = new BehaviorSubject<string>('');
  login$ = new Subject<User>();
  private logout$ = new Subject<string>();
  isCurrentUserAdmin$ = this.userRole$.pipe(
    switchMap((role) => {
      return of(role === 'admin');
    }),
    takeUntilDestroyed()
  );
  loginLoading$ = new BehaviorSubject<boolean>(false);
  autoLogout$ = new Subject<void>();

  constructor() {
    this.login$
      .pipe(
        tap(() => this.loginLoading$.next(true)),
        switchMap((user) => {
          return this.authApiService.login(user).pipe(
            tap((response) => {
              this.setAccessToken(response.accessToken);
              this.setCurrentUser(response.userId);
              this.router.navigate(['/']);
            }),
            catchError(() => {
              this.router.navigate(['/login']);
              this.loginLoading$.next(false);
              return EMPTY;
            })
          );
        }),
        takeUntilDestroyed()
      )
      .subscribe(() => this.loginLoading$.next(false));

    this.logout$
      .pipe(
        switchMap((userId) => {
          this.clearAccessToken();
          this.clearCurrentUser();
          this.router.navigate(['/login']);
          return this.authApiService.logout(userId);
        })
      )
      .subscribe();

    this.autoLogout$
      .pipe(
        switchMap(() => {
          const accessToken = this.getAccessToken();
          if (!accessToken) {
            throw new Error('Can\'t get access token');
          }

          const decodedToken: DecodedToken = jwt_decode(accessToken);
          const currentTime = Math.floor(Date.now() / 1000);
          const timeUntilExpiry = decodedToken.exp - currentTime;
          return timer(timeUntilExpiry * 1000).pipe(
            switchMap(() =>
              this.refreshToken().pipe(
                tap(() => this.autoLogout$.next()),
                catchError(() => {
                  return EMPTY;
                })
              )
            )
          );
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  logout(): void {
    if (!confirm('Are you sure you want to logout?')) {
      return;
    }
    const userId = this.getCurrentUser();
    if (!userId) {
      throw new Error('UserId is null');
    }
    this.logout$.next(userId);
  }

  forceLogout(): void {
    const userId = this.getCurrentUser();
    if (!userId) {
      throw new Error('UserId is null');
    }
    this.logout$.next(userId);
  }

  isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      return false;
    }

    try {
      const decodedToken: DecodedToken = jwt_decode(accessToken);
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp > currentTime;
    } catch {
      return false;
    }
  }

  refreshToken(): Observable<AuthResponse> {
    const userId = this.getCurrentUser();
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      return throwError(() => new Error('Refresh token is missing'));
    }
    if (!userId) {
      return throwError(() => new Error('UserId is null'));
    }

    return this.authApiService.refreshToken(userId).pipe(
      tap((response) => {
        this.setAccessToken(response.accessToken);
      }),
      catchError((error) => {
        if (error.error.error === 'Token expired') {
          confirm('Your session has expired, please login again.');
          this.forceLogout();
          return EMPTY;
        }
        this.forceLogout();
        return throwError(
          () => new Error('Token refresh failed, logging out.')
        );
      })
    );
  }

  setUserRole(): void {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new Error('Can\'t get access token');
    }
    const decodedToken: DecodedToken = jwt_decode(accessToken);
    this.userRole$.next(decodedToken.role);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getCurrentUser(): string | null {
    return localStorage.getItem(this.currentUser);
  }

  private setAccessToken(accessToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
  }

  private setCurrentUser(userId: string): void {
    localStorage.setItem(this.currentUser, userId);
  }

  private clearAccessToken(): void {
    localStorage.removeItem(this.accessTokenKey);
  }

  private clearCurrentUser(): void {
    localStorage.removeItem(this.currentUser);
  }
}
