import { Character } from './character.interface';

export interface Guild {
  _id: string;
  name: string;
  leader: Character;
  members: Character[];
  totalMembers: number;
}
