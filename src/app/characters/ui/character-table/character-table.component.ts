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
import { take } from 'rxjs';
import { Character } from 'src/app/shared/interfaces/character.interface';
import { CharacterSortParams } from 'src/app/characters/interfaces/character-sort-params.interface';
import { PaginationComponent } from 'src/app/shared/ui/components/pagination/pagination.component';
import { SpinnerComponent } from 'src/app/shared/ui/components/spinner/spinner.component';
import { TableComponent } from 'src/app/shared/ui/components/table/table.component';
import { TruncatePipe } from 'src/app/shared/ui/pipes/truncate.pipe';
import { setSelectOption } from 'src/app/shared/utils/set-select-option.utils';
import { CharacterActionsService } from '../../data-access/character-actions-service';
import { CharacterLoadingService } from '../../data-access/character-loading.service';
import { CharacterService } from '../../data-access/character.service';
import { CharacterPagination } from '../../interfaces/character-pagination.interface';

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
  private cs = inject(CharacterService);
  protected ls = inject(CharacterLoadingService);
  protected cas = inject(CharacterActionsService);
  @Input({ required: true }) characterData!: CharacterPagination | null;
  @Input({ required: true }) isCurrentUserAdmin!: boolean | null;
  @Input({ required: true }) currentPage!: number | null;
  @Input({ required: true }) pageSize!: number | null;
  @Output() searchQueryChange = new EventEmitter<string>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() sortParamsChange = new EventEmitter<CharacterSortParams>();
  @Output() changePage = new EventEmitter<number>();
  @Output() editCharacter = new EventEmitter<Character>();
  @Output() deleteCharacter = new EventEmitter<Character>();
  @ViewChild('perPage', { static: false }) private pageSizeElement?: ElementRef;

  ngAfterViewInit(): void {
    this.cs.pageSize$
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe((pageSizeValue) => {
        if (this.ls.loading$.value === false) {
          setSelectOption(
            this.renderer,
            this.pageSizeElement?.nativeElement,
            pageSizeValue.toString()
          );
        }
      });
  }

  protected toggleSort(header: CharacterSortParams['sortBy']): void {
    if (this.cs.sortParams$.value.sortBy === header) {
      this.sortParamsChange.emit({
        sortBy: header,
        sortOrder:
          this.cs.sortParams$.value.sortOrder === 'asc' ? 'desc' : 'asc',
      });
    } else {
      this.sortParamsChange.emit({ sortBy: header, sortOrder: 'asc' });
    }
  }

  protected getSortArrow(header: string): string {
    if (this.cs.sortParams$.value.sortBy === header) {
      if (this.cs.sortParams$.value.sortOrder === 'asc') {
        return '&#x25B2;';
      } else if (this.cs.sortParams$.value.sortOrder === 'desc') {
        return '&#x25BC;';
      }
    }
    return '';
  }
}
