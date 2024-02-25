import { Guild } from '../../shared/interfaces/guild.interface';

export interface WellRoundedGuild extends Guild {
  membersAverage: number;
}
