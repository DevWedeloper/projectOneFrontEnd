import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Output,
  Renderer2,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { skip, switchMap, take, tap } from 'rxjs';
import { CharacterSortParams } from 'src/app/characters/interfaces/character-sort-params.interface';
import { Character } from 'src/app/shared/interfaces/character.interface';
import { PaginationComponent } from 'src/app/shared/ui/components/pagination/pagination.component';
import { SpinnerComponent } from 'src/app/shared/ui/components/spinner/spinner.component';
import { TableComponent } from 'src/app/shared/ui/components/table/table.component';
import { TruncatePipe } from 'src/app/shared/ui/pipes/truncate.pipe';
import { setSelectOption } from 'src/app/shared/utils/set-select-option.utils';
import { CharacterPagination } from '../../interfaces/character-pagination.interface';
import {
  selectIsDeleting,
  selectSelectedCharacter,
} from '../../state/character-actions.reducers';
import {
  selectInitialLoading,
  selectPageSize,
  selectSortParams,
} from '../../state/character-table.reducers';

@Component({
  selector: 'app-character-table',
  templateUrl: './character-table.component.html',
  styleUrls: ['./character-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PaginationComponent,
    TruncatePipe,
    TableComponent,
    SpinnerComponent,
  ],
})
export class CharacterTableComponent implements AfterViewInit {
  private renderer = inject(Renderer2);
  private destroyRef = inject(DestroyRef);
  private store = inject(Store);
  characterData = input.required<CharacterPagination | null>();
  isCurrentUserAdmin = input.required<boolean | null>();
  currentPage = input.required<number | null>();
  pageSize = input.required<number | null>();
  @Output() searchQueryChange = new EventEmitter<string>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() sortParamsChange = new EventEmitter<CharacterSortParams>();
  @Output() changePage = new EventEmitter<number>();
  @Output() editCharacter = new EventEmitter<Character>();
  @Output() deleteCharacter = new EventEmitter<Character>();
  private pageSizeElement = viewChild<ElementRef>('perPage');
  protected loading$ = this.store.select(selectInitialLoading);
  protected deleteLoading$ = this.store.select(selectIsDeleting);
  protected selectedCharacter$ = this.store.select(selectSelectedCharacter);
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

  protected toggleSort(header: CharacterSortParams['sortBy']): void {
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
