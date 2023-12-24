import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HorizontalBarChartComponent } from 'src/app/dashboard/ui/charts/horizontal-bar-chart/horizontal-bar-chart.component';
import { RadarChartComponent } from 'src/app/dashboard/ui/charts/radar-chart/radar-chart.component';
import { HorizontalBarChartSkeletonComponent } from 'src/app/dashboard/ui/skeletons/horizontal-bar-chart-skeleton/horizontal-bar-chart-skeleton.component';
import { CharacterStatsService } from '../../data-access/character-stats.service';
import { DashboardLoadingService } from '../../data-access/dashboard-loading.service';
import { DoughnutChartComponent } from '../../ui/charts/doughnut-chart/doughnut-chart.component';
import { HeadingComponent } from '../../ui/heading/heading.component';

@Component({
  selector: 'app-character-stats',
  templateUrl: './character-stats.component.html',
  styleUrls: [
    './character-stats.component.scss',
    '../../ui/dashboard-shared.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    HorizontalBarChartSkeletonComponent,
    HorizontalBarChartComponent,
    RadarChartComponent,
    DoughnutChartComponent,
    HeadingComponent,
  ],
})
export class CharacterStatsComponent {
  protected css = inject(CharacterStatsService);
  protected ls = inject(DashboardLoadingService);
}
