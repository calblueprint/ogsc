import { joiResolver } from "@hookform/resolvers/joi";
import Button from "components/Button";
import AddAbsences from "components/Player/PlayerForm/CreateAbsences";
import Joi from "joi";
import { useStateMachine } from "little-state-machine";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import updateActionPlayer from "utils/updateActionPlayer";
import DashboardLayout from "components/DashboardLayout";
import PlayerFormLayout from "components/Player/PlayerFormLayout";
import Icon from "components/Icon";
import Card from "components/Card";
import { formatAbsence } from "components/Player/PlayerForm/FormItems";
import Modal from "components/Modal";

export type AbsenceFormValues = {
  schoolAbsences: string[];
  academicAbsences: string[];
  athleticAbsences: string[];
};

const PlayerProfileFormSchema = Joi.object<AbsenceFormValues>({
  schoolAbsences: Joi.array().items(Joi.string().required()).optional(),
  academicAbsences: Joi.array().items(Joi.string().required()).optional(),
  athleticAbsences: Joi.array().items(Joi.string().required()).optional(),
});

const UserSignUpPageOne: React.FC = () => {
  const router = useRouter();
  const { action, state } = useStateMachine(updateActionPlayer);
  const [hidden, setHidden] = useState(false);
  const [schoolAbsences, SetSchoolAbsences] = useState<string[]>(
    state.playerData.SchoolAbsences ? state.playerData.SchoolAbsences : []
  );
  const [advisingAbsences, SetAdvisingAbsences] = useState<string[]>(
    state.playerData.AdvisingAbsences ? state.playerData.AdvisingAbsences : []
  );
  const [athleticAbsences, SetAthleticAbsences] = useState<string[]>(
    state.playerData.AthleticAbsences ? state.playerData.AthleticAbsences : []
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { handleSubmit } = useForm<AbsenceFormValues>({
    resolver: joiResolver(PlayerProfileFormSchema),
  });

  async function onSubmit(
    values: AbsenceFormValues,
    event?: React.BaseSyntheticEvent
  ): Promise<void> {
    event?.preventDefault();
    if (submitting) {
      return;
    }
    try {
      action(values);
      action({
        SchoolAbsences: schoolAbsences,
        AdvisingAbsences: advisingAbsences,
        AthleticAbsences: athleticAbsences,
      });
      router.push("/admin/players/playerForm/physicalWellness");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }
  const SchoolOnDelete = (value: string): void => {
    SetSchoolAbsences(
      schoolAbsences.filter((score: string) => score !== value)
    );
  };

  const AdvisingOnDelete = (value: string): void => {
    SetAdvisingAbsences(
      advisingAbsences.filter((score: string) => score !== value)
    );
  };

  const AthleticOnDelete = (value: string): void => {
    SetAthleticAbsences(
      athleticAbsences.filter((score: string) => score !== value)
    );
  };

  return (
    <DashboardLayout>
      <div className="form flex mx-20 mt-24 flex-col">
        <p className="py-6 text-2xl h-16 tracking-wide font-medium">
          Create a new player profile
        </p>
        <p className="font-light mt-2">Description Here</p>
        <PlayerFormLayout tabNum={5}>
          <p className="pt-10 pb-4 text-xl tracking-wider font-medium">
            School Absences
          </p>
          <p className="text-sm font-light pb-3">
            School Absences: {schoolAbsences.length}
          </p>
          {schoolAbsences &&
            schoolAbsences.map((value: string) => (
              <Card
                text={formatAbsence(value)}
                onDelete={() => SchoolOnDelete(value)}
              />
            ))}
          <p className="text-sm font-light pb-3">
            Academic Absences: {advisingAbsences.length}
          </p>
          {advisingAbsences &&
            advisingAbsences.map((value: string) => (
              <Card
                text={formatAbsence(value)}
                onDelete={() => AdvisingOnDelete(value)}
              />
            ))}
          <p className="text-sm font-light pb-3">
            Athletics Absences: {athleticAbsences.length}
          </p>
          {athleticAbsences &&
            athleticAbsences.map((value: string) => (
              <Card
                text={formatAbsence(value)}
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
                Add Absence
              </Button>
              <Modal className="w-2/3" open={hidden}>
                <AddAbsences
                  setHidden={setHidden}
                  advisingAbsences={advisingAbsences}
                  athleticAbsences={athleticAbsences}
                  schoolAbsences={schoolAbsences}
                  setAdvisingAbsences={SetAdvisingAbsences}
                  setAthleticAbsences={SetAthleticAbsences}
                  setSchoolAbsences={SetSchoolAbsences}
                />
              </Modal>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <hr className="border-unselected border-opacity-50 my-16" />
              <div className="flex mb-32">
                <div className="mb-2 flex justify-between w-full">
                  <Button
                    className="text-blue bg-white text-sm py-2 rounded-md tracking-wide"
                    onClick={() =>
                      router.push("/admin/players/playerForm/academics")
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
