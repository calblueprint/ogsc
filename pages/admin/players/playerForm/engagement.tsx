import { joiResolver } from "@hookform/resolvers/joi";
import Button from "components/Button";
import Joi from "joi";
import { useStateMachine } from "little-state-machine";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import updateActionPlayer from "utils/updateActionPlayer";
import DashboardLayout from "components/DashboardLayout";
import PlayerFormLayout from "components/Player/PlayerFormLayout";
import AddScoreField from "components/Player/PlayerForm/AddScoreField";
import Card from "components/Card";
import Icon from "components/Icon";
import { formatText } from "components/Player/PlayerForm/FormItems";
import type { PlayerProfileFormValues } from ".";

export type EngagementFormValues = Pick<
  PlayerProfileFormValues,
  "AcademicEngagementScore" | "AdvisingScore" | "AthleticScore"
>;

export const totalScore = (allScores: string[]): number => {
  let total = 0;
  const { length } = allScores;
  if (allScores && length > 0) {
    for (let x = 0; x < length; x += 1) {
      const scoreString = allScores[x].split(" ")[0];
      const score: number = +scoreString;
      total += score;
    }
    total /= length;
  }
  return total;
};

const PlayerProfileFormSchema = Joi.object<EngagementFormValues>({
  AcademicEngagementScore: Joi.array()
    .items(Joi.string().required())
    .optional(),
  AdvisingScore: Joi.array().items(Joi.string().required()).optional(),
  AthleticScore: Joi.array().items(Joi.string().required()).optional(),
});

const UserSignUpPageOne: React.FC = () => {
  const router = useRouter();
  const { action, state } = useStateMachine(updateActionPlayer);
  const [hidden, setHidden] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [schoolScores, SetSchoolScores] = useState<string[]>(
    state.playerData.AcademicEngagementScore
      ? state.playerData.AcademicEngagementScore
      : []
  );
  const [advisingScores, SetAdvisingScores] = useState<string[]>(
    state.playerData.AdvisingScore ? state.playerData.AdvisingScore : []
  );
  const [athleticScores, SetAthleticScores] = useState<string[]>(
    state.playerData.AthleticScore ? state.playerData.AthleticScore : []
  );
  const [error, setError] = useState("");
  const { handleSubmit } = useForm<EngagementFormValues>({
    resolver: joiResolver(PlayerProfileFormSchema),
  });

  async function onSubmit(
    values: EngagementFormValues,
    event?: React.BaseSyntheticEvent
  ): Promise<void> {
    event?.preventDefault();
    if (submitting) {
      return;
    }
    try {
      action(values);
      action({
        AcademicEngagementScore: schoolScores,
        AdvisingScore: advisingScores,
        AthleticScore: athleticScores,
      });
      router.push("/admin/players/playerForm/academics");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const SchoolOnDelete = (value: string): void => {
    SetSchoolScores(schoolScores.filter((score: string) => score !== value));
  };

  const AdvisingOnDelete = (value: string): void => {
    SetAdvisingScores(
      advisingScores.filter((score: string) => score !== value)
    );
  };

  const AthleticOnDelete = (value: string): void => {
    SetAthleticScores(
      athleticScores.filter((score: string) => score !== value)
    );
  };

  return (
    <DashboardLayout>
      <div className="form flex mx-20 mt-24 flex-col">
        <p className="py-6 text-2xl h-16 tracking-wide font-medium">
          Create a new player profile
        </p>
        <p className="font-light mt-2">Description Here</p>
        <PlayerFormLayout tabNum={3}>
          <p className="pt-10 text-xl tracking-wider font-medium pb-3">
            Engagement Scores
          </p>
          <p className="text-sm font-light pb-3">
            School engagement score: {totalScore(schoolScores)}
          </p>
          {schoolScores &&
            schoolScores.map((value: string) => (
              <Card
                text={formatText(value)}
                onDelete={() => SchoolOnDelete(value)}
              />
            ))}
          <p className="text-sm font-light pb-3">
            Academic Advising engagement score: {totalScore(advisingScores)}
          </p>
          {advisingScores &&
            advisingScores.map((value: string) => (
              <Card
                text={formatText(value)}
                onDelete={() => AdvisingOnDelete(value)}
              />
            ))}
          <p className="text-sm font-light pb-3">
            Athletics engagement score: {totalScore(athleticScores)}
          </p>
          {athleticScores &&
            athleticScores.map((value: string) => (
              <Card
                text={formatText(value)}
                onDelete={() => AthleticOnDelete(value)}
              />
            ))}
          <form className="mt-10 " onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
              <Button
                iconType="plus"
                onClick={() => setHidden(true)}
                className={`text-sm ${hidden ? "hidden" : ""}`}
              >
                Add Engagement Score
              </Button>
              {hidden ? (
                <AddScoreField
                  setHidden={setHidden}
                  advisingScores={advisingScores}
                  schoolScores={schoolScores}
                  athleticScores={athleticScores}
                  setAdvisingScores={SetAdvisingScores}
                  setSchoolScores={SetSchoolScores}
                  setAthleticScores={SetAthleticScores}
                />
              ) : null}
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <hr className="border-unselected border-opacity-50 my-16" />
              <div className="flex mb-32">
                <div className="mb-2 flex justify-between w-full">
                  <Button
                    className="text-blue bg-white text-sm py-2 rounded-md tracking-wide"
                    onClick={() =>
                      router.push("/admin/players/playerForm/overview")
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
