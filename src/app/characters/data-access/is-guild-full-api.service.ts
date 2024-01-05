import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class IsGuildFullApiService {
  private http = inject(HttpClient);
  private url = environment.baseUrl;

  isGuildFull(guild: string): Observable<{ isFull: boolean }> {
    const url = `${this.url}/guild/isFull`;
    return this.http.post<{ isFull: boolean }>(url, guild);
  }
}
