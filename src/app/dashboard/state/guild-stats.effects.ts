import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { ChartColorService } from '../data-access/chart-color.service';
import { GuildStatsApiService } from '../data-access/guild-stats-api.service';
import { GuildStatsService } from '../data-access/guild-stats.service';
import { guildStatsActions } from './guild-stats.actions';

@Injectable()
export class GuildStatsEffects {
  private actions$ = inject(Actions);
  private guildStatsApiService = inject(GuildStatsApiService);
  private guildStatsService = inject(GuildStatsService);
  private ccs = inject(ChartColorService);

  topGuildsByHealth$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(guildStatsActions.loadTopGuildsByHealth),
      switchMap(() => {
        return this.guildStatsService
          .generateTopGuildsByAttribute({
            attribute: 'health',
            backgroundColor: this.ccs.healthColor,
          })
          .pipe(
            map((data) =>
              guildStatsActions.loadTopGuildsByHealthSuccess({ data }),
            ),
            catchError(() =>
              of(guildStatsActions.loadTopGuildsByHealthFailure()),
            ),
          );
      }),
    );
  });

  topGuildsByStrength$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(guildStatsActions.loadTopGuildsByStrength),
      switchMap(() => {
        return this.guildStatsService
          .generateTopGuildsByAttribute({
            attribute: 'strength',
            backgroundColor: this.ccs.strengthColor,
          })
          .pipe(
            map((data) =>
              guildStatsActions.loadTopGuildsByStrengthSuccess({ data }),
            ),
            catchError(() =>
              of(guildStatsActions.loadTopGuildsByStrengthFailure()),
            ),
          );
      }),
    );
  });

  topGuildsByAgility$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(guildStatsActions.loadTopGuildsByAgility),
      switchMap(() => {
        return this.guildStatsService
          .generateTopGuildsByAttribute({
            attribute: 'agility',
            backgroundColor: this.ccs.agilityColor,
          })
          .pipe(
            map((data) =>
              guildStatsActions.loadTopGuildsByAgilitySuccess({ data }),
            ),
            catchError(() =>
              of(guildStatsActions.loadTopGuildsByAgilityFailure()),
            ),
          );
      }),
    );
  });

  topGuildsByIntelligence$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(guildStatsActions.loadTopGuildsByIntelligence),
      switchMap(() => {
        return this.guildStatsService
          .generateTopGuildsByAttribute({
            attribute: 'intelligence',
            backgroundColor: this.ccs.intelligenceColor,
          })
          .pipe(
            map((data) =>
              guildStatsActions.loadTopGuildsByIntelligenceSuccess({ data }),
            ),
            catchError(() =>
              of(guildStatsActions.loadTopGuildsByIntelligenceFailure()),
            ),
          );
      }),
    );
  });

  topGuildsByArmor$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(guildStatsActions.loadTopGuildsByArmor),
      switchMap(() => {
        return this.guildStatsService
          .generateTopGuildsByAttribute({
            attribute: 'armor',
            backgroundColor: this.ccs.armorColor,
          })
          .pipe(
            map((data) =>
              guildStatsActions.loadTopGuildsByArmorSuccess({ data }),
            ),
            catchError(() =>
              of(guildStatsActions.loadTopGuildsByArmorFailure()),
            ),
          );
      }),
    );
  });

  topGuildsByCritChance$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(guildStatsActions.loadTopGuildsByCritChance),
      switchMap(() => {
        return this.guildStatsService
          .generateTopGuildsByAttribute({
            attribute: 'critChance',
            backgroundColor: this.ccs.critChanceColor,
          })
          .pipe(
            map((data) =>
              guildStatsActions.loadTopGuildsByCritChanceSuccess({ data }),
            ),
            catchError(() =>
              of(guildStatsActions.loadTopGuildsByCritChanceFailure()),
            ),
          );
      }),
    );
  });

  topGuildsByAverageHealth$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(guildStatsActions.loadTopGuildsByAverageHealth),
      switchMap(() => {
        return this.guildStatsService
          .generateTopGuildsByAverageAttribute({
            attribute: 'health',
            label: 'Health',
            backgroundColor: this.ccs.healthColor,
          })
          .pipe(
            map((data) =>
              guildStatsActions.loadTopGuildsByAverageHealthSuccess({ data }),
            ),
            catchError(() =>
              of(guildStatsActions.loadTopGuildsByAverageHealthFailure()),
            ),
          );
      }),
    );
  });

  topGuildsByAverageStrength$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(guildStatsActions.loadTopGuildsByAverageStrength),
      switchMap(() => {
        return this.guildStatsService
          .generateTopGuildsByAverageAttribute({
            attribute: 'strength',
            label: 'Strength',
            backgroundColor: this.ccs.strengthColor,
          })
          .pipe(
            map((data) =>
              guildStatsActions.loadTopGuildsByAverageStrengthSuccess({ data }),
            ),
            catchError(() =>
              of(guildStatsActions.loadTopGuildsByAverageStrengthFailure()),
            ),
          );
      }),
    );
  });

  topGuildsByAverageAgility$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(guildStatsActions.loadTopGuildsByAverageAgility),
      switchMap(() => {
        return this.guildStatsService
          .generateTopGuildsByAverageAttribute({
            attribute: 'agility',
            label: 'Agility',
            backgroundColor: this.ccs.agilityColor,
          })
          .pipe(
            map((data) =>
              guildStatsActions.loadTopGuildsByAverageAgilitySuccess({ data }),
            ),
            catchError(() =>
              of(guildStatsActions.loadTopGuildsByAverageAgilityFailure()),
            ),
          );
      }),
    );
  });

  topGuildsByAverageIntelligence$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(guildStatsActions.loadTopGuildsByAverageIntelligence),
      switchMap(() => {
        return this.guildStatsService
          .generateTopGuildsByAverageAttribute({
            attribute: 'intelligence',
            label: 'Intelligence',
            backgroundColor: this.ccs.intelligenceColor,
          })
          .pipe(
            map((data) =>
              guildStatsActions.loadTopGuildsByAverageIntelligenceSuccess({
                data,
              }),
            ),
            catchError(() =>
              of(guildStatsActions.loadTopGuildsByAverageIntelligenceFailure()),
            ),
          );
      }),
    );
  });

  topGuildsByAverageArmor$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(guildStatsActions.loadTopGuildsByAverageArmor),
      switchMap(() => {
        return this.guildStatsService
          .generateTopGuildsByAverageAttribute({
            attribute: 'armor',
            label: 'Armor',
            backgroundColor: this.ccs.armorColor,
          })
          .pipe(
            map((data) =>
              guildStatsActions.loadTopGuildsByAverageArmorSuccess({ data }),
            ),
            catchError(() =>
              of(guildStatsActions.loadTopGuildsByAverageArmorFailure()),
            ),
          );
      }),
    );
  });

  topGuildsByAverageCritChance$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(guildStatsActions.loadTopGuildsByAverageCritChance),
      switchMap(() => {
        return this.guildStatsService
          .generateTopGuildsByAverageAttribute({
            attribute: 'critChance',
            label: 'CritChance',
            backgroundColor: this.ccs.critChanceColor,
          })
          .pipe(
            map((data) =>
              guildStatsActions.loadTopGuildsByAverageCritChanceSuccess({
                data,
              }),
            ),
            catchError(() =>
              of(guildStatsActions.loadTopGuildsByAverageCritChanceFailure()),
            ),
          );
      }),
    );
  });

  topWellRoundedGuilds$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(guildStatsActions.loadTopWellRoundedGuilds),
      switchMap(() => {
        return this.guildStatsApiService.getTopWellRoundedGuilds().pipe(
          map((guilds) => {
            if (guilds.length === 0) {
              return null;
            }
            const names = guilds.map((guild) => guild.name);
            const combinedAttributes = guilds.map(
              (guild) => guild.membersAverage,
            );
            const dataset = [
              {
                data: combinedAttributes || [],
                backgroundColor: 'red',
              },
            ];
            return { names, dataset };
          }),
          map((data) =>
            guildStatsActions.loadTopWellRoundedGuildsSuccess({ data }),
          ),
          catchError(() =>
            of(guildStatsActions.loadTopWellRoundedGuildsFailure()),
          ),
        );
      }),
    );
  });
}
