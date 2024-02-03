import { createFeature, createReducer, on } from '@ngrx/store';
import { GuildPagination } from '../interfaces/guild-pagination.interface';
import { GuildSortParams } from '../interfaces/guild-sort-params.interface';
import { guildTableActions } from './guild-table.actions';

type GuildTableState = {
  currentPage: number;
  pageSize: number;
  sortParams: GuildSortParams;
  searchQuery: string;
  name: string | undefined;
  guildData: GuildPagination | null;
  isFetching: boolean;
  initialLoading: boolean;
};

const initialState: GuildTableState = {
  currentPage: 1,
  pageSize: 10,
  sortParams: { sortBy: 'name', sortOrder: 'asc' },
  searchQuery: '',
  name: undefined,
  guildData: null,
  isFetching: false,
  initialLoading: true,
};

const guildTableFeature = createFeature({
  name: 'Guild Table',
  reducer: createReducer(
    initialState,
    on(guildTableActions.loadGuilds, (state) => ({
      ...state,
      isFetching: true,
    })),
    on(guildTableActions.loadGuildsSuccess, (state, action) => ({
      ...state,
      guildData: action.guildData,
      isFetching: false,
    })),
    on(guildTableActions.loadGuildsFailure, (state) => ({
      ...state,
      guildData: null,
      isFetching: false,
    })),
    on(guildTableActions.setCurrentPage, (state, action) => ({
      ...state,
      currentPage: action.page,
    })),
    on(guildTableActions.setPageSize, (state, action) => ({
      ...state,
      pageSize: action.pageSize,
    })),
    on(guildTableActions.setSortParams, (state, action) => ({
      ...state,
      sortParams: action.sortParams,
    })),
    on(guildTableActions.setSearchQuery, (state, action) => ({
      ...state,
      searchQuery: action.searchQuery,
    })),
    on(guildTableActions.setNameFilter, (state, action) => ({
      ...state,
      name: action.name,
    })),
    on(guildTableActions.setAllParameters, (state, action) => ({
      ...state,
      currentPage: action.page,
      pageSize: action.pageSize,
      sortParams: action.sortParams,
      searchQuery: action.searchQuery,
      name: action.name,
    })),
    on(guildTableActions.setPageNumberAndSearchQuery, (state, action) => ({
      ...state,
      page: action.page,
      searchQuery: action.searchQuery,
    })),
    on(guildTableActions.allObservablesLoaded, (state) => ({
      ...state,
      initialLoading: false,
    })),
    on(guildTableActions.resetStateOnDestroy, () => ({
      ...initialState,
    })),
  ),
});

export const {
  name: guildTableFeatureKey,
  reducer: guildTableReducer,
  selectCurrentPage,
  selectPageSize,
  selectSortParams,
  selectSearchQuery,
  selectName,
  selectGuildData,
  selectInitialLoading,
} = guildTableFeature;
