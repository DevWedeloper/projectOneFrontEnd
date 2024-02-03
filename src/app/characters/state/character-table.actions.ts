import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { QueryParams } from 'src/app/shared/interfaces/query-params.interface';
import { CharacterPagination } from '../interfaces/character-pagination.interface';
import { CharacterSortParams } from '../interfaces/character-sort-params.interface';

export const characterTableActions = createActionGroup({
  source: 'Character Table',
  events: {
    'Load Characters': emptyProps(),
    'Load Characters Success': props<{ characterData: CharacterPagination }>(),
    'Load Characters Failure': emptyProps(),
    'Set Current Page': props<{ page: number }>(),
    'Set Page Size': props<{ pageSize: number }>(),
    'Set Sort Params': props<{ sortParams: CharacterSortParams }>(),
    'Set Search Query': props<{ searchQuery: string }>(),
    'Set Name Filter': props<{ name: string | undefined }>(),
    'Set All Parameters': props<{
      page: number;
      pageSize: number;
      sortParams: CharacterSortParams;
      searchQuery: string;
      name: string | undefined;
    }>(),
    'Set Page Number and Search Query': props<{
      page: number;
      searchQuery: string;
    }>(),
    'Redirect User Success': props<{ queryParams: QueryParams }>(),
    'Redirect User Failure': emptyProps(),
    'All Observables Loaded': emptyProps(),
    'Reset State On Destroy': emptyProps(),
  },
});
