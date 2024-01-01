import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import jwt_decode from 'jwt-decode';
import { map } from 'rxjs/operators';
import { DecodedToken } from './interface/decoded-token.interface';
import { selectUserRole } from './state/auth.reducers';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private store = inject(Store);
  private accessTokenKey = 'access_token';
  private currentUser = 'current_user';
  isCurrentUserAdmin$ = this.store
    .select(selectUserRole)
    .pipe(map((userRole) => userRole === 'admin'));

  isAuthenticated(): boolean {
    const accessToken = this.isAccessTokenExisting();
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

  decodedToken(): DecodedToken {
    const accessToken = this.getAccessToken();
    return jwt_decode(accessToken);
  }

  isAccessTokenExisting(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getAccessToken(): string {
    const accessToken = localStorage.getItem(this.accessTokenKey);
    if (!accessToken) {
      throw new Error("Can't get access token");
    }
    return accessToken;
  }

  getCurrentUser(): string {
    const currentUser = localStorage.getItem(this.currentUser);
    if (!currentUser) {
      throw new Error("Can't get current user");
    }
    return currentUser;
  }

  setAccessToken(accessToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
  }

  setCurrentUser(userId: string): void {
    localStorage.setItem(this.currentUser, userId);
  }

  clearAccessToken(): void {
    localStorage.removeItem(this.accessTokenKey);
  }

  clearCurrentUser(): void {
    localStorage.removeItem(this.currentUser);
  }
}
