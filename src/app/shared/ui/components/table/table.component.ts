import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  TemplateRef,
  input
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
  loading = input.required<boolean | null>();
  data = input.required<T[] | undefined>();
  @ContentChild('searchTemplate') search: TemplateRef<HTMLElement> | undefined;
  @ContentChild('pageSizeTemplate') protected pageSize:
    | TemplateRef<HTMLElement>
    | undefined;
  @ContentChild('headersTemplate') protected headers:
    | TemplateRef<HTMLElement>
    | undefined;
  @ContentChild('rowsTemplate') protected rows:
    | TemplateRef<HTMLElement>
    | undefined;
  @ContentChild('paginationTemplate') protected pagination:
    | TemplateRef<HTMLElement>
    | undefined;
}
