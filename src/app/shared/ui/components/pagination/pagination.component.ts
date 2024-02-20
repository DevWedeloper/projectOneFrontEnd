import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  OnChanges,
  Output,
  ViewChild,
  booleanAttribute,
  input
} from '@angular/core';
import { FocusVisibleDirective } from '../../directives/focus-visible.directive';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, FocusVisibleDirective],
})
export class PaginationComponent implements OnChanges {
  currentPage = input.required<number>();
  pageSize = input.required<number>();
  total = input.required<number>();
  showGoToPage = input(false, {
    transform: booleanAttribute,
  });
  @Output() changePage = new EventEmitter<number>();
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  protected pages: (number | '...')[] = [];
  private pagesCount = 1;
  private maxVisiblePages = 7;

  ngOnChanges(): void {
    this.updatePagesCountAndGeneratePages();
  }

  private updatePagesCountAndGeneratePages(): void {
    this.pagesCount = Math.ceil((this.total() || 1) / (this.pageSize() || 1));
    this.generatePages();
  }

  private generatePages(): void {
    if (this.showAllPage()) {
      this.pages = this.range(1, this.pagesCount);
    } else {
      if (this.currentPage()) {
        switch (true) {
          case this.currentPage() < 3:
            this.pages = [...this.range(1, 3), '...', this.pagesCount];
            break;
          case this.currentPage() === 3:
            this.pages = [...this.range(1, 4), '...', this.pagesCount];
            break;
          case this.currentPage() > this.pagesCount - 2:
            this.pages = [
              1,
              '...',
              ...this.range(this.pagesCount - 2, this.pagesCount),
            ];
            break;
          case this.currentPage() === this.pagesCount - 2:
            this.pages = [
              1,
              '...',
              ...this.range(this.pagesCount - 3, this.pagesCount),
            ];
            break;
          default:
            this.pages = [
              1,
              '...',
              this.currentPage() - 1,
              this.currentPage(),
              this.currentPage() + 1,
              '...',
              this.pagesCount,
            ];
        }
      }
    }
  }

  protected handlePageClick(item: number | '...', index: number): void {
    if (typeof item === 'number') {
      this.handlePageClickForNumbers(item);
    } else {
      this.handlePageClickForEllipsis(item, index);
    }
  }

  private handlePageClickForNumbers(item: number): void {
    if (!this.showAllPage()) {
      switch (item) {
        case 3:
          this.pages = [...this.range(1, item + 1), '...', this.pagesCount];
          break;
        case this.pagesCount - 2:
          this.pages = [
            1,
            '...',
            ...this.range(item - 1, item + 1),
            this.pagesCount,
          ];
          break;
        case 4:
        case this.pagesCount - 3:
          this.pages = [
            1,
            '...',
            ...this.range(item - 1, item + 1),
            '...',
            this.pagesCount,
          ];
          break;
        case 1:
        case 2:
          this.pages = [...this.range(1, 3), '...', this.pagesCount];
          break;
        case this.pagesCount:
        case this.pagesCount - 1:
          this.pages = [
            1,
            '...',
            ...this.range(this.pagesCount - 2, this.pagesCount),
          ];
          break;
        default:
          if (item >= 5 && item < this.pagesCount - 3) {
            this.pages = [
              1,
              '...',
              ...this.range(item - 1, item + 1),
              '...',
              this.pagesCount,
            ];
          }
      }
    }
    this.changePage.emit(item);
  }

  private handlePageClickForEllipsis(item: '...', index: number): void {
    if (!this.showAllPage() && this.currentPage()) {
      if (index === 3 || index === 4) {
        this.pages = [
          1,
          '...',
          ...this.range(this.currentPage() + 2, this.currentPage() + 4),
          '...',
          this.pagesCount,
        ];
        this.emitPageNumber(3);
      } else if (index === 1 && this.pages[5] !== item) {
        this.pages = [
          1,
          '...',
          ...this.range(this.currentPage() - 4, this.currentPage() - 2),
          '...',
          this.pagesCount,
        ];
        this.emitPageNumber(3);
      } else if (this.pages[1] && this.pages[5] === item) {
        if (index === 1 && this.currentPage() > 6) {
          this.pages = [
            1,
            '...',
            ...this.range(this.currentPage() - 4, this.currentPage() - 2),
            '...',
            this.pagesCount,
          ];
          this.emitPageNumber(3);
        } else if (index === 1 && this.currentPage() === 4) {
          this.pages = [...this.range(1, 3), '...', this.pagesCount];
          this.emitPageNumber(0);
        } else if (index === 1 && this.currentPage() === 5) {
          this.pages = [...this.range(1, 4), '...', this.pagesCount];
          this.emitPageNumber(1);
        } else if (index === 1 && this.currentPage() === 6) {
          this.pages = [...this.range(1, 4), '...', this.pagesCount];
          this.emitPageNumber(2);
        } else if (index === 5 && this.currentPage() < this.pagesCount - 5) {
          this.pages = [
            1,
            '...',
            ...this.range(this.currentPage() + 2, this.currentPage() + 4),
            '...',
            this.pagesCount,
          ];
          this.emitPageNumber(3);
        } else if (index === 5 && this.currentPage() === this.pagesCount - 5) {
          this.pages = [
            1,
            '...',
            ...this.range(this.pagesCount - 3, this.pagesCount),
          ];
          this.emitPageNumber(3);
        } else if (index === 5 && this.currentPage() === this.pagesCount - 4) {
          this.pages = [
            1,
            '...',
            ...this.range(this.pagesCount - 3, this.pagesCount),
          ];
          this.emitPageNumber(4);
        } else if (index === 5 && this.currentPage() === this.pagesCount - 3) {
          this.pages = [
            1,
            '...',
            ...this.range(this.pagesCount - 2, this.pagesCount),
          ];
          this.emitPageNumber(4);
        }
      }
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
      case index > this.pagesCount:
        this.changePage.emit(this.pagesCount);
        break;
      default:
        this.changePage.emit(index);
        break;
    }
    this.searchInput.nativeElement.value = '';
  }

  private showAllPage(): boolean {
    return this.pagesCount <= this.maxVisiblePages;
  }

  private emitPageNumber(index: number): void {
    const pageNumber = this.pages[index];
    if (typeof pageNumber === 'number') {
      this.changePage.emit(pageNumber);
    }
  }

  private range(start: number, end: number): number[] {
    return [...Array(end - start + 1)].map((_, index) => start + index);
  }
}
