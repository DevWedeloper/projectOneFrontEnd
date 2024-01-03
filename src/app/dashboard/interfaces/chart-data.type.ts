import { ChartConfiguration, ChartDataset } from 'chart.js';

export type BarChartDataset = {
  names: string[];
  dataset: ChartConfiguration<'bar'>['data']['datasets'];
} | null;

export type RadarChartDataset = {
  labels: string[];
  dataset: ChartDataset<'radar', (number | null)[]>[];
} | null;

export type PolarChartDataset = {
  ids: string[];
  dataset: ChartDataset<'polarArea', number[]>[];
} | null;
