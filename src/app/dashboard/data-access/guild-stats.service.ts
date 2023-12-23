import { Injectable, inject } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { Observable, combineLatest, map } from 'rxjs';
import { Guild } from 'src/app/shared/interfaces/guild.interface';
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
  private guildStatsApiService = inject(GuildStatsApiService);
  private characterStatsApiService = inject(CharacterStatsApiService);
  private ccs = inject(ChartColorService);
  private ls = inject(DashboardLoadingService);
  readonly topGuildsByHealth$ = this.generateTopGuildsByAttribute({
    attribute: 'health',
    backgroundColor: this.ccs.healthColor,
  });
  readonly topGuildsByStrength$ = this.generateTopGuildsByAttribute({
    attribute: 'strength',
    backgroundColor: this.ccs.strengthColor,
  });
  readonly topGuildsByAgility$ = this.generateTopGuildsByAttribute({
    attribute: 'agility',
    backgroundColor: this.ccs.agilityColor,
  });
  readonly topGuildsByIntelligence$ = this.generateTopGuildsByAttribute({
    attribute: 'intelligence',
    backgroundColor: this.ccs.intelligenceColor,
  });
  readonly topGuildsByArmor$ = this.generateTopGuildsByAttribute({
    attribute: 'armor',
    backgroundColor: this.ccs.armorColor,
  });
  readonly topGuildsByCritChance$ = this.generateTopGuildsByAttribute({
    attribute: 'critChance',
    backgroundColor: this.ccs.critChanceColor,
  });
  readonly topWellRoundedGuilds$ = this.guildStatsApiService
    .getTopWellRoundedGuilds()
    .pipe(
      map((guilds) => {
        if (guilds.length === 0) {
          return null;
        }
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
  readonly averageCharacterStats$ =
    this.characterStatsApiService.getAverageCharacterStats();
  readonly topGuildsByAverageHealthData$ = this.generateTopGuildsByAverageAttribute({
    attribute: 'health',
    label: 'Health',
    backgroundColor: this.ccs.healthColor,
  });
  readonly topGuildsByAverageStrengthData$ = this.generateTopGuildsByAverageAttribute({
    attribute: 'strength',
    label: 'Strength',
    backgroundColor: this.ccs.strengthColor,
  });
  readonly topGuildsByAverageAgilityData$ = this.generateTopGuildsByAverageAttribute({
    attribute: 'agility',
    label: 'Agility',
    backgroundColor: this.ccs.agilityColor,
  });
  readonly topGuildsByAverageIntelligenceData$ =
    this.generateTopGuildsByAverageAttribute({
      attribute: 'intelligence',
      label: 'Intelligence',
      backgroundColor: this.ccs.intelligenceColor,
    });
  readonly topGuildsByAverageArmorData$ = this.generateTopGuildsByAverageAttribute({
    attribute: 'armor',
    label: 'Armor',
    backgroundColor: this.ccs.armorColor,
  });
  readonly topGuildsByAverageCritChanceData$ = this.generateTopGuildsByAverageAttribute({
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
      | null
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
  } | null> {
    return this.guildStatsApiService.getTopGuildsByAttribute(attribute).pipe(
      map((guilds) => {
        if (guilds.length === 0) {
          return null;
        }
        const names = guilds.map((guild) => guild.name).reverse();
        const combinedAttributes = guilds
        .map((guild) => this.mapAttributeToValue(attribute, guild))
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

  private mapAttributeToValue(attribute: string, guild: Guild): number {
    switch (attribute) {
      case 'health':
        return guild.totalHealth;
      case 'strength':
        return guild.totalStrength;
      case 'agility':
        return guild.totalAgility;
        case 'intelligence':
          return guild.totalIntelligence;
      case 'armor':
        return guild.totalArmor;
      case 'critChance':
        return guild.totalCritChance;
      default:
        throw new Error(`Unknown attribute: ${attribute}`);
    }
  }

  private generateTopGuildsByAverageAttribute({
    attribute,
    label,
    backgroundColor,
  }: TopGuildsByAverageAttributeOptions): Observable<{
    names: string[];
    dataset: ChartConfiguration<'bar'>['data']['datasets'];
  } | null> {
    return combineLatest([
      this.averageCharacterStats$,
      this.guildStatsApiService.getTopGuildsByAverageAttribute(attribute),
    ]).pipe(
      map(([averageCharacterStats, guilds]) => {
        if (guilds.length === 0) {
          return null;
        }
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
