import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { formDropdownAnimation } from '../../animations/form-dropdown-transition.animations';
import { FocusVisibleDirective } from '../../directives/focus-visible.directive';
import { DividerComponent } from '../divider/divider.component';
import { DividerDropdownSkeletonComponent } from '../skeleton/divider-dropdown-skeleton/divider-dropdown-skeleton.component';

@Component({
  selector: 'app-divider-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    FocusVisibleDirective,
    DividerDropdownSkeletonComponent,
    DividerComponent,
  ],
  templateUrl: './divider-dropdown.component.html',
  styleUrls: ['./divider-dropdown.component.scss'],
  animations: [formDropdownAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DividerDropdownComponent {
  label = input.required<string>();
  loading = input.required<boolean | null>();
  dividerToggled = output<void>();
  protected showContent = new BehaviorSubject<boolean>(false);

  toggleDivider(): void {
    this.showContent.next(!this.showContent.value);
    this.dividerToggled.emit();
  }
}
