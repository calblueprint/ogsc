import { joiResolver } from "@hookform/resolvers/joi";
import Button from "components/Button";
import PlayerFormField from "components/PlayerFormField";
import Joi from "joi";
import { StateMachineProvider, useStateMachine } from "little-state-machine";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import updateAction from "utils/updateActionPlayer";
import DashboardLayout from "components/DashboardLayout";
import PlayerFormLayout from "components/Player/PlayerFormLayout";

export type PlayerProfileFormValues = {
  playerNumber: string;
  age: string;
  aboutMe: string;
  hobbies: string;
  favoriteSubject: string;
  mostDifficultSubject: string;
  siblings: string;
  parents: string;
  schoolScore: string;
  academicScore: string;
  athleticsScore: string;
  gpa: string;
  disciplinaryActions: string;
  school: string;
  academic: string;
  athletics: string;
  bmi: string;
  beepTest: string;
  mileTime: string;
  sitUps: string;
  pushUps: string;
  healthWellness: string;
  video: string;
};

const PlayerProfileFormSchema = Joi.object<PlayerProfileFormValues>({
  playerNumber: Joi.string(),
  age: Joi.string(),
  aboutMe: Joi.string().empty("").default(null),
  hobbies: Joi.string().empty("").default(null),
  favoriteSubject: Joi.string().empty("").default(null),
  mostDifficultSubject: Joi.string().empty("").default(null),
  siblings: Joi.string().empty("").default(null),
  parents: Joi.string().empty("").default(null),

  schoolScore: Joi.string().empty("").default(null),
  academicScore: Joi.string().empty("").default(null),
  athleticsScore: Joi.string().empty("").default(null),

  gpa: Joi.string().empty("").default(null),
  disciplinaryActions: Joi.string().empty("").default(null),

  school: Joi.string().empty("").default(null),
  academic: Joi.string().empty("").default(null),
  athletics: Joi.string().empty("").default(null),

  bmi: Joi.string().empty("").default(null),
  beepTest: Joi.string().empty("").default(null),
  mileTime: Joi.string().empty("").default(null),
  sitUps: Joi.string().empty("").default(null),
  pushUps: Joi.string().empty("").default(null),
  healthWellness: Joi.string().empty("").default(null),

  video: Joi.string().empty("").default(null),
});

const UserSignUpPageOne: React.FC = () => {
  const router = useRouter();

  // TODO: Add loading state to form submission
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
      <StateMachineProvider>
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
                <div className="grid grid-rows-2 mr-32">
                  <PlayerFormField
                    label="Player Number"
                    name="playerNumber"
                    error={errors.playerNumber?.message}
                  >
                    <input
                      type="text"
                      className="input text-sm"
                      name="playerNumber"
                      placeholder="e.g., 21"
                      ref={register}
                      defaultValue={state.playerData.playerNumber}
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
                <div className="flex mb-32 justify-between align-middle">
                  <div className="mb-2 flex">
                    <Button
                      className="bg-blue text-sm px-5 py-2 text-white tracking-wide rounded-md"
                      type="submit"
                    >
                      Save + Continue
                    </Button>
                    <Button
                      className="border-2 border-blue text-blue bg-white text-sm px-12 py-2 ml-10 rounded-md tracking-wide"
                      type="submit"
                    >
                      Cancel
                    </Button>
                  </div>
                  {error && <p className="text-red-600 text-sm">{error}</p>}
                </div>
                <hr />
              </fieldset>
            </form>
          </PlayerFormLayout>
        </div>
      </StateMachineProvider>
    </DashboardLayout>
  );
};

export default UserSignUpPageOne;
