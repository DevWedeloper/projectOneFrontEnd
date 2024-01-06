import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Character } from 'src/app/shared/interfaces/character.interface';
import { Guild } from 'src/app/shared/interfaces/guild.interface';
import { guildActionsActions } from './guild-actions.action';

type Status = 'pending' | 'loading' | 'error' | 'success';

type GuildActionsState = {
  createStatus: Status;
  updateNameStatus: Status;
  updateLeaderStatus: Status;
  addMemberStatus: Status;
  removeMemberStatus: Status;
  memberToRemove: Character | null;
  deleteStatus: Status;
  selectedGuild: Guild | null;
};

const initialState: GuildActionsState = {
  createStatus: 'pending',
  updateNameStatus: 'pending',
  updateLeaderStatus: 'pending',
  addMemberStatus: 'pending',
  removeMemberStatus: 'pending',
  memberToRemove: null,
  deleteStatus: 'pending',
  selectedGuild: null,
};

const guildActionsFeature = createFeature({
  name: 'Guild Actions',
  reducer: createReducer(
    initialState,
    on(guildActionsActions.createGuild, (state) => ({
      ...state,
      createStatus: 'loading' as const,
    })),
    on(guildActionsActions.createGuildCancel, (state) => ({
      ...state,
      createStatus: 'pending' as const,
    })),
    on(guildActionsActions.createGuildSuccess, (state) => ({
      ...state,
      createStatus: 'success' as const,
    })),
    on(guildActionsActions.createGuildFailure, (state) => ({
      ...state,
      createStatus: 'error' as const,
    })),
    on(guildActionsActions.updateGuildName, (state) => ({
      ...state,
      updateNameStatus: 'loading' as const,
    })),
    on(guildActionsActions.updateGuildNameSuccess, (state, action) => ({
      ...state,
      updateNameStatus: 'success' as const,
      selectedGuild: action.selectedGuild,
    })),
    on(guildActionsActions.updateGuildNameFailure, (state) => ({
      ...state,
      updateNameStatus: 'error' as const,
    })),
    on(guildActionsActions.updateGuildLeader, (state) => ({
      ...state,
      updateLeaderStatus: 'loading' as const,
    })),
    on(guildActionsActions.updateGuildLeaderSuccess, (state, action) => ({
      ...state,
      updateLeaderStatus: 'success' as const,
      selectedGuild: action.selectedGuild,
    })),
    on(guildActionsActions.updateGuildLeaderFailure, (state) => ({
      ...state,
      updateLeaderStatus: 'error' as const,
    })),
    on(guildActionsActions.addMember, (state) => ({
      ...state,
      addMemberStatus: 'loading' as const,
    })),
    on(guildActionsActions.addMemberCancel, (state) => ({
      ...state,
      addMemberStatus: 'pending' as const,
    })),
    on(guildActionsActions.addMemberSuccess, (state, action) => ({
      ...state,
      addMemberStatus: 'success' as const,
      selectedGuild: action.selectedGuild,
    })),
    on(guildActionsActions.addMemberFailure, (state) => ({
      ...state,
      addMemberStatus: 'error' as const,
    })),
    on(guildActionsActions.removeMember, (state, action) => ({
      ...state,
      removeMemberStatus: 'loading' as const,
      memberToRemove: action.member,
    })),
    on(guildActionsActions.removeMemberCancel, (state) => ({
      ...state,
      removeMemberStatus: 'pending' as const,
      memberToRemove: null,
    })),
    on(guildActionsActions.removeMemberSuccess, (state, action) => ({
      ...state,
      removeMemberStatus: 'success' as const,
      memberToRemove: null,
      selectedGuild: action.selectedGuild,
    })),
    on(guildActionsActions.removeMemberFailure, (state) => ({
      ...state,
      removeMemberStatus: 'error' as const,
      memberToRemove: null,
    })),
    on(guildActionsActions.deleteGuild, (state, action) => ({
      ...state,
      deleteStatus: 'loading' as const,
      selectedGuild: action.guild,
    })),
    on(guildActionsActions.deleteGuildCancel, (state) => ({
      ...state,
      deleteStatus: 'pending' as const,
    })),
    on(guildActionsActions.deleteGuildSuccess, (state) => ({
      ...state,
      deleteStatus: 'success' as const,
      selectedGuild: null,
    })),
    on(guildActionsActions.deleteGuildFailure, (state) => ({
      ...state,
      deleteStatus: 'error' as const,
    })),
    on(guildActionsActions.updateSelectedGuild, (state, action) => ({
      ...state,
      selectedGuild: action.selectedGuild,
    })),
  ),
  extraSelectors: ({
    selectCreateStatus,
    selectUpdateNameStatus,
    selectUpdateLeaderStatus,
    selectAddMemberStatus,
    selectRemoveMemberStatus,
    selectDeleteStatus,
  }) => ({
    selectIsCreating: createSelector(
      selectCreateStatus,
      (createStatus) => createStatus === 'loading',
    ),
    selectCreateSuccess: createSelector(
      selectCreateStatus,
      (createStatus) => createStatus === 'success',
    ),
    selectIsUpdatingName: createSelector(
      selectUpdateNameStatus,
      (updateNameStatus) => updateNameStatus === 'loading',
    ),
    selectIsUpdatingLeader: createSelector(
      selectUpdateLeaderStatus,
      (updateLeaderStatus) => updateLeaderStatus === 'loading',
    ),
    selectIsAddingMember: createSelector(
      selectAddMemberStatus,
      (addMemberStatus) => addMemberStatus === 'loading',
    ),
    selectAddMemberSuccess: createSelector(
      selectAddMemberStatus,
      (addMemberStatus) => addMemberStatus === 'success',
    ),
    selectIsRemovingMember: createSelector(
      selectRemoveMemberStatus,
      (removeMemberStatus) => removeMemberStatus === 'loading',
    ),
    selectIsDeleting: createSelector(
      selectDeleteStatus,
      (deleteStatus) => deleteStatus === 'loading',
    ),
  }),
});

export const {
  name: guildActionsFeatureKey,
  reducer: guildActionsReducer,
  selectIsCreating,
  selectCreateSuccess,
  selectIsUpdatingName,
  selectIsUpdatingLeader,
  selectIsAddingMember,
  selectAddMemberSuccess,
  selectIsRemovingMember,
  selectMemberToRemove,
  selectIsDeleting,
  selectSelectedGuild,
} = guildActionsFeature;
