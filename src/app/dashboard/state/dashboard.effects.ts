import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, forkJoin, map, of, take } from 'rxjs';
import { characterStatsActions } from './character-stats.actions';
import { dashboardActions } from './dashboard.actions';
import { guildStatsActions } from './guild-stats.actions';

@Injectable()
export class DashboardEffects {
  private actions$ = inject(Actions);

  waitForObservables$ = createEffect(() => {
    return forkJoin([
      this.actions$.pipe(
        ofType(
          characterStatsActions.loadTopCharactersByHealthSuccess,
          characterStatsActions.loadTopCharactersByHealthFailure,
        ),
        take(1),
      ),
      this.actions$.pipe(
        ofType(
          characterStatsActions.loadTopCharactersByStrengthSuccess,
          characterStatsActions.loadTopCharactersByStrengthFailure,
        ),
        take(1),
      ),
      this.actions$.pipe(
        ofType(
          characterStatsActions.loadTopCharactersByAgilitySuccess,
          characterStatsActions.loadTopCharactersByAgilityFailure,
        ),
        take(1),
      ),
      this.actions$.pipe(
        ofType(
          characterStatsActions.loadTopCharactersByIntelligenceSuccess,
          characterStatsActions.loadTopCharactersByIntelligenceFailure,
        ),
        take(1),
      ),
      this.actions$.pipe(
        ofType(
          characterStatsActions.loadTopCharactersByArmorSuccess,
          characterStatsActions.loadTopCharactersByArmorFailure,
        ),
        take(1),
      ),
      this.actions$.pipe(
        ofType(
          characterStatsActions.loadTopCharactersByCritChanceSuccess,
          characterStatsActions.loadTopCharactersByCritChanceFailure,
        ),
        take(1),
      ),
      this.actions$.pipe(
        ofType(
          characterStatsActions.loadTopWellRoundedCharactersSuccess,
          characterStatsActions.loadTopWellRoundedCharactersFailure,
        ),
        take(1),
      ),
      this.actions$.pipe(
        ofType(
          characterStatsActions.loadRadarChartDataSetSuccess,
          characterStatsActions.loadRadarChartDataSetFailure,
        ),
        take(1),
      ),
      this.actions$.pipe(
        ofType(
          characterStatsActions.loadCharacterDistributionByTypeSuccess,
          characterStatsActions.loadCharacterDistributionByTypeFailure,
        ),
        take(1),
      ),
      this.actions$.pipe(
        ofType(
          guildStatsActions.loadTopGuildsByHealthSuccess,
          guildStatsActions.loadTopGuildsByHealthFailure,
        ),
        take(1),
      ),
      this.actions$.pipe(
        ofType(
          guildStatsActions.loadTopGuildsByStrengthSuccess,
          guildStatsActions.loadTopGuildsByStrengthFailure,
        ),
        take(1),
      ),
      this.actions$.pipe(
        ofType(
          guildStatsActions.loadTopGuildsByAgilitySuccess,
          guildStatsActions.loadTopGuildsByAgilityFailure,
        ),
        take(1),
      ),
      this.actions$.pipe(
        ofType(
          guildStatsActions.loadTopGuildsByIntelligenceSuccess,
          guildStatsActions.loadTopGuildsByIntelligenceFailure,
        ),
        take(1),
      ),
      this.actions$.pipe(
        ofType(
          guildStatsActions.loadTopGuildsByArmorSuccess,
          guildStatsActions.loadTopGuildsByArmorFailure,
        ),
        take(1),
      ),
      this.actions$.pipe(
        ofType(
          guildStatsActions.loadTopGuildsByCritChanceSuccess,
          guildStatsActions.loadTopGuildsByCritChanceFailure,
        ),
        take(1),
      ),
      this.actions$.pipe(
        ofType(
          guildStatsActions.loadTopGuildsByAverageHealthSuccess,
          guildStatsActions.loadTopGuildsByAverageHealthFailure,
        ),
        take(1),
      ),
      this.actions$.pipe(
        ofType(
          guildStatsActions.loadTopGuildsByAverageStrengthSuccess,
          guildStatsActions.loadTopGuildsByAverageStrengthFailure,
        ),
        take(1),
      ),
      this.actions$.pipe(
        ofType(
          guildStatsActions.loadTopGuildsByAverageAgilitySuccess,
          guildStatsActions.loadTopGuildsByAverageAgilityFailure,
        ),
        take(1),
      ),
      this.actions$.pipe(
        ofType(
          guildStatsActions.loadTopGuildsByAverageIntelligenceSuccess,
          guildStatsActions.loadTopGuildsByAverageIntelligenceFailure,
        ),
        take(1),
      ),
      this.actions$.pipe(
        ofType(
          guildStatsActions.loadTopGuildsByAverageArmorSuccess,
          guildStatsActions.loadTopGuildsByAverageArmorFailure,
        ),
        take(1),
      ),
      this.actions$.pipe(
        ofType(
          guildStatsActions.loadTopGuildsByAverageCritChanceSuccess,
          guildStatsActions.loadTopGuildsByAverageCritChanceFailure,
        ),
        take(1),
      ),
      this.actions$.pipe(
        ofType(
          guildStatsActions.loadTopWellRoundedGuildsSuccess,
          guildStatsActions.loadTopWellRoundedGuildsFailure,
        ),
        take(1),
      ),
    ]).pipe(
      map(() => dashboardActions.allObservablesLoaded()),
      catchError(() => of(dashboardActions.allObservablesLoaded())),
    );
  });
}