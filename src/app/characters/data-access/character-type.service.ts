import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CharacterType } from '../interfaces/character-type.interface';

@Injectable({
  providedIn: 'root',
})
export class CharacterTypeService {
  private http = inject(HttpClient);
  private url = environment.baseUrl;

  getCharacterTypes(): Observable<CharacterType[]> {
    const url = `${this.url}/characterTypes`;
    return this.http.get<CharacterType[]>(url);
  }
}
