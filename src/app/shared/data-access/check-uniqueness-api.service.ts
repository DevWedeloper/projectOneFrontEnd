import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CheckUniquenessService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;

  checkCharacterNameUniqueness(name: string): Observable<{ message: string }> {
    const url = `${this.baseUrl}/character/unique`;
    const reqBody = { name: name };
    return this.http.post<{ message: string }>(url, reqBody);
  }

  checkGuildNameUniqueness(name: string): Observable<{ message: string }> {
    const url = `${this.baseUrl}/guild/unique`;
    const reqBody = { name: name };
    return this.http.post<{ message: string }>(url, reqBody);
  }
}
