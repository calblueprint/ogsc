import React, { useState } from "react";
import Button from "components/Button";
import { useStateMachine } from "little-state-machine";
import { PlayerUserDTO } from "pages/api/admin/users/player/update";
import { PlayerProfileFormValues } from "pages/admin/players/playerForm";
import { useRouter } from "next/router";
import updateActionPlayer from "utils/updateActionPlayer";

type BioEditProps = React.PropsWithChildren<{
  editState: React.Dispatch<React.SetStateAction<boolean>>;
  playerID: number | undefined;
}>;

const BioEdit: React.FunctionComponent<BioEditProps> = ({
  editState,
  playerID,
  children,
}: BioEditProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { action, state } = useStateMachine(updateActionPlayer);
  const router = useRouter();

  async function onSubmit(): Promise<void> {
    if (submitting) {
      return;
    }
    try {
      const response = await fetch("/api/admin/users/player/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: playerID,
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
      editState(false);
      action({
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
      router.replace(router.asPath);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <div>
      <div>{children}</div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="flex flex-row gap-8 justify-end pb-4">
        <Button
          type="button"
          className="border border-blue text-blue bg-white text-sm px-10 py-2 rounded-md tracking-wide"
          onClick={() => editState(false)}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-blue text-sm px-12 py-2 text-white tracking-wide rounded-md"
          onClick={() => onSubmit()}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default BioEdit;
