import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FocusVisibleDirective } from '../../directives/focus-visible.directive';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, FocusVisibleDirective]
})
export class PaginationComponent implements OnChanges {
  @Input() currentPage: number | null = 1;
  @Input() pageSize: number | null = 10;
  @Input() total: number | undefined = 0;
  @Output() changePage = new EventEmitter<number>();

  pages: (number | '...')[] = [];
  pagesCount = 1;
  maxVisiblePages = 7;
  
  ngOnChanges(): void {
    this.updatePagesCountAndGeneratePages();
  }

  updatePagesCountAndGeneratePages(): void {
    this.pagesCount = Math.ceil((this.total || 1) / (this.pageSize || 1));
    this.generatePages();
  }

  generatePages(): void {
    if (this.showAllPage()) {
      this.pages = this.range(1, this.pagesCount);
    } else {
      if (this.currentPage) {
        switch (true) {
          case this.currentPage < 3:
            this.pages = [...this.range(1, 3), '...', this.pagesCount];
            break;
          case this.currentPage === 3:
            this.pages = [...this.range(1, 4), '...', this.pagesCount];
            break;
          case this.currentPage > this.pagesCount - 2:
            this.pages = [1, '...', ...this.range(this.pagesCount - 2, this.pagesCount)];
            break;
          case this.currentPage === this.pagesCount - 2:
            this.pages = [1, '...', ...this.range(this.pagesCount - 3, this.pagesCount)];
            break;
          default:
            this.pages = [1, '...', this.currentPage - 1, this.currentPage, this.currentPage + 1, '...', this.pagesCount];
        }
      }
    }
  }

  handlePageClick(item: number | '...', index: number): void {
    if (typeof item === 'number') {
      this.handlePageClickForNumbers(item);
    } else {
      this.handlePageClickForEllipsis(item, index);
    }
  }

  handlePageClickForNumbers(item: number): void {
    if (!this.showAllPage()) {
      switch (item) {
        case 3:
          this.pages = [...this.range(1, item + 1), '...', this.pagesCount];
          break;
        case this.pagesCount - 2:
          this.pages = [1, '...', ...this.range(item - 1, item + 1), this.pagesCount];
          break;
        case 4:
        case this.pagesCount - 3:
          this.pages = [1, '...', ...this.range(item - 1, item + 1), '...', this.pagesCount];
          break;
        case 1:
        case 2:
          this.pages = [...this.range(1, 3), '...', this.pagesCount];
          break;
        case this.pagesCount:
        case this.pagesCount - 1:
          this.pages = [1, '...', ...this.range(this.pagesCount - 2, this.pagesCount)];
          break;
        default:
          if (item >= 5 && item < this.pagesCount - 3) {
            this.pages = [1, '...', ...this.range(item - 1, item + 1), '...', this.pagesCount];
          }
      }
    }
    this.changePage.emit(item);
  }

