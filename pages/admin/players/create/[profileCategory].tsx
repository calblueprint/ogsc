import Button from "components/Button";
import DashboardLayout from "components/DashboardLayout";
import Icon from "components/Icon";
import PlayerFormLayout from "components/Player/PlayerFormLayout";
import { ProfileContents } from "components/Player/Profile";
import ProfileContext, {
  DeserializeProfileFieldDrafts,
  ProfileAction,
  ProfileContextReducer,
  ProfileState,
  SerializeProfileFieldDrafts,
} from "components/Player/ProfileContext";
import { Props as ProfileSectionProps } from "components/Player/ProfileSection";
import { ProfileCategory } from "interfaces";
import { useStateMachine } from "little-state-machine";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import composeReducers from "utils/composeReducers";

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
  context: {
    state: ProfileState;
    dispatch: React.Dispatch<ProfileAction>;
    refreshProfile: () => void;
  };
} => {
  const { state, actions } = useStateMachine<ProfileState>({
    ProfileContextReducer: composeReducers(
      SerializeProfileFieldDrafts,
      ProfileContextReducer
    ),
  });
  const context = useMemo(
    () => ({
      dispatch: actions.ProfileContextReducer,
      state: DeserializeProfileFieldDrafts({
        editingState: { allEditingOverride: true, sections: {} },
        player: state.player,
      }),
      // refreshProfile has no role in this context.
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      refreshProfile: () => {},
    }),
    [actions.ProfileContextReducer, state.player]
  );
  return { context, actions, state };
};

const CreatePlayerProfilePage: React.FC = () => {
  const [error] = useState(null);
  const router = useRouter();
  const { context } = useCreateProfileContext();
  const category = router.query.profileCategory as ProfileCategory;

  return (
    <DashboardLayout>
      <div className="form flex mx-20 mt-24 flex-col">
        <p className="py-6 text-2xl h-16 tracking-wide font-medium">
          Create a new player profile
        </p>
        <p className="font-light mt-2">Description Here</p>
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
                    onClick={() => router.push("/admin/players/create")}
                  >
                    <Icon className="mr-6 w-8 stroke-current" type="back" />
                    Back
                  </Button>
                  <Button
                    className="bg-blue text-sm px-5 py-2 text-white tracking-wide rounded-md"
                    type="submit"
                  >
                    Next Step
                    <Icon className="ml-6 w-8 stroke-current" type="next" />
                  </Button>
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
