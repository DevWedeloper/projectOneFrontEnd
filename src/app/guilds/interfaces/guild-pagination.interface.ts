import { Guild } from '../../shared/interfaces/guild.interface';

export interface GuildPagination {
  page: number;
  pageSize: number;
  totalPages: number;
  totalGuilds: number;
  guilds: Guild[];
}
