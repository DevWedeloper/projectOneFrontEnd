import { Character } from '../interfaces/character.interface';

export const isNotMemberOfAGuild = (character: Character): boolean => (
  character.guild === null
);

export const isMemberOfAGuild = (character: Character): boolean => (
  character.guild !== null &&
  character._id !== character.guild?.leader?._id
);

export const isLeaderOfAGuild = (character: Character): boolean => (
  character._id === character.guild?.leader?._id
);

export const isMemberOfDifferentGuild = (guildId: string, character: Character): boolean => (
  guildId !== character.guild?._id &&
  character._id !== character.guild?.leader?._id
);

export const isLeaderOfDifferentGuild = (guildId: string, character: Character): boolean => (
  character._id === character.guild?.leader?._id
);