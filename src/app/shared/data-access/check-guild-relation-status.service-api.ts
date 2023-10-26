import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CheckGuildRelationStatusServiceApi {
  http = inject(HttpClient);
  baseUrl = environment.baseUrl;

  checkGuildRelationStatus(
    character: string
  ): Observable<{
    hasNoGuild?: boolean;
    memberOfGuild?: boolean;
    leaderOfGuild?: boolean;
  }> {
    const url = `${this.baseUrl}/character/checkGuildRelationStatus`;
    const reqBody = { character: character };
    return this.http.post(url, reqBody);
  }
}
