import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule, ThemeService } from 'ng2-charts';
import { ChartColorService } from 'src/app/dashboard/data-access/chart-color.service';
import { smoothTransitionAnimation } from 'src/app/shared/ui/animations/smooth-transition.animations';
import { NoDataComponent } from 'src/app/shared/ui/components/no-data/no-data.component';
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
    NoDataComponent
  ],
  providers: [ThemeService],
  templateUrl: './vertical-bar-chart.component.html',
  styleUrls: ['./vertical-bar-chart.component.scss'],
  animations: [smoothTransitionAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerticalBarChartComponent {
  tsChartJS = inject(ThemeService);
  ccs = inject(ChartColorService);
  @Input() label!: string;
  @Input({ required: true }) barChartLabels!: string[] | null;
  @Input({ required: true }) barChartDataset!:
    | ChartConfiguration<'bar'>['data']['datasets']
    | null;
  @Input({ required: true }) loading!: boolean | null;
  barChartOptions: ChartConfiguration<'bar'>['options'] = {
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
