import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserSignUp } from '../interface/user-sign-up.type';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private url = environment.authUrl;

  createUser(user: UserSignUp): Observable<void> {
    return this.http.post<void>(`${this.url}/user`, {
      email: user.email,
      username: user.username,
      password: user.password,
      verificationCode: user.verificationCode,
    });
  }

  isEmailUnique(email: string): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(
      `${this.url}/user/unique/email/${email}`,
    );
  }

  isUsernameUnique(username: string): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(
      `${this.url}/user/unique/username/${username}`,
    );
  }

  forgotPassword(email: string): Observable<void> {
    const redirectUri = encodeURIComponent(window.location.origin);
    return this.http.post<void>(
      `${this.url}/user/forgotPassword/?reset_password_url=${redirectUri}/reset-password`,
      { email },
    );
  }

  resetPassword(password: string, token: string): Observable<void> {
    return this.http.post<void>(
      `${this.url}/user/resetPassword/?token=${token}`,
      {
        password,
      },
    );
  }

  isResetPasswordTokenExisting(token: string): Observable<void> {
    return this.http.get<void>(
      `${this.url}/user/checkResetPasswordToken/${token}`,
    );
  }
}
