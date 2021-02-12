import type { ProfileFieldKey, User } from "@prisma/client";
import { joiResolver } from "@hookform/resolvers/joi";
import Button from "components/Button";
import PlayerFormField from "components/PlayerFormField";
import Joi from "lib/validate";
import { useStateMachine } from "little-state-machine";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import updateActionPlayer from "utils/updateActionPlayer";
import updateActionForm from "utils/updateActionForm";
import DashboardLayout from "components/DashboardLayout";
import PlayerFormLayout from "components/Player/PlayerFormLayout";
import ComboBox from "components/Player/PlayerForm/PlayerComboBox";
import NewPlayerInvitePage from "components/Player/PlayerForm/newPlayer";
import Icon from "components/Icon";

const ExistingUser = ["Yes", "No"];

export type PlayerProfileFormValues = {
  [ProfileFieldKey.PlayerNumber]: string;
  age: string;
  [ProfileFieldKey.BioAboutMe]: string;
  [ProfileFieldKey.BioHobbies]: string;
  [ProfileFieldKey.BioFavoriteSubject]: string;
  [ProfileFieldKey.BioMostDifficultSubject]: string;
  [ProfileFieldKey.BioSiblings]: string;
  [ProfileFieldKey.BioParents]: string;
  [ProfileFieldKey.AcademicEngagementScore]: string[];
  [ProfileFieldKey.AdvisingScore]: string[];
  [ProfileFieldKey.AthleticScore]: string[];
  [ProfileFieldKey.GPA]: string[];
  [ProfileFieldKey.DisciplinaryActions]: string[];
  [ProfileFieldKey.BMI]: string;
  [ProfileFieldKey.PacerTest]: string;
  [ProfileFieldKey.MileTime]: string;
  [ProfileFieldKey.Situps]: string;
  [ProfileFieldKey.Pushups]: string;
  [ProfileFieldKey.HealthAndWellness]: string;
  [ProfileFieldKey.Highlights]: string;
  [ProfileFieldKey.IntroVideo]: string;
};

export type ExistingUserType = {
  choice: string;
  player: User;
};

const PlayerProfileFormSchema = Joi.object<
  PlayerProfileFormValues & ExistingUserType
>({
  PlayerNumber: Joi.string(),
  age: Joi.string(),
  BioAboutMe: Joi.string().empty("").default(null),
  BioHobbies: Joi.string().empty("").default(null),
  BioFavoriteSubject: Joi.string().empty("").default(null),
  BioMostDifficultSubject: Joi.string().empty("").default(null),
  BioSiblings: Joi.string().empty("").default(null),
  BioParents: Joi.string().empty("").default(null),
  AcademicEngagementScore: Joi.array()
    .items(Joi.string().required())
    .optional(),
  AdvisingScore: Joi.array().items(Joi.string().required()).optional(),
  AthleticScore: Joi.array().items(Joi.string().required()).optional(),
  GPA: Joi.array().items(Joi.string().required()).optional(),
  DisciplinaryActions: Joi.array().items(Joi.string().required()).optional(),
  BMI: Joi.string().empty("").default(null),
  PacerTest: Joi.string().empty("").default(null),
  MileTime: Joi.string().empty("").default(null),
  Situps: Joi.string().empty("").default(null),
  Pushups: Joi.string().empty("").default(null),
  HealthAndWellness: Joi.string().empty("").default(null),
  Highlights: Joi.string().empty("").default(null),
  IntroVideo: Joi.string().empty("").default(null),
  choice: Joi.string()
    .valid(...ExistingUser)
    .required(),
});

const UserSignUpPageOne: React.FC = () => {
  const router = useRouter();
  const { state } = useStateMachine();
  const { actions } = useStateMachine({
    updateActionPlayer,
    updateActionForm,
  });
  const [selectedPlayer, setSelectedPlayer] = useState<User | null>(
    state.playerForm.player
  );
  const [existingUser, setExistingUser] = useState(state.playerForm.choice);
  const [playerID, setPlayerID] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { errors, register, handleSubmit } = useForm<
    PlayerProfileFormValues & ExistingUserType
  >({
    resolver: joiResolver(PlayerProfileFormSchema),
  });

  async function onSubmit(
    values: PlayerProfileFormValues,
    event?: React.BaseSyntheticEvent
  ): Promise<void> {
    event?.preventDefault();
    if (submitting) {
      return;
    }
    try {
      if (selectedPlayer === null && existingUser === "Yes") {
        throw new Error("You must select or create a player to continue");
      }
      actions.updateActionPlayer(values);
      actions.updateActionPlayer({ id: playerID });
      actions.updateActionForm({
        choice: existingUser,
        player: selectedPlayer,
      });
      router.push("/admin/players/playerForm/overview");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="form flex mx-20 mt-24 flex-col">
        <p className="py-6 text-2xl h-16 tracking-wide font-medium">
          Create a new player profile
        </p>
        <p className="font-light mt-2">Description Here</p>
        <PlayerFormLayout tabNum={1}>
          <p className="pt-10 text-xl tracking-wider font-medium">
            Let&apos;s get started!
          </p>
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
                      defaultChecked={state.playerForm.choice === "Yes"}
                      onChange={(event) => setExistingUser(event.target.value)}
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
                      defaultChecked={state.playerForm.choice === "No"}
                      onChange={(event) => setExistingUser(event.target.value)}
                    />
                    <p className="text-sm ml-3 font-medium">No</p>
                  </label>
                  {existingUser === "Yes" ? (
                    <div>
                      <ComboBox
                        selectedPlayer={selectedPlayer}
                        setSelectedPlayer={setSelectedPlayer}
                        setPlayerID={setPlayerID}
                      />
                    </div>
                  ) : null}
                  {existingUser === "No" ? (
                    <NewPlayerInvitePage setPlayerID={setPlayerID} />
                  ) : null}
                </PlayerFormField>
              </div>
              <div className="grid grid-rows-2 mr-32">
                <PlayerFormField
                  label="Player Number"
                  name="PlayerNumber"
                  error={errors.PlayerNumber?.message}
                >
                  <input
                    type="text"
                    className="input text-sm"
                    name="PlayerNumber"
                    placeholder="e.g., 21"
                    ref={register}
                    defaultValue={state.playerData.PlayerNumber}
                  />
                </PlayerFormField>
                <PlayerFormField
                  label="Age"
                  name="age"
                  error={errors.age?.message}
                >
                  <input
                    type="text"
                    className="input text-sm"
                    name="age"
                    placeholder="e.g., 15"
                    ref={register}
                    defaultValue={state.playerData.age}
                  />
                </PlayerFormField>
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
