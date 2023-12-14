import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  QueryList,
  Renderer2,
  ViewChildren,
  inject,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
export class SearchItemsComponent<T extends Character | Guild> {
  elementRef = inject(ElementRef);
  renderer = inject(Renderer2);
  @Input({ required: true }) searchResults$ = new BehaviorSubject<T[]>([]);
  @Output() selectedItem = new EventEmitter<Character | Guild>();
  @Output() closeComponent = new EventEmitter<void>();
  @ViewChildren('searchItems') searchItems!: QueryList<ElementRef>;
  private currentFocusedIndex = -1;
  private skipInitialCheck = true;

  @HostListener('document:focusin', ['$event'])
  onDocumentFocusIn(event: Event) {
    if (this.skipInitialCheck) {
      this.skipInitialCheck = false;
      return;
    }
    if (
      !this.searchItems.some((child) =>
        child.nativeElement.contains(event.target as Node)
      )
    ) {
      this.closeComponent.emit();
    }
  }

  selectItem(result: Character | Guild) {
    this.selectedItem.emit(result);
    this.searchResults$.next([]);
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.searchResults$.next([]);
    }
  }

  @HostListener('document:keydown.ArrowUp', ['$event'])
  onArrowUp() {
    if (this.currentFocusedIndex > 0) {
      this.currentFocusedIndex--;
      this.focusItem(this.currentFocusedIndex);
    }
  }

  @HostListener('document:keydown.ArrowDown', ['$event'])
  onArrowDown() {
    if (this.currentFocusedIndex < this.searchResults$.value.length - 1) {
      this.currentFocusedIndex++;
      this.focusItem(this.currentFocusedIndex);
    }
  }

  @HostListener('document:keydown.Tab', ['$event'])
  @HostListener('document:keydown.Enter', ['$event'])
  @HostListener('document:keydown.Shift.Tab', ['$event'])
  onKeydown() {
    this.searchResults$.next([]);
    this.currentFocusedIndex = -1;
  }

  focusItem(index: number) {
    this.currentFocusedIndex = index;
    const elementToFocus = this.searchItems.toArray()[index];
    elementToFocus.nativeElement.focus();
    const result = this.searchResults$.value[index];
    this.selectedItem.emit(result);
  }

  trackBy(index: number): number {
    return index;
  }
}
