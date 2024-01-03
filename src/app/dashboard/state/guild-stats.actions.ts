import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  BarChartDataset
} from '../interfaces/chart-data.type';

export const guildStatsActions = createActionGroup({
  source: 'Guild Stats',
  events: {
    'Load Top Guilds By Health': emptyProps(),
    'Load Top Guilds By Health Success': props<{
      data: BarChartDataset;
    }>(),
    'Load Top Guilds By Health Failure': emptyProps(),
    'Load Top Guilds By Strength': emptyProps(),
    'Load Top Guilds By Strength Success': props<{
      data: BarChartDataset;
    }>(),
    'Load Top Guilds By Strength Failure': emptyProps(),
    'Load Top Guilds By Agility': emptyProps(),
    'Load Top Guilds By Agility Success': props<{
      data: BarChartDataset;
    }>(),
    'Load Top Guilds By Agility Failure': emptyProps(),
    'Load Top Guilds By Intelligence': emptyProps(),
    'Load Top Guilds By Intelligence Success': props<{
      data: BarChartDataset;
    }>(),
    'Load Top Guilds By Intelligence Failure': emptyProps(),
    'Load Top Guilds By Armor': emptyProps(),
    'Load Top Guilds By Armor Success': props<{
      data: BarChartDataset;
    }>(),
    'Load Top Guilds By Armor Failure': emptyProps(),
    'Load Top Guilds By Crit Chance': emptyProps(),
    'Load Top Guilds By Crit Chance Success': props<{
      data: BarChartDataset;
    }>(),
    'Load Top Guilds By Crit Chance Failure': emptyProps(),
    'Load Top Guilds By Average Health': emptyProps(),
    'Load Top Guilds By Average Health Success': props<{
      data: BarChartDataset;
    }>(),
    'Load Top Guilds By Average Health Failure': emptyProps(),
    'Load Top Guilds By Average Strength': emptyProps(),
    'Load Top Guilds By Average Strength Success': props<{
      data: BarChartDataset;
    }>(),
    'Load Top Guilds By Average Strength Failure': emptyProps(),
    'Load Top Guilds By Average Agility': emptyProps(),
    'Load Top Guilds By Average Agility Success': props<{
      data: BarChartDataset;
    }>(),
    'Load Top Guilds By Average Agility Failure': emptyProps(),
    'Load Top Guilds By Average Intelligence': emptyProps(),
    'Load Top Guilds By Average Intelligence Success': props<{
      data: BarChartDataset;
    }>(),
    'Load Top Guilds By Average Intelligence Failure': emptyProps(),
    'Load Top Guilds By Average Armor': emptyProps(),
    'Load Top Guilds By Average Armor Success': props<{
      data: BarChartDataset;
    }>(),
    'Load Top Guilds By Average Armor Failure': emptyProps(),
    'Load Top Guilds By Average Crit Chance': emptyProps(),
    'Load Top Guilds By Average Crit Chance Success': props<{
      data: BarChartDataset;
    }>(),
    'Load Top Guilds By Average Crit Chance Failure': emptyProps(),
    'Load Top Well Rounded Guilds': emptyProps(),
    'Load Top Well Rounded Guilds Success': props<{
      data: BarChartDataset;
    }>(),
    'Load Top Well Rounded Guilds Failure': emptyProps(),
  },
});
