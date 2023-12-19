import { HttpClient } from '@angular/common/http';
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
} from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthResponse } from './interface/auth-response.interface';
import { DecodedToken } from './interface/decoded-token.interface';
import { User } from './interface/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  router = inject(Router);
  url = environment.authUrl;
  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';
  private currentUser = 'current_user';
  private userRole$ = new BehaviorSubject<string>('');
  login$ = new Subject<User>();
  isCurrentUserAdmin$ = this.userRole$.pipe(
    switchMap((role) => {
      return of(role === 'admin');
    }),
    takeUntilDestroyed()
  );
  loginLoading$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.login$
      .pipe(
        tap(() => this.loginLoading$.next(true)),
        switchMap((user) => {
          return this.http.post<AuthResponse>(`${this.url}/login`, user).pipe(
            tap((response) => {
              this.setAccessToken(response.accessToken);
              this.setRefreshToken(response.refreshToken);
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
  }

  logout(): void {
    if (!confirm('Are you sure you want to logout?')) {
      return;
    }
    this.clearTokens();
    this.clearCurrentUser();
    this.router.navigate(['/login']);
  }

  forceLogout(): void {
    this.clearTokens();
    this.clearCurrentUser();
    this.router.navigate(['/login']);
  }

  autoLogout(): void {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('Can\'t get refresh token');
    }

    try {
      const decodedToken: DecodedToken = jwt_decode(refreshToken);
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = decodedToken.exp - currentTime;
      setTimeout(() => {
        confirm('Your session has expired, please login again.');
        this.forceLogout();
      }, timeUntilExpiry * 1000);
    } catch (error) {
      console.error('Error decoding access token:', error);
    }
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
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('Refresh token is missing'));
    }

    return this.http
      .post<AuthResponse>(`${this.url}/refresh`, { userId, refreshToken })
      .pipe(
        tap((response) => {
          this.setAccessToken(response.accessToken);
        }),
        catchError(() => {
          this.clearTokens();
          this.clearCurrentUser();
          this.router.navigate(['/login']);
          return throwError(
            () => new Error('Token refresh failed, logging out.')
          );
        })
      );
  }

  private setAccessToken(accessToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
  }

  private setRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  private setCurrentUser(userId: string): void {
    localStorage.setItem(this.currentUser, userId);
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

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  getCurrentUser(): string | null {
    return localStorage.getItem(this.currentUser);
  }

  private clearTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  private clearCurrentUser(): void {
    localStorage.removeItem(this.currentUser);
  }
}
