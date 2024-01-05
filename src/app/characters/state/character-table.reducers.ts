import { createFeature, createReducer, on } from '@ngrx/store';
import { CharacterPagination } from '../interfaces/character-pagination.interface';
import { CharacterSortParams } from '../interfaces/character-sort-params.interface';
import { characterTableActions } from './character-table.actions';

type CharacterTableState = {
  currentPage: number;
  pageSize: number;
  sortParams: CharacterSortParams;
  searchQuery: string;
  name: string | undefined;
  characterData: CharacterPagination | null;
  isFetching: boolean;
  initialLoading: boolean;
};

const initialState: CharacterTableState = {
  currentPage: 1,
  pageSize: 10,
  sortParams: { sortBy: 'name', sortOrder: 'asc' },
  searchQuery: '',
  name: undefined,
  characterData: null,
  isFetching: false,
  initialLoading: true,
};

const characterTableFeature = createFeature({
  name: 'Character Table',
  reducer: createReducer(
    initialState,
    on(characterTableActions.loadCharacters, (state) => ({
      ...state,
      isFetching: true,
    })),
    on(characterTableActions.loadCharactersSuccess, (state, action) => ({
      ...state,
      characterData: action.characterData,
      isFetching: false,
    })),
    on(characterTableActions.loadCharactersFailure, (state) => ({
      ...state,
      characterData: null,
      isFetching: false,
    })),
    on(characterTableActions.setCurrentPage, (state, action) => ({
      ...state,
      currentPage: action.page,
    })),
    on(characterTableActions.setPageSize, (state, action) => ({
      ...state,
      pageSize: action.pageSize,
    })),
    on(characterTableActions.setSortParams, (state, action) => ({
      ...state,
      sortParams: action.sortParams,
    })),
    on(characterTableActions.setSearchQuery, (state, action) => ({
      ...state,
      searchQuery: action.searchQuery,
    })),
    on(characterTableActions.setNameFilter, (state, action) => ({
      ...state,
      name: action.name,
    })),
    on(characterTableActions.setAllParameters, (state, action) => ({
      ...state,
      currentPage: action.page,
      pageSize: action.pageSize,
      sortParams: action.sortParams,
      searchQuery: action.searchQuery,
      name: action.name,
    })),
    on(characterTableActions.setPageNumberAndSearchQuery, (state, action) => ({
      ...state,
      page: action.page,
      searchQuery: action.searchQuery,
    })),
    on(characterTableActions.allObservablesLoaded, (state) => ({
      ...state,
      initialLoading: false,
    })),
  ),
});

export const {
  name: characterTableFeatureKey,
  reducer: characterTableReducer,
  selectCurrentPage,
  selectPageSize,
  selectSortParams,
  selectSearchQuery,
  selectName,
  selectCharacterData,
  selectInitialLoading,
} = characterTableFeature;
