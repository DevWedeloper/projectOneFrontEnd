import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChartConfiguration } from 'chart.js';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  map,
  take,
  tap,
} from 'rxjs';
import { Character } from 'src/app/shared/interfaces/character.interface';
import { AverageCharacterStats } from '../interfaces/character-average-interface';
import { WellRoundedCharacter } from '../interfaces/well-rounded-character.interface';
import { CharacterStatsApiService } from './character-stats-api.service';
import { ChartColorService } from './chart-color.service';
import { DashboardLoadingService } from './dashboard-loading.service';

interface TopCharactersByAttributeOptions {
  attribute: string;
  backgroundColor: string;
}

@Injectable({
  providedIn: 'root',
})
export class CharacterStatsService {
  private characterStatsApiService = inject(CharacterStatsApiService);
  private ccs = inject(ChartColorService);
  private ls = inject(DashboardLoadingService);
  readonly topCharactersByHealth$ = this.generateTopCharactersByAttribute({
    attribute: 'health',
    backgroundColor: this.ccs.healthColor,
  });
  readonly topCharactersByStrength$ = this.generateTopCharactersByAttribute({
    attribute: 'strength',
    backgroundColor: this.ccs.strengthColor,
  });
  readonly topCharactersByAgility$ = this.generateTopCharactersByAttribute({
    attribute: 'agility',
    backgroundColor: this.ccs.agilityColor,
  });
  readonly topCharactersByIntelligence$ = this.generateTopCharactersByAttribute(
    {
      attribute: 'intelligence',
      backgroundColor: this.ccs.intelligenceColor,
    }
  );
  readonly topCharactersByArmor$ = this.generateTopCharactersByAttribute({
    attribute: 'armor',
    backgroundColor: this.ccs.armorColor,
  });
  readonly topCharactersByCritChance$ = this.generateTopCharactersByAttribute({
    attribute: 'critChance',
    backgroundColor: this.ccs.critChanceColor,
  });
  readonly topWellRoundedCharacters$ = this.characterStatsApiService
    .getTopWellRoundedCharacters()
    .pipe(
      map((characters) => {
        if (characters.length === 0) {
          return null;
        }
        return characters;
      })
    );
  readonly averageCharacterStats$ =
    this.characterStatsApiService.getAverageCharacterStats();
  readonly radarChartCharacter$ =
    new BehaviorSubject<WellRoundedCharacter | null>(null);
  readonly radarChartDataset$ = combineLatest([
    this.radarChartCharacter$,
    this.averageCharacterStats$,
  ]).pipe(
    map(([selectedCharacter, averageCharacterStats]) => {
      const labels = [
        'Health',
        'Strength',
        'Agility',
        'Intelligence',
        'Armor',
        'Crit Chance',
      ];
      const dataset: ChartConfiguration<'radar'>['data']['datasets'] = [
        {
          data: [
            selectedCharacter?.health != null
              ? selectedCharacter.health / 100
              : 0,
            selectedCharacter?.strength ?? 0,
            selectedCharacter?.agility ?? 0,
            selectedCharacter?.intelligence ?? 0,
            selectedCharacter?.armor ?? 0,
            selectedCharacter?.critChance != null
              ? selectedCharacter.critChance * 100
              : 0,
          ],
          label: 'Value',
        },
        {
          data: [
            averageCharacterStats?.avgHealth != null
              ? averageCharacterStats.avgHealth / 100
              : 0,
            averageCharacterStats?.avgStrength ?? 0,
            averageCharacterStats?.avgAgility ?? 0,
            averageCharacterStats?.avgIntelligence ?? 0,
            averageCharacterStats?.avgArmor ?? 0,
            averageCharacterStats?.avgCritChance != null
              ? averageCharacterStats.avgCritChance * 100
              : 0,
          ],
          label: 'Average',
        },
      ];
      return { labels, dataset };
    })
  );
  readonly characterDistributionByType$ = this.characterStatsApiService
    .getCharacterDistributionByType()
    .pipe(
      map((data) => {
        if (data.length === 0) {
          return null;
        }
        const ids = data.map((item) => item._id);
        const counts = data.map((item) => item.count);
        const dataset: ChartConfiguration<'polarArea'>['data']['datasets'] = [
          { data: counts || [] },
        ];
        return { ids, dataset };
      })
    );

  constructor() {
    const observables: Observable<
      | {
          names: string[];
          dataset: ChartConfiguration<'bar'>['data']['datasets'];
        }
      | WellRoundedCharacter[]
      | {
          labels: string[];
          dataset: ChartConfiguration<'radar'>['data']['datasets'];
        }
      | AverageCharacterStats
      | {
          ids: string[];
          dataset: ChartConfiguration<'polarArea'>['data']['datasets'];
        }
      | null
    >[] = [
      this.topCharactersByHealth$,
      this.topCharactersByStrength$,
      this.topCharactersByAgility$,
      this.topCharactersByIntelligence$,
      this.topCharactersByArmor$,
      this.topCharactersByCritChance$,
      this.topWellRoundedCharacters$,
      this.averageCharacterStats$,
      this.radarChartDataset$,
      this.characterDistributionByType$,
    ];
    this.ls.waitForObservables(observables);
    this.topWellRoundedCharacters$
      .pipe(
        take(1),
        takeUntilDestroyed(),
        tap((characters) => {
          this.radarChartCharacter$.next(characters?.[0] || null);
        })
      )
      .subscribe();
  }

  private generateTopCharactersByAttribute({
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
            (character) => character[attribute as keyof Character] as number
          );
          const dataset: ChartConfiguration<'bar'>['data']['datasets'] = [
            {
              data: combinedAttributes,
              backgroundColor: `${backgroundColor}`,
            },
          ];
          return { names, dataset };
        })
      );
  }
}
