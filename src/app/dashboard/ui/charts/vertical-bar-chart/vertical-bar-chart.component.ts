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
import { smoothTransitionAnimation } from 'src/app/shared/ui/animations/smooth-transition.animations';
import { TruncatePipe } from 'src/app/shared/ui/pipes/truncate.pipe';
import { VerticalBarChartSkeletonComponent } from '../../skeletons/vertical-bar-chart-skeleton/vertical-bar-chart-skeleton.component';

@Component({
  selector: 'app-vertical-bar-chart',
  standalone: true,
  imports: [
    CommonModule,
    TruncatePipe,
    VerticalBarChartSkeletonComponent,
    NgChartsModule,
    NoDataComponent,
  ],
  providers: [ThemeService],
  templateUrl: './vertical-bar-chart.component.html',
  styleUrls: ['./vertical-bar-chart.component.scss'],
  animations: [smoothTransitionAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerticalBarChartComponent {
  private ccs = inject(ChartColorService);
  private tsChartJS = inject(ThemeService);
  label = input.required<string>();
  barChartLabels = input.required<string[] | undefined>();
  barChartDataset = input.required<
    ChartConfiguration<'bar'>['data']['datasets'] | undefined
  >();
  loading = input.required<boolean | null>();
  protected barChartOptions: ChartConfiguration<'bar'>['options'] = {
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
              color: this.ccs.textColor$.value,
            },
          },
          x: {
            ticks: {
              color: this.ccs.textColor$.value,
            },
            grid: {
              display: false,
            },
          },
        },
      };
      this.tsChartJS.setColorschemesOptions(selectedTheme);
    });
  }
}
