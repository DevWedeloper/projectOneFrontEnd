import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  PolarChartDataset,
  BarChartDataset,
  RadarChartDataset,
} from '../interfaces/chart-data.type';
import { WellRoundedCharacter } from '../interfaces/well-rounded-character.interface';

export const characterStatsActions = createActionGroup({
  source: 'Character Stats',
  events: {
    'Load Top Characters By Health': emptyProps(),
    'Load Top Characters By Health Success': props<{
      data: BarChartDataset;
    }>(),
    'Load Top Characters By Health Failure': emptyProps(),
    'Load Top Characters By Strength': emptyProps(),
    'Load Top Characters By Strength Success': props<{
      data: BarChartDataset;
    }>(),
    'Load Top Characters By Strength Failure': emptyProps(),
    'Load Top Characters By Agility': emptyProps(),
    'Load Top Characters By Agility Success': props<{
      data: BarChartDataset;
    }>(),
    'Load Top Characters By Agility Failure': emptyProps(),
    'Load Top Characters By Intelligence': emptyProps(),
    'Load Top Characters By Intelligence Success': props<{
      data: BarChartDataset;
    }>(),
    'Load Top Characters By Intelligence Failure': emptyProps(),
    'Load Top Characters By Armor': emptyProps(),
    'Load Top Characters By Armor Success': props<{
      data: BarChartDataset;
    }>(),
    'Load Top Characters By Armor Failure': emptyProps(),
    'Load Top Characters By Crit Chance': emptyProps(),
    'Load Top Characters By Crit Chance Success': props<{
      data: BarChartDataset;
    }>(),
    'Load Top Characters By Crit Chance Failure': emptyProps(),
    'Load Top Well Rounded Characters': emptyProps(),
    'Load Top Well Rounded Characters Success': props<{
      data: WellRoundedCharacter[] | null;
    }>(),
    'Load Top Well Rounded Characters Failure': emptyProps(),
    'Load Radar Chart Data Set': props<{
      character: WellRoundedCharacter | null;
    }>(),
    'Load Radar Chart Data Set Success': props<{
      data: RadarChartDataset;
    }>(),
    'Load Radar Chart Data Set Failure': emptyProps(),
    'Load Character Distribution By Type': emptyProps(),
    'Load Character Distribution By Type Success': props<{
      data: PolarChartDataset;
    }>(),
    'Select Top Well Rounded Character': props<{
      character: WellRoundedCharacter | null;
    }>(),
    'Load Character Distribution By Type Failure': emptyProps(),
  },
});
