import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckIfMemberApiService {
  http = inject(HttpClient);
  baseUrl = environment.baseUrl;

  checkIfMember(character: string, guild: string): Observable<{ message: string }> {
    const url = `${this.baseUrl}/guild/checkIfMember`;
    const reqBody = { character: character, guild: guild };
    return this.http.post<{ message: string }>(url, reqBody);
  }
}