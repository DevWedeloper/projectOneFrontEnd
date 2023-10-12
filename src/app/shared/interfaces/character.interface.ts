import { Guild } from './guild.interface';

export interface Character {
  _id: string;
  name: string;
  characterType: string;
  health: number;
  strength: number;
  agility: number;
  intelligence: number;
  armor: number;
  critChance: number;
  guild: Guild | null;
}
