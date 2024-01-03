import { createFeature, createReducer, on } from '@ngrx/store';
import { BarChartDataset } from '../interfaces/chart-data.type';
import { guildStatsActions } from './guild-stats.actions';

type Status = 'pending' | 'loading' | 'error' | 'success';

type GuildStatsState = {
  topGuildsByHealth: BarChartDataset;
  topGuildsByHealthStatus: Status;
  topGuildsByStrength: BarChartDataset;
  topGuildsByStrengthStatus: Status;
  topGuildsByAgility: BarChartDataset;
  topGuildsByAgilityStatus: Status;
  topGuildsByIntelligence: BarChartDataset;
  topGuildsByIntelligenceStatus: Status;
  topGuildsByArmor: BarChartDataset;
  topGuildsByArmorStatus: Status;
  topGuildsByCritChance: BarChartDataset;
  topGuildsByCritChanceStatus: Status;
  topGuildsByAverageHealth: BarChartDataset;
  topGuildsByAverageHealthStatus: Status;
  topGuildsByAverageStrength: BarChartDataset;
  topGuildsByAverageStrengthStatus: Status;
  topGuildsByAverageAgility: BarChartDataset;
  topGuildsByAverageAgilityStatus: Status;
  topGuildsByAverageIntelligence: BarChartDataset;
  topGuildsByAverageIntelligenceStatus: Status;
  topGuildsByAverageArmor: BarChartDataset;
  topGuildsByAverageArmorStatus: Status;
  topGuildsByAverageCritChance: BarChartDataset;
  topGuildsByAverageCritChanceStatus: Status;
  topWellRoundedGuilds: BarChartDataset;
  topWellRoundedGuildsStatus: Status;
};

const initialState: GuildStatsState = {
  topGuildsByHealth: null,
  topGuildsByHealthStatus: 'pending',
  topGuildsByStrength: null,
  topGuildsByStrengthStatus: 'pending',
  topGuildsByAgility: null,
  topGuildsByAgilityStatus: 'pending',
  topGuildsByIntelligence: null,
  topGuildsByIntelligenceStatus: 'pending',
  topGuildsByArmor: null,
  topGuildsByArmorStatus: 'pending',
  topGuildsByCritChance: null,
  topGuildsByCritChanceStatus: 'pending',
  topGuildsByAverageHealth: null,
  topGuildsByAverageHealthStatus: 'pending',
  topGuildsByAverageStrength: null,
  topGuildsByAverageStrengthStatus: 'pending',
  topGuildsByAverageAgility: null,
  topGuildsByAverageAgilityStatus: 'pending',
  topGuildsByAverageIntelligence: null,
  topGuildsByAverageIntelligenceStatus: 'pending',
  topGuildsByAverageArmor: null,
  topGuildsByAverageArmorStatus: 'pending',
  topGuildsByAverageCritChance: null,
  topGuildsByAverageCritChanceStatus: 'pending',
  topWellRoundedGuilds: null,
  topWellRoundedGuildsStatus: 'pending',
};

