import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { Character } from '../../../interfaces/character.interface';
import { Guild } from '../../../interfaces/guild.interface';
import { TableSkeletonComponent } from '../skeleton/table-skeleton/table-skeleton.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, TableSkeletonComponent],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent<T extends Character | Guild> {
  @Input({ required: true }) loading!: boolean | null;
  @Input() data: T[] | undefined = [];
  @ContentChild('searchTemplate') search: TemplateRef<HTMLElement> | undefined;
  @ContentChild('pageSizeTemplate') pageSize: TemplateRef<HTMLElement> | undefined;
  @ContentChild('headersTemplate') headers: TemplateRef<HTMLElement> | undefined;
  @ContentChild('rowsTemplate') rows: TemplateRef<HTMLElement> | undefined;
  @ContentChild('paginationTemplate') pagination: TemplateRef<HTMLElement> | undefined;

  trackBy(index: number): number {
    return index;
  }
}