import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Character } from '../../shared/interfaces/character.interface';
import { AverageCharacterStats } from '../interfaces/character-average-interface';
import { CharacterDistributionByType } from '../interfaces/character-distribution.interface';
import { WellRoundedCharacter } from '../interfaces/well-rounded-character.interface';

@Injectable({
  providedIn: 'root',
})
export class CharacterStatsApiService {
  private http = inject(HttpClient);
  private url = environment.baseUrl;

  getTopCharactersByAttribute(attribute: string): Observable<Character[]> {
    const url = `${this.url}/characterStats/topStats/${attribute}`;
    return this.http.get<Character[]>(url);
  }

  getTopWellRoundedCharacters(): Observable<WellRoundedCharacter[]> {
    const url = `${this.url}/characterStats/topWellRounded`;
    return this.http.get<WellRoundedCharacter[]>(url);
  }

  getAverageCharacterStats(): Observable<AverageCharacterStats> {
    const url = `${this.url}/characterStats/averageStats`;
    return this.http.get<AverageCharacterStats>(url);
  }

  getCharacterDistributionByType(): Observable<CharacterDistributionByType[]> {
    const url = `${this.url}/characterStats/characterDistribution`;
    return this.http.get<CharacterDistributionByType[]>(url);
  }
}
