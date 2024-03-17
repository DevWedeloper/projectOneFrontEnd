import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Renderer2,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { skip, switchMap, take, tap } from 'rxjs';
import { Guild } from '../../../shared/interfaces/guild.interface';
import { PaginationComponent } from '../../../shared/ui/components/pagination/pagination.component';
import { SpinnerComponent } from '../../../shared/ui/components/spinner/spinner.component';
import { TableComponent } from '../../../shared/ui/components/table/table.component';
import { TruncatePipe } from '../../../shared/ui/pipes/truncate.pipe';
import { setSelectOption } from '../../../shared/utils/set-select-option.utils';
import { GuildPagination } from '../../interfaces/guild-pagination.interface';
import { GuildSortParams } from '../../interfaces/guild-sort-params.interface';
import {
  selectIsDeleting,
  selectSelectedGuild,
} from '../../state/guild-actions.reducers';
import {
  selectInitialLoading,
  selectPageSize,
  selectSortParams,
} from '../../state/guild-table.reducers';
import { GuildEditComponent } from '../guild-edit/guild-edit.component';

@Component({
  selector: 'app-guild-table',
  templateUrl: './guild-table.component.html',
  styleUrls: ['./guild-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GuildEditComponent,
    TruncatePipe,
    PaginationComponent,
    TableComponent,
    SpinnerComponent,
  ],
})
export class GuildTableComponent implements AfterViewInit {
  private renderer = inject(Renderer2);
  private destroyRef = inject(DestroyRef);
  private store = inject(Store);
  guildData = input.required<GuildPagination | null>();
  isCurrentUserAdmin = input.required<boolean | null>();
  currentPage = input.required<number>();
  pageSize = input.required<number>();
  searchQueryChange = output<string>();
  pageSizeChange = output<number>();
  sortParamsChange = output<GuildSortParams>();
  changePage = output<number>();
  editGuild = output<Guild>();
  deleteGuild = output<Guild>();
  private pageSizeElement = viewChild<ElementRef>('perPage');
  protected loading$ = this.store.select(selectInitialLoading);
  protected deleteLoading$ = this.store.select(selectIsDeleting);
  protected selectedGuild$ = this.store.select(selectSelectedGuild);
  private pageSize$ = this.store.select(selectPageSize);
  private sortParams$ = this.store.select(selectSortParams);

  ngAfterViewInit(): void {
    this.pageSize$
      .pipe(
        skip(1),
        take(1),
        switchMap((pageSizeValue) =>
          this.loading$.pipe(
            tap((loadingValue) => {
              if (loadingValue === false) {
                setSelectOption(
                  this.renderer,
                  this.pageSizeElement()?.nativeElement,
                  pageSizeValue.toString(),
                );
              }
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  protected toggleSort(header: GuildSortParams['sortBy']): void {
    this.sortParams$.pipe(take(1)).subscribe((sortParams) => {
      if (sortParams.sortBy === header) {
        this.sortParamsChange.emit({
          sortBy: header,
          sortOrder: sortParams.sortOrder === 'asc' ? 'desc' : 'asc',
        });
      } else {
        this.sortParamsChange.emit({ sortBy: header, sortOrder: 'asc' });
      }
    });
  }

  protected getSortArrow(header: string): string {
    let sortArrow = '';
    this.sortParams$.pipe(take(1)).subscribe((sortParams) => {
      if (sortParams.sortBy === header) {
        if (sortParams.sortOrder === 'asc') {
          sortArrow = '\u25B2';
        } else if (sortParams.sortOrder === 'desc') {
          sortArrow = '\u25BC';
        }
      }
    });
    return sortArrow;
  }
}
