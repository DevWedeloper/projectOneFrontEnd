import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  inject,
  input,
  viewChildren,
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
  host: {
    '(document:click)': 'onClick($event)',
    '(document:keydown.ArrowUp)': 'onArrowUp()',
    '(document:keydown.ArrowDown)': 'onArrowDown()',
    '(document:keydown.Tab)': 'onKeydown()',
    '(document:keydown.Enter)': 'onKeydown()',
    '(document:keydown.Shift.Tab)': 'onKeydown()',
  },
})
export class SearchItemsComponent<T extends Character | Guild>
  implements OnDestroy
{
  private elementRef = inject(ElementRef);
  searchResults = input.required<T[] | null>();
  @Output() selectedItem = new EventEmitter<Character | Guild>();
  @Output() closeComponent = new EventEmitter<void>();
  private searchItems = viewChildren<ElementRef>('searchItems');
  private currentFocusedIndex = -1;

  ngOnDestroy(): void {
    this.closeComponent.emit();
  }

  protected selectItem(result: Character | Guild): void {
    this.selectedItem.emit(result);
    this.closeComponent.emit();
  }

  protected onClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.closeComponent.emit();
    }
  }

  protected onArrowUp(): void {
    if (this.currentFocusedIndex > 0) {
      this.currentFocusedIndex--;
      this.focusItem(this.currentFocusedIndex);
    } else if (this.currentFocusedIndex === 0) {
      this.focusItem(this.currentFocusedIndex);
    }
  }

  protected onArrowDown(): void {
    if (
      this.searchResults &&
      this.currentFocusedIndex < this.searchResults.length - 1
    ) {
      this.currentFocusedIndex++;
      this.focusItem(this.currentFocusedIndex);
    } else if (
      this.searchResults &&
      this.currentFocusedIndex === this.searchResults?.length - 1
    ) {
      this.focusItem(this.currentFocusedIndex);
    }
  }

  protected onKeydown(): void {
    this.closeComponent.emit();
    this.currentFocusedIndex = -1;
  }

  private focusItem(index: number): void {
    if (this.searchResults()) {
      const elementToFocus = this.searchItems()[index];
      setTimeout(() => {
        elementToFocus.nativeElement.focus();
      });
      elementToFocus.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }
}
