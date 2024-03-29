import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HeadingSkeletonComponent } from '../skeletons/heading-skeleton/heading-skeleton.component';

@Component({
  selector: 'app-heading',
  standalone: true,
  imports: [CommonModule, HeadingSkeletonComponent],
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadingComponent {
  label = input.required<string>();
  loading = input.required<boolean | null>();
}
