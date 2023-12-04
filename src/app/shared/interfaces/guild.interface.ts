import { Character } from './character.interface';

export interface Guild {
  _id: string;
  name: string;
  leader: Character;
  members: Character[];
  totalMembers: number;
  maxMembers: number;
  totalHealth: number;
  totalStrength: number;
  totalAgility: number;
  totalIntelligence: number;
  totalArmor: number;
  totalCritChance: number;
}
