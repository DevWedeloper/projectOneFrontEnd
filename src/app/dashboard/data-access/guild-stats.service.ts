import { Injectable, inject } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { Observable, combineLatest, map } from 'rxjs';
import { AverageCharacterStats } from '../interfaces/character-average-interface';
import { AverageGuildStats } from '../interfaces/guild-average-attribute.interface';
import { WellRoundedGuild } from '../interfaces/well-rounded-guild.interface';
import { CharacterStatsApiService } from './character-stats-api.service';
import { ChartColorService } from './chart-color.service';
import { DashboardLoadingService } from './dashboard-loading.service';
import { GuildStatsApiService } from './guild-stats-api.service';

interface TopGuildsByAttributeOptions {
  attribute: string;
  backgroundColor: string;
}

interface TopGuildsByAverageAttributeOptions {
  attribute: string;
  label: string;
  backgroundColor: string;
}

@Injectable({
  providedIn: 'root',
})
export class GuildStatsService {
  guildStatsApiService = inject(GuildStatsApiService);
  characterStatsApiService = inject(CharacterStatsApiService);
  ccs = inject(ChartColorService);
  ls = inject(DashboardLoadingService);
  topGuildsByHealth$ = this.generateTopGuildsByAttribute({
    attribute: 'health',
    backgroundColor: this.ccs.healthColor,
  });
  topGuildsByStrength$ = this.generateTopGuildsByAttribute({
    attribute: 'strength',
    backgroundColor: this.ccs.strengthColor,
  });
  topGuildsByAgility$ = this.generateTopGuildsByAttribute({
    attribute: 'agility',
    backgroundColor: this.ccs.agilityColor,
  });
  topGuildsByIntelligence$ = this.generateTopGuildsByAttribute({
    attribute: 'intelligence',
    backgroundColor: this.ccs.intelligenceColor,
  });
  topGuildsByArmor$ = this.generateTopGuildsByAttribute({
    attribute: 'armor',
    backgroundColor: this.ccs.armorColor,
  });
  topGuildsByCritChance$ = this.generateTopGuildsByAttribute({
    attribute: 'critChance',
    backgroundColor: this.ccs.critChanceColor,
  });
  topWellRoundedGuilds$ = this.guildStatsApiService
    .getTopWellRoundedGuilds()
    .pipe(
      map((guilds) => {
        const names = guilds.map((guild) => guild.name);
        const combinedAttributes = guilds.map((guild) => guild.membersAverage);
        const dataset = [
          {
            data: combinedAttributes || [],
            backgroundColor: 'red',
          },
        ];
        return { names, dataset };
      })
    );
  averageCharacterStats$ =
    this.characterStatsApiService.getAverageCharacterStats();
  topGuildsByAverageHealthData$ = this.generateTopGuildsByAverageAttribute({
    attribute: 'health',
    label: 'Health',
    backgroundColor: this.ccs.healthColor,
  });
  topGuildsByAverageStrengthData$ = this.generateTopGuildsByAverageAttribute({
    attribute: 'strength',
    label: 'Strength',
    backgroundColor: this.ccs.strengthColor,
  });
  topGuildsByAverageAgilityData$ = this.generateTopGuildsByAverageAttribute({
    attribute: 'agility',
    label: 'Agility',
    backgroundColor: this.ccs.agilityColor,
  });
  topGuildsByAverageIntelligenceData$ =
    this.generateTopGuildsByAverageAttribute({
      attribute: 'intelligence',
      label: 'Intelligence',
      backgroundColor: this.ccs.intelligenceColor,
    });
  topGuildsByAverageArmorData$ = this.generateTopGuildsByAverageAttribute({
    attribute: 'armor',
    label: 'Armor',
    backgroundColor: this.ccs.armorColor,
  });
  topGuildsByAverageCritChanceData$ = this.generateTopGuildsByAverageAttribute({
    attribute: 'critChance',
    label: 'Crit Chance',
    backgroundColor: this.ccs.critChanceColor,
  });

  constructor() {
    const observables: Observable<
      | {
          names: string[];
          dataset: ChartConfiguration<'bar'>['data']['datasets'];
        }
      | WellRoundedGuild[]
      | AverageGuildStats[]
    >[] = [
      this.topGuildsByHealth$,
      this.topGuildsByStrength$,
      this.topGuildsByAgility$,
      this.topGuildsByIntelligence$,
      this.topGuildsByArmor$,
      this.topGuildsByCritChance$,
      this.topWellRoundedGuilds$,
      this.topGuildsByAverageHealthData$,
      this.topGuildsByAverageStrengthData$,
      this.topGuildsByAverageAgilityData$,
      this.topGuildsByAverageIntelligenceData$,
      this.topGuildsByAverageArmorData$,
      this.topGuildsByAverageCritChanceData$,
    ];
    this.ls.waitForObservables(observables);
  }

  private generateTopGuildsByAttribute({
    attribute,
    backgroundColor,
  }: TopGuildsByAttributeOptions): Observable<{
    names: string[];
    dataset: ChartConfiguration<'bar'>['data']['datasets'];
  }> {
    return this.guildStatsApiService.getTopGuildsByAttribute(attribute).pipe(
      map((guilds) => {
        const names = guilds.map((guild) => guild.name).reverse();
        const combinedAttributes = guilds
          .map((guild) => guild.combinedAttribute)
          .reverse();
        const dataset: ChartConfiguration<'bar'>['data']['datasets'] = [
          {
            data: combinedAttributes || [],
            backgroundColor: `${backgroundColor}`,
          },
        ];
        return { names, dataset };
      })
    );
  }

  private generateTopGuildsByAverageAttribute({
    attribute,
    label,
    backgroundColor,
  }: TopGuildsByAverageAttributeOptions): Observable<{
    names: string[];
    dataset: ChartConfiguration<'bar'>['data']['datasets'];
  }> {
    return combineLatest([
      this.averageCharacterStats$,
      this.guildStatsApiService.getTopGuildsByAverageAttribute(attribute),
    ]).pipe(
      map(([averageCharacterStats, guilds]) => {
        const names = guilds.map((guild) => guild.name).reverse();
        const combinedAttributes = guilds
          .map((guild) => guild.averageAttribute)
          .reverse();
        const averageAttribute = averageCharacterStats[
          `avg${
            attribute.charAt(0).toUpperCase() + attribute.slice(1)
          }` as keyof AverageCharacterStats
        ] as number;
        const dataset: ChartConfiguration<'bar'>['data']['datasets'] = [
          {
            data: Array(5).fill(averageAttribute),
            label: `avg.${label}`,
            backgroundColor: 'grey',
          },
          {
            data: combinedAttributes || [],
            label: `avg.Member ${label}`,
            backgroundColor: `${backgroundColor}`,
          },
        ];
        return { names, dataset };
      })
    );
  }
}
