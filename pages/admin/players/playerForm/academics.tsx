import { joiResolver } from "@hookform/resolvers/joi";
import Button from "components/Button";
import Joi from "lib/validate";
import { useStateMachine } from "little-state-machine";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import updateActionPlayer from "utils/updateActionPlayer";
import DashboardLayout from "components/DashboardLayout";
import PlayerFormLayout from "components/Player/PlayerFormLayout";
import GPAScoreField from "components/Player/PlayerForm/CreateGPAField";
import DisciplinaryField from "components/Player/PlayerForm/DisciplinaryField";
import { totalScore } from "pages/admin/players/playerForm/engagement";
import Card from "components/Card";
import Icon from "components/Icon";
import { formatText, formatDA } from "components/Player/PlayerForm/FormItems";
import Modal from "components/Modal";
import type { PlayerProfileFormValues } from ".";

export type AcademicFormValues = Pick<
  PlayerProfileFormValues,
  "GPA" | "DisciplinaryActions"
>;

const PlayerProfileFormSchema = Joi.object<AcademicFormValues>({
  GPA: Joi.string().empty("").default(null),
  DisciplinaryActions: Joi.string().empty("").default(null),
});

const UserSignUpPageOne: React.FC = () => {
  const router = useRouter();
  const { action, state } = useStateMachine(updateActionPlayer);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [hiddenGPA, setHiddenGPA] = useState(false);
  const [hiddenDA, setHiddenDA] = useState(false);
  const [listGPA, setListGPA] = useState<string[]>(
    state.playerData.GPA ? state.playerData.GPA : []
  );
  const [DisciplinaryActionList, SetDisciplinaryActions] = useState<string[]>(
    state.playerData.DisciplinaryActions
      ? state.playerData.DisciplinaryActions
      : []
  );
  const { handleSubmit } = useForm<AcademicFormValues>({
    resolver: joiResolver(PlayerProfileFormSchema),
  });

  async function onSubmit(
    values: AcademicFormValues,
    event?: React.BaseSyntheticEvent
  ): Promise<void> {
    event?.preventDefault();
    if (submitting) {
      return;
    }
    try {
      action(values);
      action({
        GPA: listGPA,
        DisciplinaryActions: DisciplinaryActionList,
      });
      router.push("/admin/players/playerForm/attendence");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }
  const OnDelete = (value: string): void => {
    setListGPA(listGPA.filter((gpa: string) => gpa !== value));
  };

  const OnDeleteAction = (value: string): void => {
    SetDisciplinaryActions(
      DisciplinaryActionList.filter((dAction: string) => dAction !== value)
    );
  };

  return (
    <DashboardLayout>
      <div className="form flex mx-20 mt-24 flex-col">
        <p className="py-6 text-2xl h-16 tracking-wide font-medium">
          Create a new player profile
        </p>
        <p className="font-light mt-2">Description Here</p>
        <PlayerFormLayout tabNum={4}>
          <p className="pt-10 text-xl tracking-wider font-medium">
            Grade Point Average
          </p>
          <p className="text-sm font-semibold pb-3 pt-10">GPA</p>
          <p className="text-sm font-light pb-3">
            Overall Grade Point Average: {totalScore(listGPA)}
          </p>
          {listGPA &&
            listGPA.map((value: string) => (
              <Card text={formatText(value)} onDelete={() => OnDelete(value)} />
            ))}
          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
              <Button
                iconType="plus"
                onClick={() => setHiddenGPA(true)}
                className={`text-sm ${hiddenGPA ? "hidden" : ""}`}
              >
                Add Grade Point Average
              </Button>
              <Modal className="w-2/3" open={hiddenGPA}>
                <GPAScoreField
                  setHidden={setHiddenGPA}
                  listGPA={listGPA}
                  setListGPA={setListGPA}
                />
              </Modal>
              <p className="text-sm font-semibold pb-3 pt-10">
                Disciplinary Actions
              </p>
              <p className="text-sm font-light pb-3">
                Total Disciplinary Actions: {DisciplinaryActionList.length}
              </p>
              {DisciplinaryActionList &&
                DisciplinaryActionList.map((value: string) => (
                  <Card
                    text={formatDA(value)}
                    onDelete={() => OnDeleteAction(value)}
                  />
                ))}
              <Button
                iconType="plus"
                onClick={() => setHiddenDA(true)}
                className={`text-sm ${hiddenDA ? "hidden" : ""}`}
              >
                Add Disciplinary Actions
              </Button>
              <Modal className="w-2/3" open={hiddenDA}>
                <DisciplinaryField
                  setHidden={setHiddenDA}
                  DisciplinaryActions={DisciplinaryActionList}
                  SetDisciplinaryActions={SetDisciplinaryActions}
                />
              </Modal>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <hr className="border-unselected border-opacity-50 my-16" />
              <div className="flex mb-32">
                <div className="mb-2 flex justify-between w-full">
                  <Button
                    className="text-blue bg-white text-sm py-2 rounded-md tracking-wide"
                    onClick={() =>
                      router.push("/admin/players/playerForm/engagement")
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
