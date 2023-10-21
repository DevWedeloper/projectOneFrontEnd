import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  TemplateRef,
  ViewChildren,
  inject,
} from '@angular/core';
import { Character } from '../../../interfaces/character.interface';
import { Guild } from '../../../interfaces/guild.interface';
import { TableSkeletonComponent } from '../skeleton/table-skeleton/table-skeleton.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, TableSkeletonComponent],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T extends Character | Guild> {
  destroyRef = inject(DestroyRef);
  @Input({ required: true }) loading!: boolean | null;
  @Input() data: T[] | undefined = [];
  @Output() tableLoaded = new EventEmitter<boolean>();
  @ContentChild('searchTemplate') search: TemplateRef<HTMLElement> | undefined;
  @ContentChild('pageSizeTemplate') pageSize:
    | TemplateRef<HTMLElement>
    | undefined;
  @ContentChild('headersTemplate') headers:
    | TemplateRef<HTMLElement>
    | undefined;
  @ContentChild('rowsTemplate') rows: TemplateRef<HTMLElement> | undefined;
  @ContentChild('paginationTemplate') pagination:
    | TemplateRef<HTMLElement>
    | undefined;
  @ViewChildren('tableData') tableData!: QueryList<HTMLElement>;

  trackBy(index: number): number {
    return index;
  }
}
