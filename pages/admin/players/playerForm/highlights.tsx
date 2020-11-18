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
import type { PlayerProfileFormValues } from ".";
import type { PlayerUserDTO } from "../../../api/admin/users/player/update";

export type HighlightsFormValues = Pick<PlayerProfileFormValues, "Highlights">;

const PlayerProfileFormSchema = Joi.object<HighlightsFormValues>({
  Highlights: Joi.string().empty("").default(null),
});

const UserSignUpPageOne: React.FC = () => {
  const router = useRouter();

  // TODO: Add loading state to form submission
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { errors, register, handleSubmit } = useForm<HighlightsFormValues>({
    resolver: joiResolver(PlayerProfileFormSchema),
  });
  const { action, state } = useStateMachine(updateAction);

  async function onSubmit(
    values: HighlightsFormValues,
    event?: React.BaseSyntheticEvent
  ): Promise<void> {
    event?.preventDefault();
    if (submitting) {
      return;
    }
    try {
      action(values);
      const response = await fetch("/api/admin/users/player/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: 158,
          PlayerNumber: state.playerData.PlayerNumber,
          age: state.playerData.age,
          BioAboutMe: state.playerData.BioAboutMe,
          BioHobbies: state.playerData.BioHobbies,
          BioFavoriteSubject: state.playerData.BioFavoriteSubject,
          BioMostDifficultSubject: state.playerData.BioMostDifficultSubject,
          BioSiblings: state.playerData.BioSiblings,
          BioParents: state.playerData.BioParents,
          AcademicEngagementScore: state.playerData.AcademicEngagementScore,
          AdvisingScore: state.playerData.AdvisingScore,
          AthleticScore: state.playerData.AthleticScore,
          GPA: state.playerData.GPA,
          DisciplinaryActions: state.playerData.DisciplinaryActions,
          BMI: state.playerData.BMI,
          PacerTest: state.playerData.PacerTest,
          MileTime: state.playerData.MileTime,
          Situps: state.playerData.Situps,
          Pushups: state.playerData.Pushups,
          HealthAndWellness: state.playerData.HealthAndWellness,
          Highlights: state.playerData.Highlights,
        } as PlayerProfileFormValues & PlayerUserDTO),
      });
      if (!response.ok) {
        throw await response.json();
      }
      router.push("/admin/players/");
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
        <PlayerFormLayout tabNum={7}>
          <p className="pt-10 text-xl tracking-wider font-medium">
            Highlight Reel
          </p>
          <form className="mt-10 " onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
              <PlayerFormField
                label="Highlights"
                name="Highlights"
                error={errors.Highlights?.message}
              >
                <input
                  type="text"
                  className="text-sm"
                  name="Highlights"
                  ref={register}
                  defaultValue={state.playerData.Highlights}
                />
              </PlayerFormField>
              <hr className="border-unselected border-opacity-50 my-16" />
              <div className="flex mb-32 justify-between align-middle">
                <div className="mb-2 flex">
                  <Button
                    className="bg-blue text-base px-12 py-2 text-white tracking-wide rounded-md"
                    type="submit"
                  >
                    Submit
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
