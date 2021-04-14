import React, { useReducer } from "react";
import {
  IAbsence,
  IPlayer,
  IProfileField,
  IProfileFieldBuilt,
  PlayerProfile,
  ProfileFieldValue,
  ProfileFieldValueDeserializedTypes,
  ProfileFieldValues,
  UncreatedProfileField,
} from "interfaces/user";
import {
  Absence,
  AbsenceReason,
  AbsenceType,
  ProfileFieldKey,
} from "@prisma/client";
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
      value: Partial<Absence>;
      id?: number;
    }
  | {
      type: "SAVE_DRAFT_FIELD";
      key: ProfileFieldKey;
      id?: number;
    }
  | {
      type: "SAVE_DRAFT_ABSENCE";
      id?: number;
    }
  | {
      type: "DELETE_FIELD";
      key: ProfileFieldKey | "absence";
      id: number;
    }
  | { type: "OPEN_EDIT_SECTION"; section: string }
  | { type: "CLOSE_EDIT_SECTION"; section: string }
  | { type: "SAVE_SECTION"; section: string; updatedPlayer: IPlayer };

const initialProfileState: ProfileState = {
  player: null,
  editingState: { sections: {} },
};

const warningEmptyFunction = <T extends unknown = void>(
  methodName: string,
  returnValue?: T
): (() => T) => (...args: unknown[]) => {
  // eslint-disable-next-line no-console
  console.warn(
    `ProfileContext#${methodName} was called before the reducer was initialized. This action was ignored.`,
    args
  );
  return returnValue as T;
};

export type ProfileContextType = {
  state: ProfileState;
  dispatch: React.Dispatch<ProfileAction>;
  createField: <K extends ProfileFieldKey>(
    fieldKey: K | "absence",
    draft:
      | ProfileFieldValueDeserializedTypes[ProfileFieldValues[K]]
      | Partial<Absence>,
    userId: number
  ) => Promise<void>;
  updateField: (field: IProfileField | IAbsence) => Promise<void>;
  deleteField: (
    fieldKey: ProfileFieldKey | "absence",
    id: number
  ) => Promise<void>;
};
const ProfileContext = React.createContext<ProfileContextType>({
  state: initialProfileState,
  dispatch: warningEmptyFunction("dispatch"),
  createField: warningEmptyFunction("createField"),
  updateField: warningEmptyFunction("updateField"),
  deleteField: warningEmptyFunction("deleteField"),
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

export const createEmptyAbsence = (userId: number): IAbsence => {
  return {
    id: generateTemporaryID(),
    date: new Date(),
    description: "",
    reason: AbsenceReason.Excused,
    type: AbsenceType.School,
    userId,
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
                    draft: {
                      ...Object.fromEntries(
                        Object.entries(absence).filter(
                          ([key]) => key !== "draft"
                        )
                      ),
                      ...absence.draft,
                      ...action.value,
                    },
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
            absenceDraft: {
              // date has a default value in ProfileFieldEditor:
              date: createEmptyAbsence(state.player.id).date,
              ...state.player.absenceDraft,
              ...action.value,
            },
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
      if (
        !state.player ||
        !state.player.profile ||
        !state.player.profile[action.key]
      ) {
        return state;
      }

      if (action.id) {
        const currentDraft = (state.player?.profile?.[action.key]?.history as
          | IProfileField<ProfileFieldKey>[]
          | undefined)?.find?.((field) => field.id === action.id)?.draft;
        if (!currentDraft) {
          return state;
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
                )[]).map((field: IProfileField | UncreatedProfileField) =>
                  field.id === action.id
                    ? {
                        ...field,
                        value: serializeProfileFieldValue(
                          currentDraft,
                          field.key
                        ),
                        draft: undefined,
                      }
                    : field
                ),
              },
            },
          },
        };
      }

      const currentDraft = state.player?.profile?.[action.key];
      if (!currentDraft) {
        return state;
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

    case "SAVE_DRAFT_ABSENCE": {
      if (!state.player) {
        return state;
      }
      if (action.id) {
        return {
          ...state,
          player: {
            ...state.player,
            absences: (state.player?.absences ?? []).map(
              (absence: IAbsence) => {
                if (absence.id === action.id) {
                  return { ...absence, ...absence.draft, draft: undefined };
                }
                return absence;
              }
            ),
          },
        };
      }
      if (!state.player.absenceDraft) {
        return state;
      }
      return {
        ...state,
        player: {
          ...state.player,
          absences: (state.player?.absences ?? []).concat({
            ...createEmptyAbsence(state.player.id),
            uncreated: true,
            ...state.player.absenceDraft,
          }),
          absenceDraft: undefined,
        },
      };
    }

    case "DELETE_FIELD":
      if (!state.player) {
        return state;
      }
      if (action.key === "absence") {
        return {
          ...state,
          player: {
            ...state.player,
            absences: (state.player?.absences ?? []).filter(
              (value) => value.id !== action.id
            ),
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
              ...state.player.profile?.[action.key],
              history: ((state.player.profile?.[action.key]?.history ??
                []) as IProfileField[]).filter(
                (value) => value.id !== action.id
              ),
            },
          },
        },
      };

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
