import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GuildUpdateResponse } from 'src/app/guilds/interfaces/guild-update-response.interface';
import { Character } from 'src/app/shared/interfaces/character.interface';
import { Guild } from 'src/app/shared/interfaces/guild.interface';
import { environment } from 'src/environments/environment';
import { GuildPagination } from '../../guilds/interfaces/guild-pagination.interface';

@Injectable({
  providedIn: 'root',
})
export class GuildApiService {
  http = inject(HttpClient);
  baseUrl = environment.baseUrl;

  createGuild(guildData: { name: string, character: string }): Observable<Guild> {
    const url = `${this.baseUrl}/guild`;
    return this.http.post<Guild>(url, guildData);
  }

  getGuilds(
    page: number,
    pageSize: number,
    sortBy?: string,
    sortOrder?: string,
    searchQuery?: string
  ): Observable<GuildPagination> {
    let url = `${this.baseUrl}/guild/?page=${page}&pageSize=${pageSize}`;
    if (sortBy) {
      url += `&sortBy=${sortBy}`;
    }
    if (sortOrder) {
      url += `&sortOrder=${sortOrder}`;
    }
    if (searchQuery) {
      url += `&search=${searchQuery}`;
    }
    return this.http.get<GuildPagination>(url);
  }

  getGuildById(guildId: string): Observable<Guild> {
    const url = `${this.baseUrl}/guild/${guildId}`;
    return this.http.get<Guild>(url);
  }

  searchGuildsByName(searchQuery: string): Observable<Guild[]> {
    const url = `${this.baseUrl}/guild/search?name=${searchQuery}`;
    return this.http.get<Guild[]>(url);
  }

  searchGuildMemberById(
    searchQuery: string,
    guildId: string
  ): Observable<Character[]> {
    const url = `${this.baseUrl}/guild/${guildId}/searchMember?name=${searchQuery}`;
    return this.http.get<Character[]>(url);
  }

  updateGuildNameById(guildId: string, newData: string): Observable<GuildUpdateResponse> {
    const url = `${this.baseUrl}/guild/name/${guildId}`;
    return this.http.put<GuildUpdateResponse>(url, newData);
  }

  updateGuildLeaderById(guildId: string, newData: string): Observable<GuildUpdateResponse> {
    const url = `${this.baseUrl}/guild/leader/${guildId}`;
    const reqBody = { character: newData };
    return this.http.put<GuildUpdateResponse>(url, reqBody);
  }

  addMemberToGuildById(guildId: string, newData: string): Observable<GuildUpdateResponse> {
    const url = `${this.baseUrl}/guild/addMember/${guildId}`;
    const reqBody = { character: newData };
    return this.http.put<GuildUpdateResponse>(url, reqBody);
  }

  removeMemberFromGuildById(
    guildId: string,
    newData: Character
  ): Observable<GuildUpdateResponse> {
    const url = `${this.baseUrl}/guild/removeMember/${guildId}`;
    const requestBody = { member: newData };
    return this.http.put<GuildUpdateResponse>(url, requestBody);
  }

  deleteGuildById(guildId: string): Observable<GuildUpdateResponse> {
    const url = `${this.baseUrl}/guild/${guildId}`;
    return this.http.delete<GuildUpdateResponse>(url);
  }
}
