import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponse } from './interface/auth-response.interface';
import { User } from './interface/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private http = inject(HttpClient);
  private url = environment.authUrl;

  login(user: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.url}/login`, user);
  }

  logout(refreshToken: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.url}/logout`, {
      refreshToken,
    });
  }

  refreshToken(refreshToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.url}/refresh`, {
      refreshToken,
    });
  }
}
