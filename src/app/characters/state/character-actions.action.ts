import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Character } from '../../shared/interfaces/character.interface';
import { CharacterType } from '../interfaces/character-type.interface';

export const characterActionsActions = createActionGroup({
  source: 'Character Actions',
  events: {
    'Create Character': props<{ character: Character }>(),
    'Create Character Success': emptyProps(),
    'Create Character Failure': emptyProps(),
    'Update Character': props<{
      character: Character;
      previousCharacterData: Character;
    }>(),
    'Update Character Success': props<{ selectedCharacter: Character }>(),
    'Update Character Failure': emptyProps(),
    'Join Guild': props<{ character: Character; guildName: string }>(),
    'Join Guild Cancel': emptyProps(),
    'Join Guild Success': props<{ selectedCharacter: Character }>(),
    'Join Guild Failure': emptyProps(),
    'Leave Guild': props<{ character: Character }>(),
    'Leave Guild Cancel': emptyProps(),
    'Leave Guild Success': props<{ selectedCharacter: Character }>(),
    'Leave Guild Failure': emptyProps(),
    'Delete Character': props<{ character: Character }>(),
    'Delete Character Cancel': emptyProps(),
    'Delete Character Success': emptyProps(),
    'Delete Character Failure': emptyProps(),
    'Update Selected Character': props<{
      selectedCharacter: Character | null;
    }>(),
    'Load Character Types': emptyProps(),
    'Load Character Types Success': props<{
      characterTypes: CharacterType[];
    }>(),
    'Load Character Types Failure': emptyProps(),
    'Reset State On Destroy': emptyProps(),
  },
});
