import { Guild } from 'src/app/shared/interfaces/guild.interface';

export interface AverageGuildStats extends Guild {
  averageAttribute: number;
}
