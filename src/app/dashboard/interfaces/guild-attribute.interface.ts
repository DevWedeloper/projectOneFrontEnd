import { Guild } from 'src/app/shared/interfaces/guild.interface';

export interface GuildAttribute extends Guild {
  combinedAttribute: number;
}
