import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  catchError,
  distinctUntilChanged,
  forkJoin,
  map,
  of,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs';
import { GuildApiService } from 'src/app/shared/data-access/guild-api.service';
import { QueryParams } from 'src/app/shared/interfaces/query-params.interface';
import { guildTableActions } from './guild-table.actions';
import {
  selectCurrentPage,
  selectName,
  selectPageSize,
  selectSearchQuery,
  selectSortParams,
} from './guild-table.reducers';

@Injectable()
export class GuildTableEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private guildApiService = inject(GuildApiService);

  loadGuilds$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        guildTableActions.loadGuilds,
        guildTableActions.setCurrentPage,
        guildTableActions.setPageSize,
        guildTableActions.setSortParams,
        guildTableActions.setSearchQuery,
        guildTableActions.setAllParameters,
        guildTableActions.setPageNumberAndSearchQuery,
      ),
      withLatestFrom(
        this.store.select(selectCurrentPage),
        this.store.select(selectPageSize),
        this.store.select(selectSortParams),
        this.store.select(selectSearchQuery),
      ),
      switchMap(([, page, pageSize, { sortBy, sortOrder }, searchQuery]) =>
        this.guildApiService
          .getGuilds(page, pageSize, sortBy, sortOrder, searchQuery)
          .pipe(
            map((guildData) =>
              guildTableActions.loadGuildsSuccess({ guildData }),
            ),
            catchError(() => of(guildTableActions.loadGuildsFailure())),
          ),
      ),
    ),
  );

  redirectUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        guildTableActions.setCurrentPage,
        guildTableActions.setPageSize,
        guildTableActions.setSortParams,
        guildTableActions.setNameFilter,
        guildTableActions.setAllParameters,
        guildTableActions.setPageNumberAndSearchQuery,
      ),
      withLatestFrom(
        this.store.select(selectCurrentPage),
        this.store.select(selectPageSize),
        this.store.select(selectSortParams),
        this.store.select(selectName),
      ),
      distinctUntilChanged(),
      map(([, currentPage, pageSize, sortParams, name]) => {
        const { sortBy, sortOrder } = sortParams;
        const queryParams: QueryParams = {
          page: currentPage,
          pageSize: pageSize,
          sortBy: sortBy,
          sortOrder: sortOrder,
          name: name,
        };
        return guildTableActions.redirectUserSuccess({ queryParams });
      }),
      catchError(() => of(guildTableActions.redirectUserFailure())),
    ),
  );

  redirectUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(guildTableActions.redirectUserSuccess),
        tap((action) =>
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: action.queryParams,
            queryParamsHandling: 'merge',
            replaceUrl: true,
          }),
        ),
      ),
    { dispatch: false },
  );

  waitForObservables$ = createEffect(() =>
    forkJoin([
      this.actions$.pipe(
        ofType(
          guildTableActions.loadGuildsSuccess,
          guildTableActions.loadGuildsFailure,
        ),
        take(1),
      ),
    ]).pipe(
      map(() => guildTableActions.allObservablesLoaded()),
      catchError(() => of(guildTableActions.allObservablesLoaded())),
    ),
  );
}
