import { ProfileFieldKey } from "@prisma/client";
import Button from "components/Button";
import DashboardLayout from "components/DashboardLayout";
import Icon from "components/Icon";
import PlayerFormLayout, {
  usePlayerFormCategoryIndex,
} from "components/Player/PlayerFormLayout";
import { ProfileContents } from "components/Player/Profile";
import ProfileContext, {
  DeserializeProfileFieldDrafts,
  ProfileAction,
  ProfileContextReducer,
  ProfileContextType,
  ProfileState,
  SerializeProfileFieldDrafts,
} from "components/Player/ProfileContext";
import { Props as ProfileSectionProps } from "components/Player/ProfileSection";
import {
  IAbsence,
  IProfileField,
  ProfileCategory,
  UncreatedAbsence,
  UncreatedProfileField,
} from "interfaces";
import { useStateMachine } from "little-state-machine";
import { useRouter } from "next/router";
import { CreateManyAbsencesDTO } from "pages/api/absences/createMany";
import { CreatePlayerProfileForUserDTO } from "pages/api/admin/users/[id]/createPlayer";
import React, { useMemo, useState } from "react";
import { serializeProfileFieldValue } from "utils/buildUserProfile";
import composeReducers from "utils/composeReducers";
import isAbsence from "utils/isAbsence";

const Section = ({
  sectionName,
  children,
}: ProfileSectionProps): JSX.Element => (
  <div>
    <h1 className="mb-10 text-lg font-semibold">{sectionName}</h1>
    {children}
  </div>
);

export const useCreateProfileContext = (): {
  state: ProfileState;
  actions: ReturnType<typeof useStateMachine>["actions"];
  context: ProfileContextType;
} => {
  const { state: _state, actions } = useStateMachine<ProfileState>({
    ProfileContextReducer: composeReducers(
      SerializeProfileFieldDrafts,
      ProfileContextReducer
    ),
  });
  const state = DeserializeProfileFieldDrafts({
    editingState: { allEditingOverride: true, sections: {} },
    player: _state.player,
  });

  const context = useMemo<ProfileContextType>(
    () => ({
      dispatch: actions.ProfileContextReducer,
      state,
      createField: async (fieldKey) => {
        if (fieldKey === "absence") {
          actions.ProfileContextReducer({
            type: "SAVE_DRAFT_ABSENCE",
          } as ProfileAction);
        } else {
          actions.ProfileContextReducer({
            type: "SAVE_DRAFT_FIELD",
            key: fieldKey,
          } as ProfileAction);
        }
      },
      updateField: async (field) => {
        if (isAbsence(field)) {
          actions.ProfileContextReducer({
            type: "SAVE_DRAFT_ABSENCE",
            id: field.id,
          } as ProfileAction);
        } else {
          actions.ProfileContextReducer({
            type: "SAVE_DRAFT_FIELD",
            key: field.key,
            id: field.id,
          } as ProfileAction);
        }
      },
      deleteField: async (fieldKey, id) => {
        actions.ProfileContextReducer({
          type: "DELETE_FIELD",
          key: fieldKey,
          id,
        } as ProfileAction);
      },
    }),
    [actions, state]
  );
  return { context, actions, state };
};

const CreatePlayerProfilePage: React.FC = () => {
  const [error, setError] = useState(null);
  const router = useRouter();
  const { context, state } = useCreateProfileContext();
  const currentTabIndex = usePlayerFormCategoryIndex();
  const category = router.query.profileCategory as ProfileCategory;

  function identifyDraftsAndBuildSubmission():
    | CreatePlayerProfileForUserDTO
    | undefined {
    if (!state.player) {
      return undefined;
    }
    const profileFields: {
      key: ProfileFieldKey;
      value: string;
    }[] = [];
    const absences: CreateManyAbsencesDTO["absences"] =
      state.player.absences?.map((absence: IAbsence | UncreatedAbsence) => ({
        date: absence.date.toISOString(),
        reason: absence.reason,
        type: absence.type,
        description: absence.description,
      })) ?? [];

    Object.values(state.player.profile ?? {}).forEach((field) => {
      field?.history.forEach(
        (existingField: IProfileField | UncreatedProfileField) => {
          if (existingField.value === null) {
            return;
          }
          const value = serializeProfileFieldValue(
            existingField.value,
            field.key
          );
          if (value === null || value === "") {
            return;
          }
          if ("uncreated" in existingField) {
            profileFields.push({
              key: field.key,
              value,
            });
          } else if (existingField.modified) {
            profileFields.push({
              key: field.key,
              value,
            });
          }
        }
      );
      if (field?.draft !== undefined) {
        const value = serializeProfileFieldValue(field.draft, field.key);
        if (value) {
          profileFields.push({
            key: field.key,
            value,
          });
        }
      }
    });

    return {
      profileFields: {
        fields: profileFields,
        playerId: state.player.id,
      },
      absences: {
        absences,
        playerId: state.player.id,
      },
    };
  }

  async function submit(dto: CreatePlayerProfileForUserDTO): Promise<void> {
    if (!state.player) {
      return;
    }
    const response = await fetch(
      `/api/admin/users/${state.player.id}/createPlayer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      }
    );
    if (!response.ok) {
      const body = await response.json();
      setError(body.message);
      return;
    }
    const { player } = await response.json();
    context.dispatch({ type: "RESET_PLAYER" });
    router.push(`/admin/players/${player.id}?success=true`);
  }

  return (
    <DashboardLayout>
      <div className="form flex mx-20 mt-24 flex-col">
        <p className="py-6 text-2xl h-16 font-medium">
          Create a new player profile
        </p>
        <PlayerFormLayout>
          <form
            className="mt-10"
            onSubmit={(ev) => {
              ev.preventDefault();
            }}
          >
            <fieldset>
              <ProfileContext.Provider value={context}>
                <ProfileContents category={category} renderSection={Section} />
              </ProfileContext.Provider>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <hr className="border-unselected border-opacity-50 my-16" />
              <div className="flex mb-32">
                <div className="mb-2 flex justify-between w-full">
                  <Button
                    className="text-blue bg-white text-sm py-2 rounded-md tracking-wide"
                    onClick={() =>
                      router.push(
                        `/admin/players/create/${
                          Object.values(ProfileCategory)[currentTabIndex - 1] ??
                          ""
                        }`
                      )
                    }
                  >
                    <Icon className="mr-6 w-8 stroke-current" type="back" />
                    Back
                  </Button>
                  {currentTabIndex <
                  Object.values(ProfileCategory).length - 1 ? (
                    <Button
                      className="bg-blue text-sm px-5 py-2 text-white tracking-wide rounded-md"
                      onClick={() =>
                        router.push(
                          `/admin/players/create/${
                            Object.values(ProfileCategory)[currentTabIndex + 1]
                          }`
                        )
                      }
                    >
                      Next Step
                      <Icon className="ml-6 w-8 stroke-current" type="next" />
                    </Button>
                  ) : (
                    <Button
                      className="bg-blue text-sm px-8 py-2 text-white tracking-wide rounded-md"
                      onClick={() => {
                        const dto = identifyDraftsAndBuildSubmission();
                        if (dto) {
                          submit(dto);
                        }
                      }}
                    >
                      Submit
                    </Button>
                  )}
                </div>
              </div>
              <hr />
            </fieldset>
          </form>
        </PlayerFormLayout>
      </div>
    </DashboardLayout>
  );
};

export default CreatePlayerProfilePage;
