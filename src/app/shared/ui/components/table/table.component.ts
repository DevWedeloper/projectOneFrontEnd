import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  contentChild,
  input,
} from '@angular/core';
import { TableSkeletonComponent } from '../skeleton/table-skeleton/table-skeleton.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, TableSkeletonComponent],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T extends object> {
  loading = input.required<boolean | null>();
  data = input.required<T[] | undefined>();
  protected search =
    contentChild.required<TemplateRef<HTMLElement>>('searchTemplate');
  protected pageSize =
    contentChild.required<TemplateRef<HTMLElement>>('pageSizeTemplate');
  protected headers =
    contentChild.required<TemplateRef<HTMLElement>>('headersTemplate');
  protected rows = contentChild.required<TemplateRef<object>>('rowsTemplate');
  protected pagination =
    contentChild.required<TemplateRef<HTMLElement>>('paginationTemplate');
}
