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
import { smoothTransitionAnimation } from '../../../../shared/ui/animations/smooth-transition.animations';
import { ChartColorService } from '../../../data-access/chart-color.service';
import { NoDataComponent } from '../../no-data/no-data.component';
import { DoughnutChartSkeletonComponent } from '../../skeletons/doughnut-chart-skeleton/doughnut-chart-skeleton.component';

@Component({
  selector: 'app-doughnut-chart',
  standalone: true,
  imports: [
    CommonModule,
    NgChartsModule,
    DoughnutChartSkeletonComponent,
    NoDataComponent,
  ],
  providers: [ThemeService],
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.scss'],
  animations: [smoothTransitionAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoughnutChartComponent {
  private tsChartJS = inject(ThemeService);
  private ccs = inject(ChartColorService);
  polarAreaChartLabels = input.required<string[] | undefined>();
  polarAreaChartDatasets = input.required<
    ChartConfiguration<'polarArea'>['data']['datasets'] | undefined
  >();
  loading = input.required<boolean | null>();
  protected polarAreaOptions: ChartConfiguration<'polarArea'>['options'] = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  constructor() {
    this.ccs.getStyle$.pipe(takeUntilDestroyed()).subscribe(() => {
      const selectedTheme: ChartConfiguration<'radar'>['options'] = {
        scales: {
          r: {
            ticks: {
              backdropColor: this.ccs.secondaryColor$.value,
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
