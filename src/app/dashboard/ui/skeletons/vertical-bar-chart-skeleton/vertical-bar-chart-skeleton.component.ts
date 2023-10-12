import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vertical-bar-chart-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vertical-bar-chart-skeleton.component.html',
  styleUrls: ['./vertical-bar-chart-skeleton.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerticalBarChartSkeletonComponent {

}
