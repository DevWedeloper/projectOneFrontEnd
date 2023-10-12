import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CharacterType } from '../interfaces/character-type.interface';

@Injectable({
  providedIn: 'root',
})
export class CharacterTypeService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getCharacterTypes(): Observable<CharacterType[]> {
    const url = `${this.baseUrl}/characterTypes`;
    return this.http.get<CharacterType[]>(url);
  }
}
