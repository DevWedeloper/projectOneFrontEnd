export interface CharacterSortParams {
  sortBy:
    | 'name'
    | 'guild'
    | 'characterType'
    | 'health'
    | 'strength'
    | 'agility'
    | 'intelligence'
    | 'armor'
    | 'critChance';
  sortOrder: 'asc' | 'desc';
}
