import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  input,
  output,
  viewChild,
} from '@angular/core';
import { FocusVisibleDirective } from '../../directives/focus-visible.directive';

type PageItem = number | { symbol: string; index: number };

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, FocusVisibleDirective],
})
export class PaginationComponent {
  currentPage = input.required<number>();
  pageSize = input.required<number>();
  total = input.required<number>();
  showGoToPage = input(false, {
    transform: booleanAttribute,
  });
  changePage = output<number>();
  private searchInput =
    viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

  private totalPages = computed(() => {
    return Math.ceil(this.total() / this.pageSize());
  });

  // TODO: Add documentation how this works
  protected pages = computed<PageItem[]>(() => {
    const page = this.currentPage();
    const totalPages = this.totalPages();
    const pagesArray: PageItem[] = [];
    let beforePage = page - 1;
    let afterPage = page + 1;
    const symbol = '...';

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page > 2) {
      pagesArray.push(1);
      if (page > 3) {
        pagesArray.push({
          symbol,
          index: page - 3,
        });
      }
    }

    if (page === totalPages) {
      beforePage = beforePage - 2;
    } else if (page === totalPages - 1) {
      beforePage = beforePage - 1;
    }

    if (page === 1) {
      afterPage = afterPage + 2;
    } else if (page === 2) {
      afterPage = afterPage + 1;
    }

    for (let plength = beforePage; plength <= afterPage; plength++) {
      if (plength > totalPages) {
        continue;
      }

      if (plength === 0) {
        plength = plength + 1;
      }

      pagesArray.push(plength);
    }

    if (page < totalPages - 1) {
      if (page < totalPages - 2) {
        pagesArray.push({
          symbol,
          index: page + 3,
        });
      }
      pagesArray.push(totalPages);
    }

    return pagesArray;
  });

  protected handlePageClick(item: PageItem): void {
    if (typeof item === 'number') {
      this.changePage.emit(item);
    } else {
      this.changePage.emit(item.index);
    }
  }

  protected isPageActive(item: PageItem): boolean {
    if (typeof item === 'number') {
      return this.currentPage() === item;
    } else {
      return false;
    }
  }

  protected displayItem(item: PageItem): string {
    if (typeof item === 'number') {
      return item.toString();
    } else {
      return item.symbol;
    }
  }

  protected emitGoToPage(value: string): void {
    if (value === '') {
      return;
    }
    const index = parseInt(value, 10);
    switch (true) {
      case index <= 0:
        this.changePage.emit(1);
        break;
      case index > this.totalPages():
        this.changePage.emit(this.totalPages());
        break;
      default:
        this.changePage.emit(index);
        break;
    }
    this.searchInput().nativeElement.value = '';
  }
}
