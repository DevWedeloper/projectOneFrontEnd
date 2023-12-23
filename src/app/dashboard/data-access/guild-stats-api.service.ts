import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Guild } from 'src/app/shared/interfaces/guild.interface';
import { environment } from 'src/environments/environment';
import { AverageGuildStats } from '../interfaces/guild-average-attribute.interface';
import { WellRoundedGuild } from '../interfaces/well-rounded-guild.interface';

@Injectable({
  providedIn: 'root'
})
export class GuildStatsApiService {
  private url = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getTopGuildsByAttribute(attribute: string): Observable<Guild[]> {
    const url = `${this.url}/guildStats/topAttribute/${attribute}`;
    return this.http.get<Guild[]>(url);
  }

  getTopWellRoundedGuilds(): Observable<WellRoundedGuild[]> {
    const url = `${this.url}/guildStats/topWellRounded`;
    return this.http.get<WellRoundedGuild[]>(url);
  }

  getTopGuildsByAverageAttribute(attribute: string): Observable<AverageGuildStats[]> {
    const url = `${this.url}/guildStats/averageAttribute/${attribute}`;
    return this.http.get<AverageGuildStats[]>(url);
  }
}
