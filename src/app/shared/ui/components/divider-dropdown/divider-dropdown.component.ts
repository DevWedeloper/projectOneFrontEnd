import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { formDropdownAnimation } from '../../animations/form-dropdown-transition.animations';
import { FocusVisibleDirective } from '../../directives/focus-visible.directive';
import { DividerDropdownSkeletonComponent } from '../skeleton/divider-dropdown-skeleton/divider-dropdown-skeleton.component';

@Component({
  selector: 'app-divider-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    FocusVisibleDirective,
    DividerDropdownSkeletonComponent,
  ],
  templateUrl: './divider-dropdown.component.html',
  styleUrls: ['./divider-dropdown.component.scss'],
  animations: [formDropdownAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DividerDropdownComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) loading!: boolean | null;
  @Output() dividerToggled = new EventEmitter<void>();
  showContent = new BehaviorSubject<boolean>(false);

  toggleDivider(): void {
    this.showContent.next(!this.showContent.value);
    this.dividerToggled.emit();
  }
}