const guildStatsFeature = createFeature({
  name: 'Guild Stats',
  reducer: createReducer(
    initialState,
    on(guildStatsActions.loadTopGuildsByHealth, (state) => ({
      ...state,
      topGuildsByHealthStatus: 'loading' as const,
    })),
    on(guildStatsActions.loadTopGuildsByHealthSuccess, (state, action) => ({
      ...state,
      topGuildsByHealth: action.data,
      topGuildsByHealthStatus: 'success' as const,
    })),
    on(guildStatsActions.loadTopGuildsByHealthFailure, (state) => ({
      ...state,
      topGuildsByHealth: null,
      topGuildsByHealthStatus: 'error' as const,
    })),
    on(guildStatsActions.loadTopGuildsByStrength, (state) => ({
      ...state,
      topGuildsByStrengthStatus: 'loading' as const,
    })),
    on(guildStatsActions.loadTopGuildsByStrengthSuccess, (state, action) => ({
      ...state,
      topGuildsByStrength: action.data,
      topGuildsByStrengthStatus: 'success' as const,
    })),
    on(guildStatsActions.loadTopGuildsByStrengthFailure, (state) => ({
      ...state,
      topGuildsByStrength: null,
      topGuildsByStrengthStatus: 'error' as const,
    })),
    on(guildStatsActions.loadTopGuildsByAgility, (state) => ({
      ...state,
      topGuildsByAgilityStatus: 'loading' as const,
    })),
    on(guildStatsActions.loadTopGuildsByAgilitySuccess, (state, action) => ({
      ...state,
      topGuildsByAgility: action.data,
      topGuildsByAgilityStatus: 'success' as const,
    })),
    on(guildStatsActions.loadTopGuildsByAgilityFailure, (state) => ({
      ...state,
      topGuildsByAgility: null,
      topGuildsByAgilityStatus: 'error' as const,
    })),
    on(guildStatsActions.loadTopGuildsByIntelligence, (state) => ({
      ...state,
      topGuildsByIntelligenceStatus: 'loading' as const,
    })),
    on(
      guildStatsActions.loadTopGuildsByIntelligenceSuccess,
      (state, action) => ({
        ...state,
        topGuildsByIntelligence: action.data,
        topGuildsByIntelligenceStatus: 'success' as const,
      }),
    ),
    on(guildStatsActions.loadTopGuildsByIntelligenceFailure, (state) => ({
      ...state,
      topGuildsByIntelligence: null,
      topGuildsByIntelligenceStatus: 'error' as const,
    })),
    on(guildStatsActions.loadTopGuildsByArmor, (state) => ({
      ...state,
      topGuildsByArmorStatus: 'loading' as const,
    })),
    on(guildStatsActions.loadTopGuildsByArmorSuccess, (state, action) => ({
      ...state,
      topGuildsByArmor: action.data,
      topGuildsByArmorStatus: 'success' as const,
    })),
    on(guildStatsActions.loadTopGuildsByArmorFailure, (state) => ({
      ...state,
      topGuildsByArmor: null,
      topGuildsByArmorStatus: 'error' as const,
    })),
    on(guildStatsActions.loadTopGuildsByCritChance, (state) => ({
      ...state,
      topGuildsByCritChanceStatus: 'loading' as const,
    })),
    on(guildStatsActions.loadTopGuildsByCritChanceSuccess, (state, action) => ({
      ...state,
      topGuildsByCritChance: action.data,
      topGuildsByCritChanceStatus: 'success' as const,
    })),
    on(guildStatsActions.loadTopGuildsByCritChanceFailure, (state) => ({
      ...state,
      topGuildsByCritChance: null,
      topGuildsByCritChanceStatus: 'error' as const,
    })),
    on(guildStatsActions.loadTopGuildsByAverageHealth, (state) => ({
      ...state,
      topGuildsByAverageHealthStatus: 'loading' as const,
    })),
    on(
      guildStatsActions.loadTopGuildsByAverageHealthSuccess,
      (state, action) => ({
        ...state,
        topGuildsByAverageHealth: action.data,
        topGuildsByAverageHealthStatus: 'success' as const,
      }),
    ),
    on(guildStatsActions.loadTopGuildsByAverageHealthFailure, (state) => ({
      ...state,
      topGuildsByAverageHealth: null,
      topGuildsByAverageHealthStatus: 'error' as const,
    })),
    on(guildStatsActions.loadTopGuildsByAverageStrength, (state) => ({
      ...state,
      topGuildsByAverageStrengthStatus: 'loading' as const,
    })),
    on(
      guildStatsActions.loadTopGuildsByAverageStrengthSuccess,
      (state, action) => ({
        ...state,
        topGuildsByAverageStrength: action.data,
        topGuildsByAverageStrengthStatus: 'success' as const,
      }),
    ),
    on(guildStatsActions.loadTopGuildsByAverageStrengthFailure, (state) => ({
      ...state,
      topGuildsByAverageStrength: null,
      topGuildsByAverageStrengthStatus: 'error' as const,
    })),
    on(guildStatsActions.loadTopGuildsByAverageAgility, (state) => ({
      ...state,
      topGuildsByAverageAgilityStatus: 'loading' as const,
    })),
    on(
      guildStatsActions.loadTopGuildsByAverageAgilitySuccess,
      (state, action) => ({
        ...state,
        topGuildsByAverageAgility: action.data,
        topGuildsByAverageAgilityStatus: 'success' as const,
      }),
    ),
    on(guildStatsActions.loadTopGuildsByAverageAgilityFailure, (state) => ({
      ...state,
      topGuildsByAverageAgility: null,
      topGuildsByAverageAgilityStatus: 'error' as const,
    })),
    on(guildStatsActions.loadTopGuildsByAverageIntelligence, (state) => ({
      ...state,
      topGuildsByAverageIntelligenceStatus: 'loading' as const,
    })),
    on(
      guildStatsActions.loadTopGuildsByAverageIntelligenceSuccess,
      (state, action) => ({
        ...state,
        topGuildsByAverageIntelligence: action.data,
        topGuildsByAverageIntelligenceStatus: 'success' as const,
      }),
    ),
    on(
      guildStatsActions.loadTopGuildsByAverageIntelligenceFailure,
      (state) => ({
        ...state,
        topGuildsByAverageIntelligence: null,
        topGuildsByAverageIntelligenceStatus: 'error' as const,
      }),
    ),
    on(guildStatsActions.loadTopGuildsByAverageArmor, (state) => ({
      ...state,
      topGuildsByAverageArmorStatus: 'loading' as const,
    })),
    on(
      guildStatsActions.loadTopGuildsByAverageArmorSuccess,
      (state, action) => ({
        ...state,
        topGuildsByAverageArmor: action.data,
        topGuildsByAverageArmorStatus: 'success' as const,
      }),
    ),
    on(guildStatsActions.loadTopGuildsByAverageArmorFailure, (state) => ({
      ...state,
      topGuildsByAverageArmor: null,
      topGuildsByAverageArmorStatus: 'error' as const,
    })),
    on(guildStatsActions.loadTopGuildsByAverageCritChance, (state) => ({
      ...state,
      topGuildsByAverageCritChanceStatus: 'loading' as const,
    })),
    on(
      guildStatsActions.loadTopGuildsByAverageCritChanceSuccess,
      (state, action) => ({
        ...state,
        topGuildsByAverageCritChance: action.data,
        topGuildsByAverageCritChanceStatus: 'success' as const,
      }),
    ),
    on(guildStatsActions.loadTopGuildsByAverageCritChanceFailure, (state) => ({
      ...state,
      topGuildsByAverageCritChance: null,
      topGuildsByAverageCritChanceStatus: 'error' as const,
    })),
    on(guildStatsActions.loadTopWellRoundedGuilds, (state) => ({
      ...state,
      topWellRoundedGuildsStatus: 'loading' as const,
    })),
    on(
      guildStatsActions.loadTopWellRoundedGuildsSuccess,
      (state, action) => ({
        ...state,
        topWellRoundedGuilds: action.data,
        topWellRoundedGuildsStatus: 'success' as const,
      }),
    ),
    on(guildStatsActions.loadTopWellRoundedGuildsFailure, (state) => ({
      ...state,
      topWellRoundedGuilds: null,
      topWellRoundedGuildsStatus: 'error' as const,
    })),
  ),
});

export const {
  name: guildStatsFeatureKey,
  reducer: guildStatsReducer,
  selectTopGuildsByHealth,
  selectTopGuildsByStrength,
  selectTopGuildsByAgility,
  selectTopGuildsByIntelligence,
  selectTopGuildsByArmor,
  selectTopGuildsByCritChance,
  selectTopGuildsByAverageHealth,
  selectTopGuildsByAverageStrength,
  selectTopGuildsByAverageAgility,
  selectTopGuildsByAverageIntelligence,
  selectTopGuildsByAverageArmor,
  selectTopGuildsByAverageCritChance,
  selectTopWellRoundedGuilds,
} = guildStatsFeature;
