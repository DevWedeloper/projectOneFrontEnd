import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './interface/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private http = inject(HttpClient);
  private url = environment.authUrl;

  login(user: User): Observable<void> {
    return this.http.post<void>(`${this.url}/login`, user, {
      withCredentials: true,
    });
  }

  logout(): Observable<void> {
    return this.http.post<void>(
      `${this.url}/logout`,
      {},
      {
        withCredentials: true,
      },
    );
  }

  refreshToken(): Observable<void> {
    return this.http.post<void>(
      `${this.url}/refresh`,
      {},
      {
        withCredentials: true,
      },
    );
  }

  isLoggedIn(): Observable<void> {
    return this.http.get<void>(`${this.url}/isLoggedIn`, {
      withCredentials: true,
    });
  }

  getRole(): Observable<{ role: string }> {
    return this.http.get<{ role: string }>(`${this.url}/getRole`, {
      withCredentials: true,
    });
  }

  googleOAuthHandler(credential: string): Observable<string> {
    const redirectUri = encodeURIComponent(window.location.origin);
    return this.http.post(
      `${this.url}/sessions/oauth/google?redirect_uri=${redirectUri}`,
      { credential },
      {
        withCredentials: true,
        responseType: 'text',
      },
    );
  }

  getAutoLogoutAt(): Observable<void> {
    return this.http.get<void>(`${this.url}/autoLogoutAt`, {
      withCredentials: true,
    });
  }
}
