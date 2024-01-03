import { createFeature, createReducer, on } from '@ngrx/store';
import {
  PolarChartDataset,
  BarChartDataset,
  RadarChartDataset,
} from '../interfaces/chart-data.type';
import { characterStatsActions } from './character-stats.actions';
import { WellRoundedCharacter } from '../interfaces/well-rounded-character.interface';

type Status = 'pending' | 'loading' | 'error' | 'success';

type CharacterStatsState = {
  topCharactersByHealth: BarChartDataset;
  topCharactersByHealthStatus: Status;
  topCharactersByStrength: BarChartDataset;
  topCharactersByStrengthStatus: Status;
  topCharactersByAgility: BarChartDataset;
  topCharactersByAgilityStatus: Status;
  topCharactersByIntelligence: BarChartDataset;
  topCharactersByIntelligenceStatus: Status;
  topCharactersByArmor: BarChartDataset;
  topCharactersByArmorStatus: Status;
  topCharactersByCritChance: BarChartDataset;
  topCharactersByCritChanceStatus: Status;
  topWellRoundedCharacters: WellRoundedCharacter[] | null;
  topWellRoundedCharactersStatus: Status;
  radarChartDataset: RadarChartDataset;
  radarChartDatasetStatus: Status;
  radarChartCharacter: WellRoundedCharacter | null;
  characterDistributionByType: PolarChartDataset;
  characterDistributionByTypeStatus: Status;
};

const initialState: CharacterStatsState = {
  topCharactersByHealth: null,
  topCharactersByHealthStatus: 'pending',
  topCharactersByStrength: null,
  topCharactersByStrengthStatus: 'pending',
  topCharactersByAgility: null,
  topCharactersByAgilityStatus: 'pending',
  topCharactersByIntelligence: null,
  topCharactersByIntelligenceStatus: 'pending',
  topCharactersByArmor: null,
  topCharactersByArmorStatus: 'pending',
  topCharactersByCritChance: null,
  topCharactersByCritChanceStatus: 'pending',
  topWellRoundedCharacters: null,
  topWellRoundedCharactersStatus: 'pending',
  radarChartDataset: null,
  radarChartDatasetStatus: 'pending',
  radarChartCharacter: null,
  characterDistributionByType: null,
  characterDistributionByTypeStatus: 'pending',
};

