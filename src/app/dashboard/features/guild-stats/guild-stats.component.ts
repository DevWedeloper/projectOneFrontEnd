import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectIsLoading } from '../../state/dashboard.reducers';
import { guildStatsActions } from '../../state/guild-stats.actions';
import {
  selectTopGuildsByAgility,
  selectTopGuildsByArmor,
  selectTopGuildsByAverageAgility,
  selectTopGuildsByAverageArmor,
  selectTopGuildsByAverageCritChance,
  selectTopGuildsByAverageHealth,
  selectTopGuildsByAverageIntelligence,
  selectTopGuildsByAverageStrength,
  selectTopGuildsByCritChance,
  selectTopGuildsByHealth,
  selectTopGuildsByIntelligence,
  selectTopGuildsByStrength,
  selectTopWellRoundedGuilds,
} from '../../state/guild-stats.reducers';
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
    HeadingComponent,
  ],
  templateUrl: './guild-stats.component.html',
  styleUrls: ['./guild-stats.component.scss', '../../ui/dashboard-shared.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuildStatsComponent {
  private store = inject(Store);
  protected topGuildsByHealth$ = this.store.select(selectTopGuildsByHealth);
  protected topGuildsByStrength$ = this.store.select(selectTopGuildsByStrength);
  protected topGuildsByAgility$ = this.store.select(selectTopGuildsByAgility);
  protected topGuildsByIntelligence$ = this.store.select(
    selectTopGuildsByIntelligence,
  );
  protected topGuildsByArmor$ = this.store.select(selectTopGuildsByArmor);
  protected topGuildsByCritChance$ = this.store.select(
    selectTopGuildsByCritChance,
  );
  protected topGuildsByAverageHealthData$ = this.store.select(
    selectTopGuildsByAverageHealth,
  );
  protected topGuildsByAverageStrengthData$ = this.store.select(
    selectTopGuildsByAverageStrength,
  );
  protected topGuildsByAverageAgilityData$ = this.store.select(
    selectTopGuildsByAverageAgility,
  );
  protected topGuildsByAverageIntelligenceData$ = this.store.select(
    selectTopGuildsByAverageIntelligence,
  );
  protected topGuildsByAverageArmorData$ = this.store.select(
    selectTopGuildsByAverageArmor,
  );
  protected topGuildsByAverageCritChanceData$ = this.store.select(
    selectTopGuildsByAverageCritChance,
  );
  protected topWellRoundedGuilds$ = this.store.select(
    selectTopWellRoundedGuilds,
  );
  protected loading$ = this.store.select(selectIsLoading);

  constructor() {
    this.store.dispatch(guildStatsActions.loadTopGuildsByHealth());
    this.store.dispatch(guildStatsActions.loadTopGuildsByStrength());
    this.store.dispatch(guildStatsActions.loadTopGuildsByAgility());
    this.store.dispatch(guildStatsActions.loadTopGuildsByIntelligence());
    this.store.dispatch(guildStatsActions.loadTopGuildsByArmor());
    this.store.dispatch(guildStatsActions.loadTopGuildsByCritChance());
    this.store.dispatch(guildStatsActions.loadTopGuildsByAverageHealth());
    this.store.dispatch(guildStatsActions.loadTopGuildsByAverageStrength());
    this.store.dispatch(guildStatsActions.loadTopGuildsByAverageAgility());
    this.store.dispatch(guildStatsActions.loadTopGuildsByAverageIntelligence());
    this.store.dispatch(guildStatsActions.loadTopGuildsByAverageArmor());
    this.store.dispatch(guildStatsActions.loadTopGuildsByAverageCritChance());
    this.store.dispatch(guildStatsActions.loadTopWellRoundedGuilds());
  }
}
