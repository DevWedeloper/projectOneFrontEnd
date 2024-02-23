import { Guild } from '../../shared/interfaces/guild.interface';

export interface AverageGuildStats extends Guild {
  averageAttribute: number;
}
