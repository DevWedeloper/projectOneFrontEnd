import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { QueryParams } from 'src/app/shared/interfaces/query-params.interface';
import { GuildPagination } from '../interfaces/guild-pagination.interface';
import { GuildSortParams } from '../interfaces/guild-sort-params.interface';

export const guildTableActions = createActionGroup({
  source: 'Guild Table',
  events: {
    'Load Guilds': emptyProps(),
    'Load Guilds Success': props<{ guildData: GuildPagination }>(),
    'Load Guilds Failure': emptyProps(),
    'Set Current Page': props<{ page: number }>(),
    'Set Page Size': props<{ pageSize: number }>(),
    'Set Sort Params': props<{ sortParams: GuildSortParams }>(),
    'Set Search Query': props<{ searchQuery: string }>(),
    'Set Name Filter': props<{ name: string | undefined }>(),
    'Set All Parameters': props<{
      page: number;
      pageSize: number;
      sortParams: GuildSortParams;
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
