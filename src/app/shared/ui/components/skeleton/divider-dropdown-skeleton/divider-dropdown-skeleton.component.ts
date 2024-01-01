import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-divider-dropdown-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './divider-dropdown-skeleton.component.html',
  styleUrls: ['./divider-dropdown-skeleton.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DividerDropdownSkeletonComponent {}
