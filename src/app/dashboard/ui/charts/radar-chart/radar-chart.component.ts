import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective, NgChartsModule, ThemeService } from 'ng2-charts';
import { debounceTime, distinctUntilChanged, fromEvent, tap } from 'rxjs';
import { smoothTransitionAnimation } from '../../../../shared/ui/animations/smooth-transition.animations';
import { ChartColorService } from '../../../data-access/chart-color.service';
import { WellRoundedCharacter } from '../../../interfaces/well-rounded-character.interface';
import { NoDataComponent } from '../../no-data/no-data.component';
import { RadarChartSkeletonComponent } from '../../skeletons/radar-chart-skeleton/radar-chart-skeleton.component';

@Component({
  selector: 'app-radar-chart',
  standalone: true,
  imports: [
    CommonModule,
    NgChartsModule,
    RadarChartSkeletonComponent,
    NoDataComponent,
  ],
  providers: [ThemeService],
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.scss'],
  animations: [smoothTransitionAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadarChartComponent {
  private tsChartJS = inject(ThemeService);
  private ccs = inject(ChartColorService);
  selectedCharacter = input.required<WellRoundedCharacter | null>();
  topWellRoundedCharacters = input.required<WellRoundedCharacter[] | null>();
  radarChartLabels = input.required<string[] | undefined>();
  radarChartDatasets = input.required<
    ChartConfiguration<'radar'>['data']['datasets'] | undefined
  >();
  loading = input.required<boolean | null>();
  selectedCharacterChange = output<WellRoundedCharacter>();
  protected radarChartOptions: ChartConfiguration<'radar'>['options'] = {
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
        },
        pointLabels: {
          font: {
            size: 15,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  private chart = viewChild<BaseChartDirective | undefined>(BaseChartDirective);
  private resize$ = fromEvent(window, 'resize').pipe(
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => {
      const screenWidth = window.innerWidth;
      if (
        this.radarChartOptions?.scales?.['r']?.pointLabels?.font !== undefined
      ) {
        if (screenWidth > 991) {
          this.radarChartOptions.scales['r'].pointLabels.font = { size: 15 };
        } else if (screenWidth > 768) {
          this.radarChartOptions.scales['r'].pointLabels.font = { size: 12 };
        } else if (screenWidth > 500) {
          this.radarChartOptions.scales['r'].pointLabels.font = { size: 10 };
        }
      }
      this.chart()?.ngOnChanges({});
    }),
  );

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
            pointLabels: {
              color: this.ccs.textColor$.value,
            },
          },
        },
      };
      this.tsChartJS.setColorschemesOptions(selectedTheme);
    });
    this.resize$.pipe(takeUntilDestroyed()).subscribe();
  }
}
