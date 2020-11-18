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
import { PlayerProfileFormValues } from ".";

export type AttendenceFormValues = Pick<
  PlayerProfileFormValues,
  "AcademicEngagementScore" | "AdvisingScore" | "AthleticScore"
>;

const PlayerProfileFormSchema = Joi.object<AttendenceFormValues>({
  AcademicEngagementScore: Joi.string().empty("").default(null),
  AdvisingScore: Joi.string().empty("").default(null),
  AthleticScore: Joi.string().empty("").default(null),
});

const UserSignUpPageOne: React.FC = () => {
  const router = useRouter();

  // TODO: Add loading state to form submission
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { errors, register, handleSubmit } = useForm<AttendenceFormValues>({
    resolver: joiResolver(PlayerProfileFormSchema),
  });
  const { action, state } = useStateMachine(updateAction);

  async function onSubmit(
    values: AttendenceFormValues,
    event?: React.BaseSyntheticEvent
  ): Promise<void> {
    event?.preventDefault();
    if (submitting) {
      return;
    }
    try {
      action(values);
      router.push("/admin/players/playerForm/physicalWellness");
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
        <PlayerFormLayout tabNum={5}>
          <p className="pt-10 text-xl tracking-wider font-medium">
            School Absences
          </p>
          <form className="mt-10 " onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
              <PlayerFormField
                label="Placeholder"
                name="AdvisingScore"
                error={errors.AdvisingScore?.message}
              >
                <input
                  type="text"
                  className="input text-sm"
                  name="AdvisingScore"
                  placeholder="This is a placeholder"
                  ref={register}
                  defaultValue={state.playerData.AdvisingScore}
                />
              </PlayerFormField>
              <hr className="border-unselected border-opacity-50 my-16" />
              <div className="flex mb-32 justify-between align-middle">
                <div className="mb-2 flex">
                  <Button
                    className="bg-blue text-base px-5 py-2 text-white tracking-wide rounded-md"
                    type="submit"
                  >
                    Save + Continue
                  </Button>
                  <Button
                    className="border-2 border-blue text-blue bg-white text-base px-12 py-2 ml-10 rounded-md tracking-wide"
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
    </DashboardLayout>
  );
};

export default UserSignUpPageOne;
