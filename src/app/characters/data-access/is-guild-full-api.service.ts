import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class isGuildFullApiService {
  http = inject(HttpClient);
  baseUrl = environment.baseUrl;

  isGuildFull(guild: string): Observable<{ message: string }> {
    const url = `${this.baseUrl}/guild/isFull`;
    const reqBody = { guild };
    return this.http.post<{ message: string }>(url, reqBody);
  }
}