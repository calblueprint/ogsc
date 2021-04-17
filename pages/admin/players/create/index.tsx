import type { ProfileFieldKey } from "@prisma/client";
import { joiResolver } from "@hookform/resolvers/joi";
import Button from "components/Button";
import PlayerFormField from "components/PlayerFormField";
import Joi from "lib/validate";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DashboardLayout from "components/DashboardLayout";
import PlayerFormLayout from "components/Player/PlayerFormLayout";
import NewPlayerInvitePage from "components/Player/PlayerForm/newPlayer";
import Icon from "components/Icon";
import { IUser, ProfileCategory, UncategorizedProfileFields } from "interfaces";

import Combobox from "components/Combobox";
import ProfileContext, {
  emptyProfile,
  ProfileAction,
} from "components/Player/ProfileContext";
import ProfileFieldCell from "components/Player/ProfileFieldCell";
import { useCreateProfileContext } from "./[profileCategory]";

const ExistingUser = ["Yes", "No"];

type InitialProfileFormValues = {
  choice: typeof ExistingUser[number];
};

const PlayerProfileFormSchema = Joi.object({
  choice: Joi.string()
    .valid(...ExistingUser)
    .required(),
});

const UserSignUpPageOne: React.FC = () => {
  const router = useRouter();
  const { actions, state, context } = useCreateProfileContext();
  const dispatchAction = actions.ProfileContextReducer as React.Dispatch<ProfileAction>;
  const [selectedPlayer, setSelectedPlayer] = useState<IUser[]>(
    state.player ? [state.player] : []
  );
  const [existingUser, setExistingUser] = useState(
    state.player != null ? "Yes" : undefined
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { errors, register, handleSubmit } = useForm({
    resolver: joiResolver(PlayerProfileFormSchema),
  });
  useEffect(() => {
    if (selectedPlayer[0]) {
      dispatchAction({
        type: "SET_PLAYER",
        player: { profile: emptyProfile, ...selectedPlayer[0] },
      });
    }
  }, [selectedPlayer, dispatchAction]);

  async function onSubmit(
    _values: InitialProfileFormValues,
    event?: React.BaseSyntheticEvent
  ): Promise<void> {
    event?.preventDefault();
    if (submitting) {
      return;
    }
    try {
      if (selectedPlayer.length === 0 || selectedPlayer[0] == null) {
        throw new Error("You must select or create a player to continue");
      }

      router.push(`/admin/players/create/${Object.values(ProfileCategory)[0]}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="form flex mx-20 mt-24 flex-col">
        <p className="py-6 text-2xl h-16 font-medium">
          Create a new player profile
        </p>
        <PlayerFormLayout>
          <p className="pt-10 text-xl font-medium">Let&apos;s get started!</p>
          <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
              <div className="mb-16">
                <p className="text-sm font-semibold mb-2">
                  Does this participant have an existing account as a user?
                </p>
                <p className="text-sm font-light mb-4">
                  If the participant already has a user account, their user
                  account will be linked to their participant profile and
                  existing info will be auto-filled.
                </p>
                <PlayerFormField
                  label=""
                  name="choice"
                  error={errors.choice?.message}
                >
                  <label
                    className="font-medium flex items-center mb-2"
                    htmlFor="choice"
                  >
                    <input
                      className="mr-5"
                      type="radio"
                      name="choice"
                      id="Yes"
                      value="Yes"
                      ref={register}
                      onChange={(event) => setExistingUser(event.target.value)}
                      checked={existingUser === "Yes"}
                    />
                    <p className="text-sm ml-3 font-medium">Yes</p>
                  </label>
                  <label
                    className="font-medium flex items-center mb-2"
                    htmlFor="choice"
                  >
                    <input
                      className="mr-5"
                      type="radio"
                      name="choice"
                      id="No"
                      value="No"
                      ref={register}
                      onChange={(event) => setExistingUser(event.target.value)}
                      checked={existingUser === "No"}
                    />
                    <p className="text-sm ml-3 font-medium">No</p>
                  </label>
                  {existingUser === "Yes" ? (
                    <div className="w-64">
                      <Combobox
                        selectedPlayers={selectedPlayer}
                        setSelectedPlayers={setSelectedPlayer}
                        singleSelect
                        promptOff
                        onlyWithoutProfiles
                      />
                    </div>
                  ) : null}
                  {existingUser === "No" ? (
                    <NewPlayerInvitePage
                      onCreate={(user: IUser) => setSelectedPlayer([user])}
                    />
                  ) : null}
                </PlayerFormField>
              </div>
              <div className="grid grid-rows-2 mr-32">
                <ProfileContext.Provider value={context}>
                  {UncategorizedProfileFields.map((key: ProfileFieldKey) => (
                    <ProfileFieldCell fieldKey={key} />
                  ))}
                </ProfileContext.Provider>
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <hr className="border-unselected border-opacity-50 my-16" />
              <div className="flex mb-32">
                <div className="mb-2 flex justify-between w-full">
                  <Button
                    className="text-blue bg-white text-sm py-2 rounded-md tracking-wide"
                    onClick={() => router.push("/admin/players")}
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

export default UserSignUpPageOne;
