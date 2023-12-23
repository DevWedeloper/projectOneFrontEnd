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
  take
} from 'rxjs';
import { GuildApiService } from 'src/app/shared/data-access/guild-api.service';
import { QueryParams } from 'src/app/shared/interfaces/query-params.interface';
import { GuildPagination } from '../interfaces/guild-pagination.interface';
import { GuildSortParams } from '../interfaces/guild-sort-params.interface';
import { GuildLoadingService } from './guild-loading.service';

@Injectable({
  providedIn: 'root',
})
export class GuildService {
  private guildApiService = inject(GuildApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private ls = inject(GuildLoadingService);
  currentPage$ = new BehaviorSubject<number>(1);
  pageSize$ = new BehaviorSubject<number>(10);
  sortParams$ = new BehaviorSubject<GuildSortParams>({
    sortBy: 'name',
    sortOrder: 'asc',
  });
  name$ = new BehaviorSubject<string | undefined>(undefined);
  searchQuery$ = new BehaviorSubject<string>('');
  refetchPage$ = new Subject<void>();

  private readonly filters$ = combineLatest({
    page: this.currentPage$,
    pageSize: this.pageSize$,
    sortParams: this.sortParams$,
    searchQuery: this.searchQuery$,
  });

  readonly guildData$ = this.refetchPage$.pipe(
    startWith(void 0),
    switchMap(() => this.filters$),
    switchMap(
      ({ page, pageSize, sortParams: { sortBy, sortOrder }, searchQuery }) =>
        this.guildApiService
          .getGuilds(page, pageSize, sortBy, sortOrder, searchQuery)
          .pipe(catchError(() => EMPTY))
    ),
    shareReplay(1)
  );

  constructor() {
    const observables: Observable<GuildPagination>[] = [
      this.guildData$.pipe(take(1)),
    ];
    this.ls.waitForObservables(observables);

    combineLatest([this.currentPage$, this.pageSize$, this.sortParams$, this.name$])
      .pipe(
        distinctUntilChanged(),
        switchMap(([currentPage, pageSize, sortParams, name]) => {
          const { sortBy, sortOrder } = sortParams;
          const queryParams: QueryParams = {
            page: currentPage,
            pageSize: pageSize,
            sortBy: sortBy,
            sortOrder: sortOrder,
            name: name
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
