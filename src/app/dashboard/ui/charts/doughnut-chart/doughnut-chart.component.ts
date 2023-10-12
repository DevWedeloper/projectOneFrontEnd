import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule, ThemeService } from 'ng2-charts';
import { ChartColorService } from 'src/app/dashboard/data-access/chart-color.service';
import { smoothTransitionAnimation } from 'src/app/shared/ui/animations/smooth-transition.animations';
import { DoughnutChartSkeletonComponent } from '../../skeletons/doughnut-chart-skeleton/doughnut-chart-skeleton.component';

@Component({
  selector: 'app-doughnut-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule, DoughnutChartSkeletonComponent],
  providers: [ThemeService],
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.scss'],
  animations: [smoothTransitionAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoughnutChartComponent {
  tsChartJS = inject(ThemeService);
  ccs = inject(ChartColorService);
  @Input({ required: true }) polarAreaChartLabels: string[] | undefined;
  @Input({ required: true })
  polarAreaChartDatasets: ChartConfiguration<'polarArea'>['data']['datasets'] | undefined =
    [];
  @Input({ required: true }) loading!: boolean | null;
  polarAreaOptions: ChartConfiguration<'polarArea'>['options'] = {
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
