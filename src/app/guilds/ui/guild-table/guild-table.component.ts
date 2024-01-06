import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { skip, switchMap, take, tap } from 'rxjs';
import { Guild } from 'src/app/shared/interfaces/guild.interface';
import { PaginationComponent } from 'src/app/shared/ui/components/pagination/pagination.component';
import { SpinnerComponent } from 'src/app/shared/ui/components/spinner/spinner.component';
import { TableComponent } from 'src/app/shared/ui/components/table/table.component';
import { TruncatePipe } from 'src/app/shared/ui/pipes/truncate.pipe';
import { setSelectOption } from 'src/app/shared/utils/set-select-option.utils';
import { GuildPagination } from '../../interfaces/guild-pagination.interface';
import { GuildSortParams } from '../../interfaces/guild-sort-params.interface';
import { selectIsDeleting, selectSelectedGuild } from '../../state/guild-actions.reducers';
import { selectInitialLoading, selectPageSize, selectSortParams } from '../../state/guild-table.reducers';
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
  @Input() guildData!: GuildPagination | null;
  @Input() isCurrentUserAdmin!: boolean | null;
  @Input() currentPage!: number | null;
  @Input() pageSize!: number | null;
  @Output() searchQueryChange = new EventEmitter<string>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() sortParamsChange = new EventEmitter<GuildSortParams>();
  @Output() changePage = new EventEmitter<number>();
  @Output() editGuild = new EventEmitter<Guild>();
  @Output() deleteGuild = new EventEmitter<Guild>();
  @ViewChild('perPage', { static: false }) private pageSizeElement?: ElementRef;
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
                  this.pageSizeElement?.nativeElement,
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
          sortArrow = '&#x25B2;';
        } else if (sortParams.sortOrder === 'desc') {
          sortArrow = '&#x25BC;';
        }
      }
    });
    return sortArrow;
  }
}
