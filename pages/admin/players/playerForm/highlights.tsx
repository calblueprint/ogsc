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
import type { AbsenceFormValues } from "pages/admin/players/playerForm/attendence";
import updateActionForm from "utils/updateActionForm";
import updateActionSignUp from "utils/updateActionSignUp";
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
  const { actions, state } = useStateMachine({
    updateActionSignUp,
    updateActionPlayer,
    updateActionForm,
  });

  async function onSubmit(
    values: HighlightsFormValues,
    event?: React.BaseSyntheticEvent
  ): Promise<void> {
    event?.preventDefault();
    if (submitting) {
      return;
    }
    try {
      actions.updateActionPlayer(values);
      const response = await fetch("/api/admin/users/player/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: state.playerData.id,
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
      const response2 = await fetch("/api/admin/users/player/updateAbsences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: state.playerData.id,
          schoolAbsences: state.playerData.SchoolAbsences,
          academicAbsences: state.playerData.AdvisingAbsences,
          athleticAbsences: state.playerData.AthleticAbsences,
        } as AbsenceFormValues & PlayerUserDTO),
      });
      if (!response2.ok) {
        throw await response.json();
      }
      actions.updateActionPlayer({
        id: null,
        PlayerNumber: null,
        age: null,
        BioAboutMe: null,
        BioHobbies: null,
        BioFavoriteSubject: null,
        BioMostDifficultSubject: null,
        BioSiblings: null,
        BioParents: null,
        AcademicEngagementScore: [],
        AdvisingScore: [],
        AthleticScore: [],
        GPA: [],
        DisciplinaryActions: [],
        SchoolAbsences: [],
        AdvisingAbsences: [],
        AthleticAbsences: [],
        BMI: null,
        PacerTest: null,
        MileTime: null,
        Situps: null,
        Pushups: null,
        HealthAndWellness: null,
        Highlights: null,
      });
      actions.updateActionForm({
        choice: "",
        player: null,
      });
      actions.updateActionSignUp({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: null,
        adminNote: "",
      });
      router.push(
        `/admin/players/${state.playerData.id}?success=true`,
        `/admin/players/${state.playerData.id}`
      );
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
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <hr className="border-unselected border-opacity-50 my-16" />
              <div className="flex mb-32">
                <div className="mb-2 flex justify-between w-full">
                  <Button
                    className="text-blue bg-white text-sm py-2 rounded-md tracking-wide"
                    onClick={() =>
                      router.push("/admin/players/playerForm/physicalWellness")
                    }
                  >
                    <Icon className="mr-6 w-8 stroke-current" type="back" />
                    Back
                  </Button>
                  <Button
                    className="bg-blue text-sm px-5 py-2 text-white tracking-wide rounded-md"
                    type="submit"
                  >
                    Submit
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
