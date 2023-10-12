import { Guild } from 'src/app/shared/interfaces/guild.interface';

export interface WellRoundedGuild extends Guild {
  membersAverage: number;
}
