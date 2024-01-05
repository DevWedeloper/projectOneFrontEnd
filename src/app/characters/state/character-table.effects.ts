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
import { CharacterApiService } from 'src/app/shared/data-access/character-api.service';
import { QueryParams } from 'src/app/shared/interfaces/query-params.interface';
import { characterTableActions } from './character-table.actions';
import {
  selectCurrentPage,
  selectName,
  selectPageSize,
  selectSearchQuery,
  selectSortParams,
} from './character-table.reducers';

@Injectable()
export class CharacterTableEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private characterApiService = inject(CharacterApiService);

  loadCharacters$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        characterTableActions.loadCharacters,
        characterTableActions.setCurrentPage,
        characterTableActions.setPageSize,
        characterTableActions.setSortParams,
        characterTableActions.setSearchQuery,
        characterTableActions.setAllParameters,
        characterTableActions.setPageNumberAndSearchQuery,
      ),
      withLatestFrom(
        this.store.select(selectCurrentPage),
        this.store.select(selectPageSize),
        this.store.select(selectSortParams),
        this.store.select(selectSearchQuery),
      ),
      switchMap(([, page, pageSize, { sortBy, sortOrder }, searchQuery]) =>
        this.characterApiService
          .getCharacters(page, pageSize, sortBy, sortOrder, searchQuery)
          .pipe(
            map((characterData) =>
              characterTableActions.loadCharactersSuccess({ characterData }),
            ),
            catchError(() => of(characterTableActions.loadCharactersFailure())),
          ),
      ),
    );
  });

  redirectUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        characterTableActions.setCurrentPage,
        characterTableActions.setPageSize,
        characterTableActions.setSortParams,
        characterTableActions.setNameFilter,
        characterTableActions.setAllParameters,
        characterTableActions.setPageNumberAndSearchQuery,
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
        return characterTableActions.redirectUserSuccess({ queryParams });
      }),
      catchError(() => of(characterTableActions.redirectUserFailure())),
    );
  });

  redirectUserSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(characterTableActions.redirectUserSuccess),
        tap((action) =>
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: action.queryParams,
            queryParamsHandling: 'merge',
            replaceUrl: true,
          }),
        ),
      );
    },
    { dispatch: false },
  );

  waitForObservables$ = createEffect(() => {
    return forkJoin([
      this.actions$.pipe(
        ofType(
          characterTableActions.loadCharactersSuccess,
          characterTableActions.loadCharactersFailure,
        ),
        take(1),
      ),
    ]).pipe(
      map(() => characterTableActions.allObservablesLoaded()),
      catchError(() => of(characterTableActions.allObservablesLoaded())),
    );
  });
}
