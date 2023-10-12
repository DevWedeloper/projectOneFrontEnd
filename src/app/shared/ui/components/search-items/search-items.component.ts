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
  inject
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Character } from '../../../interfaces/character.interface';
import { Guild } from '../../../interfaces/guild.interface';

@Component({
  selector: 'app-search-items',
  templateUrl: './search-items.component.html',
  styleUrls: ['./search-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class SearchItemsComponent<T extends Character | Guild> {
  elementRef = inject(ElementRef);
  renderer = inject(Renderer2);
  @Input({ required: true }) searchResults$ = new BehaviorSubject<T[]>([]);
  @Output() selectedItemId = new EventEmitter<string>();
  @Output() selectedItemName = new EventEmitter<string>();
  @Output() selectedItemData = new EventEmitter<Character | Guild>();
  @ViewChildren('searchItems') searchItems!: QueryList<ElementRef>;
  currentFocusedIndex = -1;

  selectItem(result: Character | Guild) {
    this.selectedItemId.emit(result._id);
    this.selectedItemName.emit(result.name);
    this.selectedItemData.emit(result);
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
  onTabKey() {
    this.searchResults$.next([]);
    this.currentFocusedIndex = -1;
  }

  @HostListener('document:keydown.Enter', ['$event'])
  onEnterKey() {
    this.searchResults$.next([]);
    this.currentFocusedIndex = -1;
  }

  @HostListener('document:keydown.Shift.Tab', ['$event'])
  onShiftTabKey() {
    this.searchResults$.next([]);
    this.currentFocusedIndex = -1;
  }

  focusItem(index: number) {
    this.currentFocusedIndex = index;
    const elementToFocus = this.searchItems.toArray()[index];
    elementToFocus.nativeElement.focus();
    const result = this.searchResults$.value[index];
    this.selectedItemId.emit(result._id);
    this.selectedItemName.emit(result.name);
  }

  trackBy(index: number): number {
    return index;
  }
}
