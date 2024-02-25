import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CharacterType } from '../interfaces/character-type.interface';

@Injectable({
  providedIn: 'root',
})
export class CharacterTypeApiService {
  private http = inject(HttpClient);
  private url = environment.baseUrl;

  getCharacterTypes(): Observable<CharacterType[]> {
    const url = `${this.url}/characterTypes`;
    return this.http.get<CharacterType[]>(url);
  }
}
