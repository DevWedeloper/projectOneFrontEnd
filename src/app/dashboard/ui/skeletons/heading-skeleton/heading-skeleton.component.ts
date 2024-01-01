import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-heading-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './heading-skeleton.component.html',
  styleUrls: ['./heading-skeleton.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadingSkeletonComponent {}
