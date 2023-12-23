import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DashboardLoadingService } from '../../data-access/dashboard-loading.service';
import { GuildStatsService } from '../../data-access/guild-stats.service';
import { HorizontalBarChartComponent } from '../../ui/charts/horizontal-bar-chart/horizontal-bar-chart.component';
import { VerticalBarChartComponent } from '../../ui/charts/vertical-bar-chart/vertical-bar-chart.component';
import { HeadingComponent } from '../../ui/heading/heading.component';

@Component({
  selector: 'app-guild-stats',
  standalone: true,
  imports: [
    CommonModule,
    VerticalBarChartComponent,
    HorizontalBarChartComponent,
    HeadingComponent
  ],
  templateUrl: './guild-stats.component.html',
  styleUrls: ['./guild-stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuildStatsComponent {
  protected gss = inject(GuildStatsService);
  protected ls = inject(DashboardLoadingService);
}
