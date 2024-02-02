import { Injectable, inject } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { Observable, combineLatest, map } from 'rxjs';
import { Guild } from 'src/app/shared/interfaces/guild.interface';
import { AverageCharacterStats } from '../interfaces/character-average-interface';
import { CharacterStatsApiService } from './character-stats-api.service';
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

  generateTopGuildsByAttribute({
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
      }),
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

  generateTopGuildsByAverageAttribute({
    attribute,
    label,
    backgroundColor,
  }: TopGuildsByAverageAttributeOptions): Observable<{
    names: string[];
    dataset: ChartConfiguration<'bar'>['data']['datasets'];
  } | null> {
    return combineLatest([
      this.characterStatsApiService.getAverageCharacterStats(),
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
      }),
    );
  }
}
