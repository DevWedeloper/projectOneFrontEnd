import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Character } from 'src/app/shared/interfaces/character.interface';
import { Guild } from 'src/app/shared/interfaces/guild.interface';

export const guildActionsActions = createActionGroup({
  source: 'Guild Actions',
  events: {
    'Create Guild': props<{ name: string; leader: string }>(),
    'Create Guild Cancel': emptyProps(),
    'Create Guild Success': emptyProps(),
    'Create Guild Failure': emptyProps(),
    'Update Guild Name': props<{ guildId: string; name: string }>(),
    'Update Guild Name Success': props<{
      selectedGuild: Guild | null;
    }>(),
    'Update Guild Name Failure': emptyProps(),
    'Update Guild Leader': props<{ guildId: string; leaderId: string }>(),
    'Update Guild Leader Success': props<{
      selectedGuild: Guild | null;
    }>(),
    'Update Guild Leader Failure': emptyProps(),
    'Add Member': props<{ guild: Guild; member: string }>(),
    'Add Member Cancel': emptyProps(),
    'Add Member Success': props<{
      selectedGuild: Guild | null;
    }>(),
    'Add Member Failure': emptyProps(),
    'Remove Member': props<{ guildId: string; member: Character }>(),
    'Remove Member Cancel': emptyProps(),
    'Remove Member Success': props<{
      selectedGuild: Guild | null;
    }>(),
    'Remove Member Failure': emptyProps(),
    'Delete Guild': props<{ guild: Guild }>(),
    'Delete Guild Cancel': emptyProps(),
    'Delete Guild Success': emptyProps(),
    'Delete Guild Failure': emptyProps(),
    'Update Selected Guild': props<{
      selectedGuild: Guild | null;
    }>(),
    'Reset State On Destroy': emptyProps(),
  },
});
