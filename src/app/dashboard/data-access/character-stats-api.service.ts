import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Character } from 'src/app/shared/interfaces/character.interface';
import { environment } from 'src/environments/environment';
import { WellRoundedCharacter } from '../interfaces/well-rounded-character.interface';
import { AverageCharacterStats } from '../interfaces/character-average-interface';
import { CharacterDistributionByType } from '../interfaces/character-distribution.interface';

@Injectable({
  providedIn: 'root'
})
export class CharacterStatsApiService {
  private url = environment.baseUrl;

  constructor(private http: HttpClient) { }

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
