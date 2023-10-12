import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-radar-chart-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './radar-chart-skeleton.component.html',
  styleUrls: ['./radar-chart-skeleton.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadarChartSkeletonComponent {

}
