import { Character } from '../../shared/interfaces/character.interface';

export interface CharacterPagination {
  page: number;
  pageSize: number;
  totalPages: number;
  totalCharacters: number;
  characters: Character[];
}
