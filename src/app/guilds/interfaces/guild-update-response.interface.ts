import { Guild } from '../../shared/interfaces/guild.interface';

export interface GuildUpdateResponse {
  message: string;
  guild: Guild;
}
