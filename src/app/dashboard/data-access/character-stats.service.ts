import { Injectable, inject } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import {
  Observable,
  map
} from 'rxjs';
import { Character } from 'src/app/shared/interfaces/character.interface';
import { CharacterStatsApiService } from './character-stats-api.service';

interface TopCharactersByAttributeOptions {
  attribute: string;
  backgroundColor: string;
}

@Injectable({
  providedIn: 'root',
})
export class CharacterStatsService {
  private characterStatsApiService = inject(CharacterStatsApiService);
  
  generateTopCharactersByAttribute({
    attribute,
    backgroundColor,
  }: TopCharactersByAttributeOptions): Observable<{
    names: string[];
    dataset: ChartConfiguration<'bar'>['data']['datasets'];
  } | null> {
    return this.characterStatsApiService
      .getTopCharactersByAttribute(attribute)
      .pipe(
        map((characters) => {
          if (characters.length === 0) {
            return null;
          }
          const names = characters.map((characters) => characters.name);
          const combinedAttributes = characters.map(
            (character) => character[attribute as keyof Character] as number,
          );
          const dataset: ChartConfiguration<'bar'>['data']['datasets'] = [
            {
              data: combinedAttributes,
              backgroundColor: `${backgroundColor}`,
            },
          ];
          return { names, dataset };
        }),
      );
  }
}
