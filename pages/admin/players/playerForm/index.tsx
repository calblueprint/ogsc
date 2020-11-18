import type { ProfileFieldKey } from "@prisma/client";
import { joiResolver } from "@hookform/resolvers/joi";
import Button from "components/Button";
import PlayerFormField from "components/PlayerFormField";
import Joi from "joi";
import { useStateMachine } from "little-state-machine";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import updateAction from "utils/updateActionPlayer";
import DashboardLayout from "components/DashboardLayout";
import PlayerFormLayout from "components/Player/PlayerFormLayout";
import PlayerComboBox from "components/Player/PlayerComboBox";

export type PlayerProfileFormValues = {
  [ProfileFieldKey.PlayerNumber]: string;
  age: string;
  [ProfileFieldKey.BioAboutMe]: string;
  [ProfileFieldKey.BioHobbies]: string;
  [ProfileFieldKey.BioFavoriteSubject]: string;
  [ProfileFieldKey.BioMostDifficultSubject]: string;
  [ProfileFieldKey.BioSiblings]: string;
  [ProfileFieldKey.BioParents]: string;
  [ProfileFieldKey.AcademicEngagementScore]: string;
  [ProfileFieldKey.AdvisingScore]: string;
  [ProfileFieldKey.AthleticScore]: string;
  [ProfileFieldKey.GPA]: string;
  [ProfileFieldKey.DisciplinaryActions]: string;
  [ProfileFieldKey.BMI]: string;
  [ProfileFieldKey.PacerTest]: string;
  [ProfileFieldKey.MileTime]: string;
  [ProfileFieldKey.Situps]: string;
  [ProfileFieldKey.Pushups]: string;
  [ProfileFieldKey.HealthAndWellness]: string;
  [ProfileFieldKey.Highlights]: string;
  [ProfileFieldKey.IntroVideo]: string;
};

const PlayerProfileFormSchema = Joi.object<PlayerProfileFormValues>({
  PlayerNumber: Joi.string(),
  age: Joi.string(),
  BioAboutMe: Joi.string().empty("").default(null),
  BioHobbies: Joi.string().empty("").default(null),
  BioFavoriteSubject: Joi.string().empty("").default(null),
  BioMostDifficultSubject: Joi.string().empty("").default(null),
  BioSiblings: Joi.string().empty("").default(null),
  BioParents: Joi.string().empty("").default(null),
  AcademicEngagementScore: Joi.string().empty("").default(null),
  AdvisingScore: Joi.string().empty("").default(null),
  AthleticScore: Joi.string().empty("").default(null),
  GPA: Joi.string().empty("").default(null),
  DisciplinaryActions: Joi.string().empty("").default(null),
  BMI: Joi.string().empty("").default(null),
  PacerTest: Joi.string().empty("").default(null),
  MileTime: Joi.string().empty("").default(null),
  Situps: Joi.string().empty("").default(null),
  Pushups: Joi.string().empty("").default(null),
  HealthAndWellness: Joi.string().empty("").default(null),
  Highlights: Joi.string().empty("").default(null),
  IntroVideo: Joi.string().empty("").default(null),
});

const ExistingUser = ["Yes", "No"];

const UserSignUpPageOne: React.FC = () => {
  const router = useRouter();

  // TODO: Add loading state to form submission
  const [existingUser, setExistingUser] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { errors, register, handleSubmit } = useForm<PlayerProfileFormValues>({
    resolver: joiResolver(PlayerProfileFormSchema),
  });
  const { action, state } = useStateMachine(updateAction);

  async function onSubmit(
    values: PlayerProfileFormValues,
    event?: React.BaseSyntheticEvent
  ): Promise<void> {
    event?.preventDefault();
    if (submitting) {
      return;
    }
    try {
      action(values);
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
                {ExistingUser.map((option) => (
                  <label
                    className="font-medium flex items-center mb-2"
                    htmlFor={option}
                  >
                    <input
                      className="mr-5"
                      type="radio"
                      name="role"
                      id={option}
                      value={option}
                      ref={register}
                      onChange={(event) => setExistingUser(event.target.value)}
                    />
                    <p className="text-sm ml-3 font-medium">{option}</p>
                  </label>
                ))}
                {existingUser === "Yes" ? <PlayerComboBox /> : null}
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
              <hr className="border-unselected border-opacity-50 my-16" />
              <div className="flex mb-32">
                <div className="mb-2 flex justify-between w-full">
                  <Button
                    className="text-blue bg-white text-sm px-8 py-2 ml-10 rounded-md tracking-wide"
                    type="submit"
                  >
                    Back
                  </Button>
                  <Button
                    className="bg-blue text-sm px-5 py-2 text-white tracking-wide rounded-md"
                    type="submit"
                  >
                    Next Step
                  </Button>
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
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
