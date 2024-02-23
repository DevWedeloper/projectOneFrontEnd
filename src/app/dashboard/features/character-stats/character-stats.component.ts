import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { skip, take, tap } from 'rxjs';
import { WellRoundedCharacter } from '../../interfaces/well-rounded-character.interface';
import { characterStatsActions } from '../../state/character-stats.actions';
import {
  selectCharacterDistributionByType,
  selectRadarChartCharacter,
  selectRadarChartDataset,
  selectTopCharactersByAgility,
  selectTopCharactersByArmor,
  selectTopCharactersByCritChance,
  selectTopCharactersByHealth,
  selectTopCharactersByIntelligence,
  selectTopCharactersByStrength,
  selectTopWellRoundedCharacters,
} from '../../state/character-stats.reducers';
import { selectIsLoading } from '../../state/dashboard.reducers';
import { DoughnutChartComponent } from '../../ui/charts/doughnut-chart/doughnut-chart.component';
import { HorizontalBarChartComponent } from '../../ui/charts/horizontal-bar-chart/horizontal-bar-chart.component';
import { RadarChartComponent } from '../../ui/charts/radar-chart/radar-chart.component';
import { HeadingComponent } from '../../ui/heading/heading.component';
import { HorizontalBarChartSkeletonComponent } from '../../ui/skeletons/horizontal-bar-chart-skeleton/horizontal-bar-chart-skeleton.component';

@Component({
  selector: 'app-character-stats',
  standalone: true,
  imports: [
    CommonModule,
    HorizontalBarChartSkeletonComponent,
    HorizontalBarChartComponent,
    RadarChartComponent,
    DoughnutChartComponent,
    HeadingComponent,
  ],
  templateUrl: './character-stats.component.html',
  styleUrls: [
    './character-stats.component.scss',
    '../../ui/dashboard-shared.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterStatsComponent {
  private store = inject(Store);
  protected topCharactersByHealth$ = this.store.select(
    selectTopCharactersByHealth,
  );
  protected topCharactersByStrength$ = this.store.select(
    selectTopCharactersByStrength,
  );
  protected topCharactersByAgility$ = this.store.select(
    selectTopCharactersByAgility,
  );
  protected topCharactersByIntelligence$ = this.store.select(
    selectTopCharactersByIntelligence,
  );
  protected topCharactersByArmor$ = this.store.select(
    selectTopCharactersByArmor,
  );
  protected topCharactersByCritChance$ = this.store.select(
    selectTopCharactersByCritChance,
  );
  protected topWellRoundedCharacters$ = this.store.select(
    selectTopWellRoundedCharacters,
  );
  protected radarChartDataset$ = this.store.select(selectRadarChartDataset);
  protected radarChartCharacter$ = this.store.select(selectRadarChartCharacter);
  protected characterDistributionByType$ = this.store.select(
    selectCharacterDistributionByType,
  );
  protected loading$ = this.store.select(selectIsLoading);

  constructor() {
    this.store.dispatch(characterStatsActions.loadTopCharactersByHealth());
    this.store.dispatch(characterStatsActions.loadTopCharactersByStrength());
    this.store.dispatch(characterStatsActions.loadTopCharactersByAgility());
    this.store.dispatch(
      characterStatsActions.loadTopCharactersByIntelligence(),
    );
    this.store.dispatch(characterStatsActions.loadTopCharactersByArmor());
    this.store.dispatch(characterStatsActions.loadTopCharactersByCritChance());
    this.store.dispatch(characterStatsActions.loadTopWellRoundedCharacters());
    this.store.dispatch(
      characterStatsActions.loadCharacterDistributionByType(),
    );
    this.topWellRoundedCharacters$
      .pipe(
        skip(1),
        take(1),
        tap((characters) => {
          const character = characters?.[0] || null;
          this.store.dispatch(
            characterStatsActions.selectTopWellRoundedCharacter({ character }),
          );
        }),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  selectCharacter(character: WellRoundedCharacter): void {
    this.store.dispatch(
      characterStatsActions.selectTopWellRoundedCharacter({ character }),
    );
  }
}
