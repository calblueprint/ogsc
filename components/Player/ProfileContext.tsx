import React, { useReducer } from "react";
import {
  IAbsence,
  IPlayer,
  IProfileField,
  IProfileFieldBuilt,
  PlayerProfile,
  ProfileFieldValue,
  ProfileFieldValueDeserializedTypes,
  UncreatedProfileField,
} from "interfaces/user";
import { Absence, ProfileFieldKey } from "@prisma/client";
import {
  deserializeProfileFieldValue,
  serializeProfileFieldValue,
} from "utils/buildUserProfile";

let idCounter = -Math.floor(Math.random() * 1e6);
function generateTemporaryID(): number {
  idCounter -= 1;
  return idCounter;
}

export type ProfileState = {
  player: IPlayer | null;
  editingState: {
    sections: {
      [sectionName: string]:
        | {
            editing: boolean;
          }
        | undefined;
    };
    /**
     * Setting `allEditingOverride` to true ignores all sections' .editing property.
     */
    allEditingOverride?: boolean;
  };
};

export type ProfileAction =
  | {
      type: "SET_PLAYER";
      player: IPlayer;
    }
  | {
      type: "EDIT_FIELD";
      key: ProfileFieldKey;
      value: ProfileFieldValueDeserializedTypes[ProfileFieldValue];
      id?: number;
    }
  | {
      type: "EDIT_ABSENCE";
      key: "absence";
      value: Partial<Absence>;
      id?: number;
    }
  | {
      type: "SAVE_DRAFT_FIELD";
      key: ProfileFieldKey;
      id?: number;
    }
  | { type: "OPEN_EDIT_SECTION"; section: string }
  | { type: "CLOSE_EDIT_SECTION"; section: string }
  | { type: "SAVE_SECTION"; section: string; updatedPlayer: IPlayer };

const initialProfileState: ProfileState = {
  player: null,
  editingState: { sections: {} },
};

const ProfileContext = React.createContext<{
  state: ProfileState;
  dispatch: React.Dispatch<ProfileAction>;
  refreshProfile: () => void;
}>({
  state: initialProfileState,
  dispatch: (action: ProfileAction) => {
    // eslint-disable-next-line no-console
    console.warn(
      "ProfileContext#dispatch was called before the reducer was initialized. This action was ignored.",
      action
    );
  },
  refreshProfile: () => {
    // eslint-disable-next-line no-console
    console.warn(
      "ProfileContext#refreshProfile was called before the reducer was initialized. This action was ignored."
    );
  },
});

export const createEmptyProfileField = (
  fieldKey: ProfileFieldKey
): IProfileFieldBuilt<ProfileFieldKey> => {
  return {
    key: fieldKey,
    lastUpdated: null,
    history: [],
  };
};

export const emptyProfile = Object.fromEntries(
  Object.entries(ProfileFieldKey).map(([, key]: [string, ProfileFieldKey]) => [
    key,
    createEmptyProfileField(key),
  ])
);

