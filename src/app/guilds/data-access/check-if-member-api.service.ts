import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CheckIfMemberApiService {
  private http = inject(HttpClient);
  private url = environment.baseUrl;

  isMember(character: string, guild: string): Observable<{ message: string }> {
    const url = `${this.url}/guild/isMember`;
    const reqBody = { character: character, guild: guild };
    return this.http.post<{ message: string }>(url, reqBody);
  }

  isNotMember(
    character: string,
    guild: string,
  ): Observable<{ message: string }> {
    const url = `${this.url}/guild/isNotMember`;
    const reqBody = { character: character, guild: guild };
    return this.http.post<{ message: string }>(url, reqBody);
  }
}
