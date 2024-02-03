import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Character } from 'src/app/shared/interfaces/character.interface';
import { CharacterType } from '../interfaces/character-type.interface';
import { characterActionsActions } from './character-actions.action';

type Status = 'pending' | 'loading' | 'error' | 'success';

type CharacterActionsState = {
  createStatus: Status;
  updateStatus: Status;
  joinGuildStatus: Status;
  leaveGuildStatus: Status;
  deleteStatus: Status;
  characterTypes: CharacterType[] | null;
  selectedCharacter: Character | null;
};

const initialState: CharacterActionsState = {
  createStatus: 'pending',
  updateStatus: 'pending',
  joinGuildStatus: 'pending',
  leaveGuildStatus: 'pending',
  deleteStatus: 'pending',
  characterTypes: null,
  selectedCharacter: null,
};

const characterActionsFeature = createFeature({
  name: 'Character Actions',
  reducer: createReducer(
    initialState,
    on(characterActionsActions.createCharacter, (state) => ({
      ...state,
      createStatus: 'loading' as const,
    })),
    on(characterActionsActions.createCharacterSuccess, (state) => ({
      ...state,
      createStatus: 'success' as const,
    })),
    on(characterActionsActions.createCharacterFailure, (state) => ({
      ...state,
      createStatus: 'error' as const,
    })),
    on(characterActionsActions.updateCharacter, (state) => ({
      ...state,
      updateStatus: 'loading' as const,
    })),
    on(characterActionsActions.updateCharacterSuccess, (state, action) => ({
      ...state,
      updateStatus: 'success' as const,
      selectedCharacter: action.selectedCharacter,
    })),
    on(characterActionsActions.updateCharacterFailure, (state) => ({
      ...state,
      updateStatus: 'error' as const,
    })),
    on(characterActionsActions.updateSelectedCharacter, (state, action) => ({
      ...state,
      selectedCharacter: action.selectedCharacter,
    })),
    on(characterActionsActions.joinGuild, (state) => ({
      ...state,
      joinGuildStatus: 'loading' as const,
    })),
    on(characterActionsActions.joinGuildCancel, (state) => ({
      ...state,
      joinGuildStatus: 'pending' as const,
    })),
    on(characterActionsActions.joinGuildSuccess, (state, action) => ({
      ...state,
      joinGuildStatus: 'success' as const,
      selectedCharacter: action.selectedCharacter,
    })),
    on(characterActionsActions.joinGuildFailure, (state) => ({
      ...state,
      joinGuildStatus: 'error' as const,
    })),
    on(characterActionsActions.leaveGuild, (state) => ({
      ...state,
      leaveGuildStatus: 'loading' as const,
    })),
    on(characterActionsActions.leaveGuildCancel, (state) => ({
      ...state,
      leaveGuildStatus: 'pending' as const,
    })),
    on(characterActionsActions.leaveGuildSuccess, (state, action) => ({
      ...state,
      leaveGuildStatus: 'success' as const,
      selectedCharacter: action.selectedCharacter,
    })),
    on(characterActionsActions.leaveGuildFailure, (state) => ({
      ...state,
      leaveGuildStatus: 'error' as const,
    })),
    on(characterActionsActions.deleteCharacter, (state, action) => ({
      ...state,
      deleteStatus: 'loading' as const,
      selectedCharacter: action.character,
    })),
    on(characterActionsActions.deleteCharacterCancel, (state) => ({
      ...state,
      deleteStatus: 'pending' as const,
    })),
    on(characterActionsActions.deleteCharacterSuccess, (state) => ({
      ...state,
      deleteStatus: 'success' as const,
      selectedCharacter: null,
    })),
    on(characterActionsActions.deleteCharacterFailure, (state) => ({
      ...state,
      deleteStatus: 'error' as const,
    })),
    on(characterActionsActions.loadCharacterTypesSuccess, (state, action) => ({
      ...state,
      characterTypes: action.characterTypes,
    })),
    on(characterActionsActions.loadCharacterTypesFailure, (state) => ({
      ...state,
      characterTypes: null,
    })),
    on(characterActionsActions.resetStateOnDestroy, () => ({
      ...initialState,
    })),
  ),
  extraSelectors: ({
    selectCreateStatus,
    selectUpdateStatus,
    selectJoinGuildStatus,
    selectLeaveGuildStatus,
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
    selectIsUpdating: createSelector(
      selectUpdateStatus,
      (updateStatus) => updateStatus === 'loading',
    ),
    selectIsJoiningGuild: createSelector(
      selectJoinGuildStatus,
      (joinGuildStatus) => joinGuildStatus === 'loading',
    ),
    selectIsLeavingGuild: createSelector(
      selectLeaveGuildStatus,
      (leaveGuildStatus) => leaveGuildStatus === 'loading',
    ),
    selectLeaveGuildSuccess: createSelector(
      selectLeaveGuildStatus,
      (leaveGuildStatus) => leaveGuildStatus === 'success',
    ),
    selectIsDeleting: createSelector(
      selectDeleteStatus,
      (deleteStatus) => deleteStatus === 'loading',
    ),
  }),
});

export const {
  name: characterActionsFeatureKey,
  reducer: characterActionsReducer,
  selectIsCreating,
  selectCreateSuccess,
  selectIsUpdating,
  selectIsJoiningGuild,
  selectIsLeavingGuild,
  selectLeaveGuildSuccess,
  selectIsDeleting,
  selectCharacterTypes,
  selectSelectedCharacter,
} = characterActionsFeature;
