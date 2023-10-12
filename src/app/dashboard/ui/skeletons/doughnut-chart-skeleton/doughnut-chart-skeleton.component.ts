import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doughnut-chart-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doughnut-chart-skeleton.component.html',
  styleUrls: ['./doughnut-chart-skeleton.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoughnutChartSkeletonComponent {

}
