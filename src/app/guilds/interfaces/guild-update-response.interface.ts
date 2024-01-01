import { Guild } from 'src/app/shared/interfaces/guild.interface';

export interface GuildUpdateResponse {
  message: string;
  guild: Guild;
}