  handlePageClickForEllipsis(item: '...', index: number): void {
    if (!this.showAllPage() && this.currentPage) {
      if (index === 3 || index === 4) {
        this.pages = [1, '...', ...this.range(this.currentPage + 2, this.currentPage + 4), '...', this.pagesCount];
        this.emitPageNumber(3);
      } else if (index === 1 && this.pages[5] !== item) {
        this.pages = [1, '...', ...this.range(this.currentPage - 4, this.currentPage - 2), '...', this.pagesCount];
        this.emitPageNumber(3);
      } else if (this.pages[1] && this.pages[5] === item) {
        if (index === 1 && this.currentPage > 6) {
          this.pages = [1, '...', ...this.range(this.currentPage - 4, this.currentPage - 2), '...', this.pagesCount];
          this.emitPageNumber(3);
        } else if (index === 1 && this.currentPage === 4) {
          this.pages = [...this.range(1, 3), '...', this.pagesCount];
          this.emitPageNumber(0);
        } else if (index === 1 && this.currentPage === 5) {
          this.pages = [...this.range(1, 4), '...', this.pagesCount];
          this.emitPageNumber(1);
        } else if (index === 1 && this.currentPage === 6) {
          this.pages = [...this.range(1, 4), '...', this.pagesCount];
          this.emitPageNumber(2);
        } else if (index === 5 && this.currentPage < this.pagesCount - 5) {
          this.pages = [1, '...', ...this.range(this.currentPage + 2, this.currentPage + 4), '...', this.pagesCount];
          this.emitPageNumber(3);
        } else if (index === 5 && this.currentPage === this.pagesCount - 5) {
          this.pages = [1, '...', ...this.range(this.pagesCount - 3, this.pagesCount)];
          this.emitPageNumber(3);
        } else if (index === 5 && this.currentPage === this.pagesCount - 4) {
          this.pages = [1, '...', ...this.range(this.pagesCount - 3, this.pagesCount)];
          this.emitPageNumber(4);
        } else if (index === 5 && this.currentPage === this.pagesCount - 3) {
          this.pages = [1, '...', ...this.range(this.pagesCount - 2, this.pagesCount)];
          this.emitPageNumber(4);
        }
      }
    }
  }

  // if (index === 3 || index === 4) {
  //   this.pages = [1, '...', ...this.range(this.currentPage + 2, this.currentPage + 4), '...', this.pagesCount];
  //   this.emitPageNumber(3);
  // } else if (index === 1 && this.pages[5] !== item) {
  //   this.pages = [1, '...', ...this.range(this.currentPage - 4, this.currentPage - 2), '...', this.pagesCount];
  //   this.emitPageNumber(3);
  // } else if (this.pages[1] && this.pages[5] === item) {
  //   if (index === 1 && this.currentPage > 6) {
  //     this.pages = [1, '...', ...this.range(this.currentPage - 4, this.currentPage - 2), '...', this.pagesCount];
  //     this.emitPageNumber(3);
  //   } else if (index === 1 && this.currentPage === 4) {
  //     this.pages = [...this.range(1, 3), '...', this.pagesCount];
  //     this.emitPageNumber(0);
  //   } else if (index === 1 && this.currentPage === 5) {
  //     this.pages = [...this.range(1, 4), '...', this.pagesCount];
  //     this.emitPageNumber(1);
  //   } else if (index === 1 && this.currentPage === 6) {
  //     this.pages = [...this.range(1, 4), '...', this.pagesCount];
  //     this.emitPageNumber(2);
  //   } else if (index === 5 && this.currentPage < this.pagesCount - 5) {
  //     this.pages = [1, '...', ...this.range(this.currentPage + 2, this.currentPage + 4), '...', this.pagesCount];
  //     this.emitPageNumber(3);
  //   } else if (index === 5 && this.currentPage === this.pagesCount - 5) {
  //     this.pages = [1, '...', ...this.range(this.pagesCount - 3, this.pagesCount)];
  //     this.emitPageNumber(3);
  //   } else if (index === 5 && this.currentPage === this.pagesCount - 4) {
  //     this.pages = [1, '...', ...this.range(this.pagesCount - 3, this.pagesCount)];
  //     this.emitPageNumber(4);
  //   } else if (index === 5 && this.currentPage === this.pagesCount - 3) {
  //     this.pages = [1, '...', ...this.range(this.pagesCount - 2, this.pagesCount)];
  //     this.emitPageNumber(4);
  //   }
  // }

  showAllPage(): boolean {
    return this.pagesCount <= this.maxVisiblePages;
  }

  emitPageNumber(index: number): void {
    const pageNumber = this.pages[index];
    if (typeof pageNumber === 'number') {
      this.changePage.emit(pageNumber);
    }
  }
  
  range(start: number, end: number): number[] {
    return [...Array(end - start + 1)].map((_, index) => start + index);
  }

}
