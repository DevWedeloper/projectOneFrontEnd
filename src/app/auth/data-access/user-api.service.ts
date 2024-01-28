import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private http = inject(HttpClient);
  private url = environment.authUrl;

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
}
