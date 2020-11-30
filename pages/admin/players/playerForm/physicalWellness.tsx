import { joiResolver } from "@hookform/resolvers/joi";
import Button from "components/Button";
import PlayerFormField from "components/PlayerFormField";
import Joi from "joi";
import { useStateMachine } from "little-state-machine";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import updateActionPlayer from "utils/updateActionPlayer";
import DashboardLayout from "components/DashboardLayout";
import PlayerFormLayout from "components/Player/PlayerFormLayout";
import Icon from "components/Icon";
import type { PlayerProfileFormValues } from ".";

export type PhysicalWellnessFormValues = Pick<
  PlayerProfileFormValues,
  "BMI" | "PacerTest" | "MileTime" | "Situps" | "Pushups" | "HealthAndWellness"
>;

const PlayerProfileFormSchema = Joi.object<PhysicalWellnessFormValues>({
  BMI: Joi.string().empty("").default(null),
  PacerTest: Joi.string().empty("").default(null),
  MileTime: Joi.string().empty("").default(null),
  Situps: Joi.string().empty("").default(null),
  Pushups: Joi.string().empty("").default(null),
  HealthAndWellness: Joi.string().empty("").default(null),
});

const UserSignUpPageOne: React.FC = () => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const {
    errors,
    register,
    handleSubmit,
  } = useForm<PhysicalWellnessFormValues>({
    resolver: joiResolver(PlayerProfileFormSchema),
  });
  const { action, state } = useStateMachine(updateActionPlayer);

  async function onSubmit(
    values: PhysicalWellnessFormValues,
    event?: React.BaseSyntheticEvent
  ): Promise<void> {
    event?.preventDefault();
    if (submitting) {
      return;
    }
    try {
      action(values);
      router.push("/admin/players/playerForm/highlights");
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
        <PlayerFormLayout tabNum={6}>
          <p className="pt-10 text-xl tracking-wider font-medium">
            Height and Weight
          </p>
          <form className="mt-10 " onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
              <div className="grid grid-rows-2">
                <PlayerFormField
                  label="BMI"
                  name="BMI"
                  error={errors.BMI?.message}
                >
                  <input
                    type="text"
                    className="input text-sm"
                    name="BMI"
                    placeholder="eg. 21.2"
                    ref={register}
                    defaultValue={state.playerData.BMI}
                  />
                </PlayerFormField>
                <p className="pt-10 text-xl tracking-wider font-medium">
                  Fitness Testing
                </p>
                <PlayerFormField
                  label="Pacer Test"
                  name="PacerTest"
                  error={errors.PacerTest?.message}
                >
                  <input
                    type="text"
                    className="input text-sm"
                    name="PacerTest"
                    placeholder="eg. 65"
                    ref={register}
                    defaultValue={state.playerData.PacerTest}
                  />
                </PlayerFormField>
                <PlayerFormField
                  label="Mile Time"
                  name="MileTime"
                  error={errors.MileTime?.message}
                >
                  <input
                    type="text"
                    className="input text-sm"
                    name="MileTime"
                    placeholder="eg. 7:48"
                    ref={register}
                    defaultValue={state.playerData.MileTime}
                  />
                </PlayerFormField>
                <PlayerFormField
                  label="Sit-Ups"
                  name="Situps"
                  error={errors.Situps?.message}
                >
                  <input
                    type="text"
                    className="input text-sm"
                    name="Situps"
                    placeholder="eg. 87"
                    ref={register}
                    defaultValue={state.playerData.Situps}
                  />
                </PlayerFormField>
                <PlayerFormField
                  label="Push Ups"
                  name="Pushups"
                  error={errors.Pushups?.message}
                >
                  <input
                    type="text"
                    className="input text-sm"
                    name="Pushups"
                    placeholder="eg.32"
                    ref={register}
                    defaultValue={state.playerData.Pushups}
                  />
                </PlayerFormField>
                <p className="pt-10 text-xl tracking-wider font-medium">
                  Health & Wellness
                </p>
                <PlayerFormField
                  label=""
                  name="HealthAndWellness"
                  error={errors.HealthAndWellness?.message}
                >
                  <input
                    type="text"
                    className="input text-sm w-full"
                    name="HealthAndWellness"
                    placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                    ref={register}
                    defaultValue={state.playerData.HealthAndWellness}
                  />
                </PlayerFormField>
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <hr className="border-unselected border-opacity-50 my-16" />
              <div className="flex mb-32">
                <div className="mb-2 flex justify-between w-full">
                  <Button
                    className="text-blue bg-white text-sm py-2 rounded-md tracking-wide"
                    onClick={() =>
                      router.push("/admin/players/playerForm/attendence")
                    }
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