const characterStatsFeature = createFeature({
  name: 'Character Stats',
  reducer: createReducer(
    initialState,
    on(characterStatsActions.loadTopCharactersByHealth, (state) => ({
      ...state,
      topCharactersByHealthStatus: 'loading' as const,
    })),
    on(
      characterStatsActions.loadTopCharactersByHealthSuccess,
      (state, action) => ({
        ...state,
        topCharactersByHealth: action.data,
        topCharactersByHealthStatus: 'success' as const,
      }),
    ),
    on(characterStatsActions.loadTopCharactersByHealthFailure, (state) => ({
      ...state,
      topCharactersByHealth: null,
      topCharactersByHealthStatus: 'error' as const,
    })),
    on(characterStatsActions.loadTopCharactersByStrength, (state) => ({
      ...state,
      topCharactersByStrengthStatus: 'loading' as const,
    })),
    on(
      characterStatsActions.loadTopCharactersByStrengthSuccess,
      (state, action) => ({
        ...state,
        topCharactersByStrength: action.data,
        topCharactersByStrengthStatus: 'success' as const,
      }),
    ),
    on(characterStatsActions.loadTopCharactersByStrengthFailure, (state) => ({
      ...state,
      topCharactersByStrength: null,
      topCharactersByStrengthStatus: 'error' as const,
    })),
    on(characterStatsActions.loadTopCharactersByAgility, (state) => ({
      ...state,
      topCharactersByAgilityStatus: 'loading' as const,
    })),
    on(
      characterStatsActions.loadTopCharactersByAgilitySuccess,
      (state, action) => ({
        ...state,
        topCharactersByAgility: action.data,
        topCharactersByAgilityStatus: 'success' as const,
      }),
    ),
    on(characterStatsActions.loadTopCharactersByAgilityFailure, (state) => ({
      ...state,
      topCharactersByAgility: null,
      topCharactersByAgilityStatus: 'error' as const,
    })),
    on(characterStatsActions.loadTopCharactersByIntelligence, (state) => ({
      ...state,
      topCharactersByIntelligenceStatus: 'loading' as const,
    })),
    on(
      characterStatsActions.loadTopCharactersByIntelligenceSuccess,
      (state, action) => ({
        ...state,
        topCharactersByIntelligence: action.data,
        topCharactersByIntelligenceStatus: 'success' as const,
      }),
    ),
    on(
      characterStatsActions.loadTopCharactersByIntelligenceFailure,
      (state) => ({
        ...state,
        topCharactersByIntelligence: null,
        topCharactersByIntelligenceStatus: 'error' as const,
      }),
    ),
    on(characterStatsActions.loadTopCharactersByArmor, (state) => ({
      ...state,
      topCharactersByArmorStatus: 'loading' as const,
    })),
    on(
      characterStatsActions.loadTopCharactersByArmorSuccess,
      (state, action) => ({
        ...state,
        topCharactersByArmor: action.data,
        topCharactersByArmorStatus: 'success' as const,
      }),
    ),
    on(characterStatsActions.loadTopCharactersByArmorFailure, (state) => ({
      ...state,
      topCharactersByArmor: null,
      topCharactersByArmorStatus: 'error' as const,
    })),
    on(characterStatsActions.loadTopCharactersByCritChance, (state) => ({
      ...state,
      topCharactersByCritChanceStatus: 'loading' as const,
    })),
    on(
      characterStatsActions.loadTopCharactersByCritChanceSuccess,
      (state, action) => ({
        ...state,
        topCharactersByCritChance: action.data,
        topCharactersByCritChanceStatus: 'success' as const,
      }),
    ),
    on(characterStatsActions.loadTopCharactersByCritChanceFailure, (state) => ({
      ...state,
      topCharactersByCritChance: null,
      topCharactersByCritChanceStatus: 'error' as const,
    })),
    on(characterStatsActions.loadTopWellRoundedCharacters, (state) => ({
      ...state,
      topWellRoundedCharactersStatus: 'loading' as const,
    })),
    on(
      characterStatsActions.loadTopWellRoundedCharactersSuccess,
      (state, action) => ({
        ...state,
        topWellRoundedCharacters: action.data,
        topWellRoundedCharactersStatus: 'success' as const,
      }),
    ),
    on(characterStatsActions.loadTopWellRoundedCharactersFailure, (state) => ({
      ...state,
      topWellRoundedCharacters: null,
      topWellRoundedCharactersStatus: 'error' as const,
    })),
    on(characterStatsActions.loadRadarChartDataSet, (state) => ({
      ...state,
      radarChartDatasetStatus: 'loading' as const,
    })),
    on(characterStatsActions.loadRadarChartDataSetSuccess, (state, action) => ({
      ...state,
      radarChartDataset: action.data,
      radarChartDatasetStatus: 'success' as const,
    })),
    on(characterStatsActions.loadRadarChartDataSetFailure, (state) => ({
      ...state,
      radarChartDataset: null,
      radarChartDatasetStatus: 'error' as const,
    })),
    on(
      characterStatsActions.selectTopWellRoundedCharacter,
      (state, action) => ({
        ...state,
        radarChartCharacter: action.character,
      }),
    ),
    on(characterStatsActions.loadCharacterDistributionByType, (state) => ({
      ...state,
      characterDistributionByTypeStatus: 'loading' as const,
    })),
    on(
      characterStatsActions.loadCharacterDistributionByTypeSuccess,
      (state, action) => ({
        ...state,
        characterDistributionByType: action.data,
        characterDistributionByTypeStatus: 'success' as const,
      }),
    ),
    on(
      characterStatsActions.loadCharacterDistributionByTypeFailure,
      (state) => ({
        ...state,
        characterDistributionByType: null,
        characterDistributionByTypeStatus: 'error' as const,
      }),
    ),
  ),
});

export const {
  name: characterStatsFeatureKey,
  reducer: characterStatsReducer,
  selectTopCharactersByHealth,
  selectTopCharactersByStrength,
  selectTopCharactersByAgility,
  selectTopCharactersByIntelligence,
  selectTopCharactersByArmor,
  selectTopCharactersByCritChance,
  selectTopWellRoundedCharacters,
  selectRadarChartDataset,
  selectRadarChartCharacter,
  selectCharacterDistributionByType,
} = characterStatsFeature;
