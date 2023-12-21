import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  QueryList,
  Renderer2,
  ViewChildren,
  inject,
} from '@angular/core';
import { Character } from '../../../interfaces/character.interface';
import { Guild } from '../../../interfaces/guild.interface';

@Component({
  selector: 'app-search-items',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-items.component.html',
  styleUrls: ['./search-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchItemsComponent<T extends Character | Guild>
  implements OnDestroy
{
  elementRef = inject(ElementRef);
  renderer = inject(Renderer2);
  @Input({ required: true }) searchResults: T[] | null = [];
  @Output() selectedItem = new EventEmitter<Character | Guild>();
  @Output() closeComponent = new EventEmitter<void>();
  @ViewChildren('searchItems') searchItems!: QueryList<ElementRef>;
  private currentFocusedIndex = -1;

  ngOnDestroy(): void {
    this.closeComponent.emit();
  }

  selectItem(result: Character | Guild) {
    this.selectedItem.emit(result);
    this.closeComponent.emit();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.closeComponent.emit();
    }
  }

  @HostListener('document:keydown.ArrowUp', ['$event'])
  onArrowUp() {
    if (this.currentFocusedIndex > 0) {
      this.currentFocusedIndex--;
      this.focusItem(this.currentFocusedIndex);
    } else if (this.currentFocusedIndex === 0) {
      this.focusItem(this.currentFocusedIndex);
    }
  }

  @HostListener('document:keydown.ArrowDown', ['$event'])
  onArrowDown() {
    if (
      this.searchResults &&
      this.currentFocusedIndex < this.searchResults.length - 1
    ) {
      this.currentFocusedIndex++;
      this.focusItem(this.currentFocusedIndex);
    } else if (this.searchResults && this.currentFocusedIndex === this.searchResults?.length - 1) {
        this.focusItem(this.currentFocusedIndex);
    }
  }

  @HostListener('document:keydown.Tab', ['$event'])
  @HostListener('document:keydown.Enter', ['$event'])
  @HostListener('document:keydown.Shift.Tab', ['$event'])
  onKeydown() {
    this.closeComponent.emit();
    this.currentFocusedIndex = -1;
  }

  focusItem(index: number) {
    if (this.searchResults) {
      const elementToFocus = this.searchItems.toArray()[index];
      setTimeout(() => {
        elementToFocus.nativeElement.focus();
      });
      elementToFocus.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  trackBy(index: number): number {
    return index;
  }
}
