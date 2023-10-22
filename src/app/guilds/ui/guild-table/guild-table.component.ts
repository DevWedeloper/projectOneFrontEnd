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
import { Guild } from 'src/app/shared/interfaces/guild.interface';
import { PaginationComponent } from 'src/app/shared/ui/components/pagination/pagination.component';
import { SpinnerComponent } from 'src/app/shared/ui/components/spinner/spinner.component';
import { TableComponent } from 'src/app/shared/ui/components/table/table.component';
import { TruncatePipe } from 'src/app/shared/ui/pipes/truncate.pipe';
import { setSelectOption } from 'src/app/shared/utils/set-select-option.utils';
import { GuildActionsService } from '../../data-access/guild-actions.service';
import { GuildLoadingService } from '../../data-access/guild-loading.service';
import { GuildService } from '../../data-access/guild.service';
import { GuildPagination } from '../../interfaces/guild-pagination.interface';
import { GuildSortParams } from '../../interfaces/guild-sort-params.interface';
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
  renderer = inject(Renderer2);
  destroyRef = inject(DestroyRef);
  gs = inject(GuildService);
  ls = inject(GuildLoadingService);
  gas = inject(GuildActionsService);
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
  @ViewChild('perPage', { static: false }) pageSizeElement?: ElementRef;
  @ViewChild('sortBy', { static: false }) sortByElement?: ElementRef;
  @ViewChild('sortOrder', { static: false }) sortOrderElement?: ElementRef;

  ngAfterViewInit(): void {
    this.gs.pageSize$
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

  toggleSort(header: GuildSortParams['sortBy']): void {
    if (this.gs.sortParams$.value.sortBy === header) {
      this.sortParamsChange.emit({
        sortBy: header,
        sortOrder:
          this.gs.sortParams$.value.sortOrder === 'asc' ? 'desc' : 'asc',
      });
    } else {
      this.sortParamsChange.emit({ sortBy: header, sortOrder: 'asc' });
    }
  }

  getSortArrow(header: string): string {
    if (this.gs.sortParams$.value.sortBy === header) {
      if (this.gs.sortParams$.value.sortOrder === 'asc') {
        return '&#x25B2;';
      } else if (this.gs.sortParams$.value.sortOrder === 'desc') {
        return '&#x25BC;';
      }
    }
    return '';
  }
}
