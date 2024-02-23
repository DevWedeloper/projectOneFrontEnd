import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { CharacterPagination } from '../../characters/interfaces/character-pagination.interface';
import { CharacterUpdateResponse } from '../../characters/interfaces/character-update-response.interface';
import { Character } from '../interfaces/character.interface';

@Injectable({
  providedIn: 'root',
})
export class CharacterApiService {
  private http = inject(HttpClient);
  private url = environment.baseUrl;

  createCharacter(characterData: Character): Observable<Character> {
    const url = `${this.url}/character`;
    return this.http.post<Character>(url, characterData, {
      withCredentials: true,
    });
  }

  getCharacters(
    page: number,
    pageSize: number,
    sortBy?: string,
    sortOrder?: string,
    searchQuery?: string,
  ): Observable<CharacterPagination> {
    let url = `${this.url}/character/?page=${page}&pageSize=${pageSize}`;
    if (sortBy) {
      url += `&sortBy=${sortBy}`;
    }
    if (sortOrder) {
      url += `&sortOrder=${sortOrder}`;
    }
    if (searchQuery) {
      url += `&search=${searchQuery}`;
    }
    return this.http.get<CharacterPagination>(url);
  }

  getCharacterById(characterId: string): Observable<Character> {
    const url = `${this.url}/character/${characterId}`;
    return this.http.get<Character>(url);
  }

  getCharacterByName(name: string): Observable<Character> {
    const url = `${this.url}/character/name/${name}`;
    return this.http.get<Character>(url);
  }

  searchCharactersByName(searchQuery: string): Observable<Character[]> {
    const url = `${this.url}/character/search?name=${searchQuery}`;
    return this.http.get<Character[]>(url);
  }

  searchCharactersByAttribute(searchQuery: string): Observable<Character[]> {
    const url = `${this.url}/character/searchAll?term=${searchQuery}`;
    return this.http.get<Character[]>(url);
  }

  updateCharacterAttributeById(
    characterId: string,
    newData: string | number,
    attribute: string,
  ): Observable<CharacterUpdateResponse> {
    const url = `${this.url}/character/${attribute}/${characterId}`;
    const requestBody = { [attribute]: newData };
    return this.http.put<CharacterUpdateResponse>(url, requestBody, {
      withCredentials: true,
    });
  }

  joinGuildById(
    characterId: string,
    guildName: string,
  ): Observable<CharacterUpdateResponse> {
    const url = `${this.url}/character/join/${characterId}`;
    const guild = guildName;
    return this.http.put<CharacterUpdateResponse>(url, guild, {
      withCredentials: true,
    });
  }

  leaveGuildById(characterId: string): Observable<CharacterUpdateResponse> {
    const url = `${this.url}/character/leave/${characterId}`;
    return this.http.put<CharacterUpdateResponse>(
      url,
      {},
      {
        withCredentials: true,
      },
    );
  }

  deleteCharacterById(characterId: string): Observable<Character> {
    const url = `${this.url}/character/${characterId}`;
    return this.http.delete<Character>(url, {
      withCredentials: true,
    });
  }
}
