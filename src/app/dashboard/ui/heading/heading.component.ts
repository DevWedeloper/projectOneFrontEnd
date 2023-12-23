import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { DashboardLoadingService } from '../../data-access/dashboard-loading.service';
import { HeadingSkeletonComponent } from '../skeletons/heading-skeleton/heading-skeleton.component';

@Component({
  selector: 'app-heading',
  standalone: true,
  imports: [CommonModule, HeadingSkeletonComponent],
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeadingComponent {
  protected ls = inject(DashboardLoadingService);
  @Input({ required: true }) label!: string;
  @Input({ required: true }) loading!: boolean | null;
}
