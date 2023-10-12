import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Character } from '../interfaces/character.interface';
import { CharacterPagination } from 'src/app/characters/interfaces/character-pagination.interface';
import { CharacterUpdateResponse } from 'src/app/characters/interfaces/character-update-response.interface';

@Injectable({
  providedIn: 'root',
})
export class CharacterApiService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  createCharacter(characterData: Character): Observable<Character> {
    const url = `${this.baseUrl}/character`;
    return this.http.post<Character>(url, characterData);
  }

  getCharacters(
    page: number,
    pageSize: number,
    sortBy?: string,
    sortOrder?: string,
    searchQuery?: string
  ): Observable<CharacterPagination> {
    let url = `${this.baseUrl}/character/?page=${page}&pageSize=${pageSize}`;
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
    const url = `${this.baseUrl}/character/${characterId}`;
    return this.http.get<Character>(url);
  }

  searchCharactersByName(searchQuery: string): Observable<Character[]> {
    const url = `${this.baseUrl}/character/search?name=${searchQuery}`;
    return this.http.get<Character[]>(url);
  }

  searchCharactersByAttribute(searchQuery: string): Observable<Character[]> {
    const url = `${this.baseUrl}/character/searchAll?term=${searchQuery}`;
    return this.http.get<Character[]>(url);
  }

  updateCharacterAttributeById(
    characterId: string,
    newData: string | number,
    attribute: string
  ): Observable<CharacterUpdateResponse> {
    const url = `${this.baseUrl}/character/${attribute}/${characterId}`;
    const requestBody = { [attribute]: newData };
    return this.http.put<CharacterUpdateResponse>(url, requestBody);
  }

  joinGuildById(characterId: string, newData: { guild: string }): Observable<CharacterUpdateResponse> {
    const url = `${this.baseUrl}/character/join/${characterId}`;
    return this.http.put<CharacterUpdateResponse>(url, newData);
  }

  leaveGuildById(characterId: string): Observable<CharacterUpdateResponse> {
    const url = `${this.baseUrl}/character/leave/${characterId}`;
    return this.http.put<CharacterUpdateResponse>(url, {});
  }

  deleteCharacterById(characterId: string): Observable<Character> {
    const url = `${this.baseUrl}/character/${characterId}`;
    return this.http.delete<Character>(url);
  }
}
