import { Character } from 'src/app/shared/interfaces/character.interface';

export interface CharacterUpdateResponse {
  message: string;
  character: Character;
}
