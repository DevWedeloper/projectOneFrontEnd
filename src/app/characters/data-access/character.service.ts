import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  Subject,
  catchError,
  combineLatest,
  distinctUntilChanged,
  shareReplay,
  startWith,
  switchMap,
  take,
} from 'rxjs';
import { CharacterApiService } from 'src/app/shared/data-access/character-api.service';
import { QueryParams } from 'src/app/shared/interfaces/query-params.interface';
import { CharacterPagination } from '../interfaces/character-pagination.interface';
import { CharacterLoadingService } from './character-loading.service';
import { CharacterSortParams } from 'src/app/characters/interfaces/character-sort-params.interface';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  characterApiService = inject(CharacterApiService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  ls = inject(CharacterLoadingService);
  currentPage$ = new BehaviorSubject<number>(1);
  pageSize$ = new BehaviorSubject<number>(10);
  sortParams$ = new BehaviorSubject<CharacterSortParams>({
    sortBy: 'name',
    sortOrder: 'asc',
  });
  searchQuery$ = new BehaviorSubject<string>('');
  refetchPage$ = new Subject<void>();

  private readonly filters$ = combineLatest({
    page: this.currentPage$,
    pageSize: this.pageSize$,
    sortParams: this.sortParams$,
    searchQuery: this.searchQuery$,
  });

  readonly characterData$ = this.refetchPage$.pipe(
    startWith(void 0),
    switchMap(() => this.filters$),
    switchMap(
      ({ page, pageSize, sortParams: { sortBy, sortOrder }, searchQuery }) =>
        this.characterApiService
          .getCharacters(page, pageSize, sortBy, sortOrder, searchQuery)
          .pipe(catchError(() => EMPTY))
    ),
    shareReplay(1)
  );

  constructor() {
    const observables: Observable<CharacterPagination | void>[] = [
      this.characterData$.pipe(take(1)),
    ];
    this.ls.waitForObservables(observables);

    combineLatest([this.currentPage$, this.pageSize$, this.sortParams$])
      .pipe(
        distinctUntilChanged(),
        switchMap(([currentPage, pageSize, sortParams]) => {
          const { sortBy, sortOrder } = sortParams;
          const queryParams: QueryParams = {
            page: currentPage,
            pageSize: pageSize,
            sortBy: sortBy,
            sortOrder: sortOrder,
          };
          return this.router.navigate([], {
            relativeTo: this.route,
            queryParams: queryParams,
            queryParamsHandling: 'merge',
            replaceUrl: true,
          });
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }
}