export const ProfileContextReducer = (
  state: ProfileState,
  action: ProfileAction
): ProfileState => {
  switch (action.type) {
    case "SET_PLAYER":
      return {
        ...state,
        player: action.player,
      };

    case "EDIT_ABSENCE":
      if (state.player) {
        if (action.id) {
          return {
            ...state,
            player: {
              ...state.player,
              absences: state.player?.absences?.map((absence: IAbsence) => {
                if ("id" in absence && absence.id === action.id) {
                  return {
                    ...absence,
                    draft: { ...absence, ...absence.draft, ...action.value },
                  };
                }
                return absence;
              }),
            },
          };
        }
        return {
          ...state,
          player: {
            ...state.player,
            absenceDraft: { ...state.player.absenceDraft, ...action.value },
          },
        };
      }
      return state;

    case "EDIT_FIELD":
      if (state.player) {
        if (action.id) {
          // Modify an existing field in the `.history` array
          return {
            ...state,
            player: {
              ...state.player,
              profile: {
                ...state.player.profile,
                [action.key]: {
                  ...createEmptyProfileField(action.key),
                  ...state.player.profile?.[action.key],
                  history: (
                    (state.player.profile?.[action.key] as
                      | IProfileFieldBuilt<ProfileFieldKey>
                      | undefined)?.history || []
                  ).map((field: IProfileField) => {
                    if (field.id === action.id) {
                      return {
                        ...field,
                        draft: action.value,
                      };
                    }
                    return field;
                  }),
                },
              },
            },
          };
        }
        // Create a new field
        return {
          ...state,
          player: {
            ...state.player,
            profile: {
              ...state.player.profile,
              [action.key]: {
                ...createEmptyProfileField(action.key),
                ...state.player.profile?.[action.key],
                draft: action.value,
              },
            },
          },
        };
      }
      return state;

    case "SAVE_DRAFT_FIELD": {
      const currentDraft = state.player?.profile?.[action.key];
      if (
        !currentDraft ||
        !state.player ||
        !state.player.profile ||
        !state.player.profile[action.key]
      ) {
        return state;
      }

      if (action.id) {
        return {
          ...state,
          player: {
            ...state.player,
            profile: {
              ...state.player.profile,
              [action.key]: {
                ...createEmptyProfileField(action.key),
                ...state.player.profile[action.key],
                history: ((state.player.profile[action.key]?.history ?? []) as (
                  | IProfileField
                  | UncreatedProfileField
                )[]).map((field: IProfileField | UncreatedProfileField) =>
                  field.id === action.id
                    ? {
                        ...field,
                        value: serializeProfileFieldValue(currentDraft),
                        draft: undefined,
                      }
                    : field
                ),
              },
            },
          },
        };
      }

      return {
        ...state,
        player: {
          ...state.player,
          profile: {
            ...state.player.profile,
            [action.key]: {
              ...createEmptyProfileField(action.key),
              ...state.player.profile[action.key],
              history: ((state.player.profile[action.key]?.history ?? []) as (
                | IProfileField
                | UncreatedProfileField
              )[]).concat([
                {
                  createdAt: new Date(),
                  id: generateTemporaryID(),
                  key: action.key,
                  value: serializeProfileFieldValue(currentDraft),
                  userId: state.player.id,
                  uncreated: true,
                },
              ]),
              draft: undefined,
            },
          },
        },
      };
    }

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

    case "SAVE_SECTION":
      return {
        ...state,
        player: action.updatedPlayer,
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
};

export const SerializeProfileFieldDrafts = (
  state: ProfileState
): ProfileState => {
  return {
    ...state,
    player:
      state.player != null
        ? {
            ...state.player,
            profile: {
              ...state.player?.profile,
              ...(Object.fromEntries(
                Object.entries(state.player?.profile ?? {}).map(
                  ([key, profileField]) => [
                    key,
                    {
                      ...profileField,
                      draft:
                        serializeProfileFieldValue(profileField) ?? undefined,
                    },
                  ]
                )
              ) as Partial<PlayerProfile>),
            },
          }
        : null,
  };
};

export const DeserializeProfileFieldDrafts = (
  state: ProfileState
): ProfileState => {
  return {
    ...state,
    player:
      state.player != null
        ? {
            ...state.player,
            profile: {
              ...state.player?.profile,
              ...(Object.fromEntries(
                Object.entries(state.player?.profile ?? {}).map(
                  ([key, profileField]) => [
                    key,
                    profileField
                      ? {
                          ...profileField,
                          draft:
                            profileField.draft !== undefined
                              ? deserializeProfileFieldValue(
                                  profileField.draft as string,
                                  profileField.key
                                )
                              : undefined,
                        }
                      : undefined,
                  ]
                )
              ) as Partial<PlayerProfile>),
            },
          }
        : null,
  };
};

export const ProfileSectionContext = React.createContext("");

export default ProfileContext;

export const useProfileContext = (): [
  ProfileState,
  React.Dispatch<ProfileAction>
] => {
  return useReducer<React.Reducer<ProfileState, ProfileAction>>(
    ProfileContextReducer,
    initialProfileState
  );
};
