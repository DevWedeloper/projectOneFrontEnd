import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WellRoundedGuild } from '../interfaces/well-rounded-guild.interface';
import { GuildAttribute } from '../interfaces/guild-attribute.interface';
import { AverageGuildStats } from '../interfaces/guild-average-attribute.interface';

@Injectable({
  providedIn: 'root'
})
export class GuildStatsApiService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getTopGuildsByAttribute(attribute: string): Observable<GuildAttribute[]> {
    const url = `${this.baseUrl}/guildStats/topAttribute/${attribute}`;
    return this.http.get<GuildAttribute[]>(url);
  }

  getTopWellRoundedGuilds(): Observable<WellRoundedGuild[]> {
    const url = `${this.baseUrl}/guildStats/topWellRounded`;
    return this.http.get<WellRoundedGuild[]>(url);
  }

  getTopGuildsByAverageAttribute(attribute: string): Observable<AverageGuildStats[]> {
    const url = `${this.baseUrl}/guildStats/averageAttribute/${attribute}`;
    return this.http.get<AverageGuildStats[]>(url);
  }
}
