import React, { useReducer } from "react";
import {
  IPlayer,
  ProfileFieldValue,
  ProfileFieldValueDeserializedTypes,
} from "interfaces/user";
import { ProfileFieldKey } from "@prisma/client";

type ProfileState = {
  player: IPlayer | null;
  editingState: {
    sections: { [sectionName: string]: { editing: boolean } | undefined };
  };
};

type ProfileAction =
  | {
      type: "SET_PLAYER";
      player: IPlayer;
    }
  | {
      type: "EDIT_FIELD";
      key: ProfileFieldKey;
      value: ProfileFieldValueDeserializedTypes[ProfileFieldValue];
    }
  | { type: "OPEN_EDIT_SECTION"; section: string }
  | { type: "CLOSE_EDIT_SECTION"; section: string };

const initialProfileState: ProfileState = {
  player: null,
  editingState: { sections: {} },
};

const ProfileContext = React.createContext<{
  state: ProfileState;
  dispatch: React.Dispatch<ProfileAction>;
}>({
  state: initialProfileState,
  dispatch: (action: ProfileAction) => {
    // eslint-disable-next-line no-console
    console.warn(
      "ProfileContext#dispatch was called before the reducer was initialized. This action was ignored.",
      action
    );
  },
});

export const useProfileContext = (): [
  ProfileState,
  React.Dispatch<ProfileAction>
] => {
  return useReducer<React.Reducer<ProfileState, ProfileAction>>(
    (state: ProfileState, action: ProfileAction) => {
      switch (action.type) {
        case "SET_PLAYER":
          return {
            ...state,
            player: action.player,
          };

        case "EDIT_FIELD":
          if (state.player) {
            return {
              ...state,
              player: {
                ...state.player,
                profile: {
                  ...state.player.profile,
                  [action.key]: {
                    key: action.key,
                    current: null,
                    lastUpdated: null,
                    history: [],
                    ...state.player.profile?.[action.key],
                    draft: action.value,
                  },
                },
              },
            };
          }
          return state;

        case "OPEN_EDIT_SECTION":
          return {
            ...state,
            editingState: {
              ...state.editingState,
              sections: {
                ...state.editingState.sections,
                [action.section]: { editing: true },
              },
            },
          };

        case "CLOSE_EDIT_SECTION":
          return {
            ...state,
            editingState: {
              ...state.editingState,
              sections: {
                ...state.editingState.sections,
                [action.section]: { editing: false },
              },
            },
          };

        default:
          return state;
      }
    },
    initialProfileState
  );
};

export const ProfileSectionContext = React.createContext("");

export default ProfileContext;
