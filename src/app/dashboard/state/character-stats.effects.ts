import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ChartConfiguration } from 'chart.js';
import { catchError, combineLatest, map, of, switchMap } from 'rxjs';
import { CharacterStatsApiService } from '../data-access/character-stats-api.service';
import { CharacterStatsService } from '../data-access/character-stats.service';
import { ChartColorService } from '../data-access/chart-color.service';
import { characterStatsActions } from './character-stats.actions';

@Injectable()
export class CharacterStatsEffects {
  private actions$ = inject(Actions);
  private characterStatsApiService = inject(CharacterStatsApiService);
  private characterStatsService = inject(CharacterStatsService);
  private ccs = inject(ChartColorService);

  topCharactersByHealth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(characterStatsActions.loadTopCharactersByHealth),
      switchMap(() =>
        this.characterStatsService
          .generateTopCharactersByAttribute({
            attribute: 'health',
            backgroundColor: this.ccs.healthColor,
          })
          .pipe(
            map((data) =>
              characterStatsActions.loadTopCharactersByHealthSuccess({ data }),
            ),
            catchError(() =>
              of(characterStatsActions.loadTopCharactersByHealthFailure()),
            ),
          ),
      ),
    ),
  );

  topCharactersByStrength$ = createEffect(() =>
    this.actions$.pipe(
      ofType(characterStatsActions.loadTopCharactersByStrength),
      switchMap(() =>
        this.characterStatsService
          .generateTopCharactersByAttribute({
            attribute: 'strength',
            backgroundColor: this.ccs.strengthColor,
          })
          .pipe(
            map((data) =>
              characterStatsActions.loadTopCharactersByStrengthSuccess({
                data,
              }),
            ),
            catchError(() =>
              of(characterStatsActions.loadTopCharactersByStrengthFailure()),
            ),
          ),
      ),
    ),
  );

  topCharactersByAgility$ = createEffect(() =>
    this.actions$.pipe(
      ofType(characterStatsActions.loadTopCharactersByAgility),
      switchMap(() =>
        this.characterStatsService
          .generateTopCharactersByAttribute({
            attribute: 'agility',
            backgroundColor: this.ccs.agilityColor,
          })
          .pipe(
            map((data) =>
              characterStatsActions.loadTopCharactersByAgilitySuccess({ data }),
            ),
            catchError(() =>
              of(characterStatsActions.loadTopCharactersByAgilityFailure()),
            ),
          ),
      ),
    ),
  );

  topCharactersByIntelligence$ = createEffect(() =>
    this.actions$.pipe(
      ofType(characterStatsActions.loadTopCharactersByIntelligence),
      switchMap(() =>
        this.characterStatsService
          .generateTopCharactersByAttribute({
            attribute: 'intelligence',
            backgroundColor: this.ccs.intelligenceColor,
          })
          .pipe(
            map((data) =>
              characterStatsActions.loadTopCharactersByIntelligenceSuccess({
                data,
              }),
            ),
            catchError(() =>
              of(
                characterStatsActions.loadTopCharactersByIntelligenceFailure(),
              ),
            ),
          ),
      ),
    ),
  );

  topCharactersByArmor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(characterStatsActions.loadTopCharactersByArmor),
      switchMap(() =>
        this.characterStatsService
          .generateTopCharactersByAttribute({
            attribute: 'armor',
            backgroundColor: this.ccs.armorColor,
          })
          .pipe(
            map((data) =>
              characterStatsActions.loadTopCharactersByArmorSuccess({ data }),
            ),
            catchError(() =>
              of(characterStatsActions.loadTopCharactersByArmorFailure()),
            ),
          ),
      ),
    ),
  );

  topCharactersByCritChance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(characterStatsActions.loadTopCharactersByCritChance),
      switchMap(() =>
        this.characterStatsService
          .generateTopCharactersByAttribute({
            attribute: 'critChance',
            backgroundColor: this.ccs.critChanceColor,
          })
          .pipe(
            map((data) =>
              characterStatsActions.loadTopCharactersByCritChanceSuccess({
                data,
              }),
            ),
            catchError(() =>
              of(characterStatsActions.loadTopCharactersByCritChanceFailure()),
            ),
          ),
      ),
    ),
  );

  topWellRoundedCharacters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(characterStatsActions.loadTopWellRoundedCharacters),
      switchMap(() =>
        this.characterStatsApiService.getTopWellRoundedCharacters().pipe(
          map((data) => {
            if (data.length === 0) {
              return null;
            }
            return data;
          }),
          map((data) =>
            characterStatsActions.loadTopWellRoundedCharactersSuccess({ data }),
          ),
          catchError(() =>
            of(characterStatsActions.loadTopWellRoundedCharactersFailure()),
          ),
        ),
      ),
    ),
  );

  radarChartCharacter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(characterStatsActions.selectTopWellRoundedCharacter),
      map((character) =>
        characterStatsActions.loadRadarChartDataSet(character),
      ),
    ),
  );

  radarChartDataset$ = createEffect(() =>
    combineLatest([
      this.actions$.pipe(ofType(characterStatsActions.loadRadarChartDataSet)),
      this.characterStatsApiService.getAverageCharacterStats(),
    ]).pipe(
      map(([action, averageCharacterStats]) => {
        const selectedCharacter = action.character;
        const labels = [
          'Health',
          'Strength',
          'Agility',
          'Intelligence',
          'Armor',
          'Crit Chance',
        ];

        const dataset = [
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
      }),
      map((data) =>
        characterStatsActions.loadRadarChartDataSetSuccess({ data }),
      ),
      catchError(() =>
        of(characterStatsActions.loadRadarChartDataSetFailure()),
      ),
    ),
  );

  characterDistributionByType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(characterStatsActions.loadCharacterDistributionByType),
      switchMap(() =>
        this.characterStatsApiService.getCharacterDistributionByType().pipe(
          map((data) => {
            if (data.length === 0) {
              return null;
            }
            const ids = data.map((item) => item._id);
            const counts = data.map((item) => item.count);
            const dataset: ChartConfiguration<'polarArea'>['data']['datasets'] =
              [{ data: counts || [] }];
            return { ids, dataset };
          }),
          map((data) =>
            characterStatsActions.loadCharacterDistributionByTypeSuccess({
              data,
            }),
          ),
          catchError(() =>
            of(characterStatsActions.loadCharacterDistributionByTypeFailure()),
          ),
        ),
      ),
    ),
  );
}
