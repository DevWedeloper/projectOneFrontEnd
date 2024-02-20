import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule, ThemeService } from 'ng2-charts';
import { ChartColorService } from 'src/app/dashboard/data-access/chart-color.service';
import { NoDataComponent } from 'src/app/dashboard/ui/no-data/no-data.component';
import { smoothTransitionAnimation } from '../../../../shared/ui/animations/smooth-transition.animations';
import { HorizontalBarChartSkeletonComponent } from '../../skeletons/horizontal-bar-chart-skeleton/horizontal-bar-chart-skeleton.component';

@Component({
  selector: 'app-horizontal-bar-chart',
  standalone: true,
  templateUrl: './horizontal-bar-chart.component.html',
  styleUrls: ['./horizontal-bar-chart.component.scss'],
  imports: [
    CommonModule,
    NgChartsModule,
    HorizontalBarChartSkeletonComponent,
    NoDataComponent,
  ],
  providers: [ThemeService],
  animations: [smoothTransitionAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HorizontalBarChartComponent {
  private tsChartJS = inject(ThemeService);
  private ccs = inject(ChartColorService);
  label = input<string>();
  barChartLabels = input.required<string[] | undefined>();
  barChartDataset = input.required<
    ChartConfiguration<'bar'>['data']['datasets'] | undefined
  >();
  loading = input.required<boolean | null>();
  protected barChartOptions: ChartConfiguration<'bar'>['options'] = {
    indexAxis: 'y',
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  constructor() {
    this.ccs.getStyle$.pipe(takeUntilDestroyed()).subscribe(() => {
      const selectedTheme: ChartConfiguration<'bar'>['options'] = {
        scales: {
          y: {
            ticks: {
              color: this.ccs.textColor$.value,
            },
            grid: {
              display: false,
            },
          },
          x: {
            ticks: {
              color: this.ccs.textColor$.value,
            },
            grid: {
              color: this.ccs.textColor$.value,
            },
          },
        },
      };
      this.tsChartJS.setColorschemesOptions(selectedTheme);
    });
  }
}
