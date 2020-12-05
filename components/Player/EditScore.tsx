import Button from "components/Button";
import { useState } from "react";
import Joi from "joi";
import DateComboBox from "components/Player/PlayerForm/DateComboBox";
import { years, months } from "components/Player/PlayerForm/FormItems";
import type { field } from "components/Player/EditMore";
import { PlayerDTO } from "pages/api/admin/users/player/edit";
import { useRouter } from "next/router";
import Icon from "components/Icon";

type Props = React.PropsWithChildren<{
  setOption: React.Dispatch<React.SetStateAction<string>>;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setType: React.Dispatch<
    React.SetStateAction<"updated" | "added" | undefined>
  >;
  setDate: React.Dispatch<React.SetStateAction<string>>;
  currentScore: field;
  scoreCategory:
    | "AcademicEngagementScore"
    | "AdvisingScore"
    | "AthleticScore"
    | "BMI"
    | "GPA"
    | "PacerTest"
    | "Pushups"
    | "Situps";
}>;

const EditScore: React.FC<Props> = ({
  setOption,
  currentScore,
  setSuccess,
  setDate,
  setType,
}: Props) => {
  const router = useRouter();
  const [score, SetScore] = useState<string>(
    currentScore.value?.toString() ? currentScore.value?.toString() : ""
  );
  const [selectMonth, SetSelectMonth] = useState<string>(
    new Date(currentScore.createdAt).toLocaleString("default", {
      month: "short",
    })
  );
  const [selectYear, SetSelectYear] = useState<string>(
    currentScore.createdAt.getFullYear().toString()
  );
  const [comment, SetComment] = useState(currentScore.comment);
  const [error, setError] = useState("");

  const check = (): void => {
    Joi.assert(
      score,
      Joi.number().required().min(0).max(10),
      "Score is requried and must be a number 1 - 10 "
    );
    Joi.assert(
      selectMonth,
      Joi.string().required(),
      "You must select a Month "
    );
    Joi.assert(selectYear, Joi.number().required(), "You must select a Year ");
  };

  function getCategory(key: string): string {
    if (key === "AcademicEngagementScore") {
      return "School";
    }
    if (key === "AdvisingScore") {
      return "Advising";
    }
    return "Athletic";
  }

  async function ScoreSubmit(event?: React.BaseSyntheticEvent): Promise<void> {
    event?.preventDefault();
    try {
      check();
      const date = `${selectMonth} ${selectYear}`;
      const response = await fetch("/api/admin/users/player/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: currentScore.id,
          userId: currentScore.userId,
          comment,
          score,
          createdAt: new Date(date),
        } as PlayerDTO),
      });
      if (!response.ok) {
        throw await response.json();
      }
      const editedDate = `${new Date(currentScore.createdAt).toLocaleString(
        "default",
        {
          month: "long",
        }
      )} ${selectYear}`;
      setDate(editedDate);
      setType("updated");
      setSuccess(true);
      setOption("");
      router.replace(router.asPath);
    } catch (err) {
      setError(err.message);
    }
  }
  const header =
    currentScore.key === "GPA" ? (
      <div>
        <p className="text-2xl font-semibold mb-3">Edit Grade Point Average</p>
        <hr className="pb-4" />
        <p className="text-sm font-semibold mb-3 mt-10">GPA</p>
        <input
          type="text"
          className="input text-sm w-1/12 font-light"
          name="score"
          placeholder={currentScore.value?.toString()}
          onChange={(event) => SetScore(event.target.value)}
        />
      </div>
    ) : (
      <div>
        <p className="text-2xl font-semibold mb-3">Edit Engagement Score</p>
        <hr className="pb-4" />
        <p className="text-sm font-semibold mb-3">Score Category</p>
        <Button className="p-2 border cursor-not-allowed border-unselected w-40 h-10 rounded-lg bg-transparent font-light text-black justify-between">
          <p className="ml-2 text-sm">{getCategory(currentScore.key)}</p>
          <Icon className="w-3 h-3 stroke-current -ml-6 mr-3" type="chevron" />
        </Button>
        <p className="text-sm font-semibold mb-3 mt-10">Score</p>
        <input
          type="text"
          className="input text-sm w-1/12 font-light"
          name="score"
          placeholder={currentScore.value?.toString()}
          onChange={(event) => SetScore(event.target.value)}
        />
      </div>
    );
  return (
    <fieldset>
      <div className="rounded-lg">
        {header}
        <p className="text-sm font-semibold mb-3 mt-10">Month/Year</p>
        <div className="grid grid-cols-5 mb-10">
          <DateComboBox
            items={months}
            placeholder={new Date(currentScore.createdAt).toLocaleString(
              "default",
              {
                month: "short",
              }
            )}
            setState={SetSelectMonth}
          />
          <DateComboBox
            items={years}
            placeholder={currentScore.createdAt.getFullYear().toString()}
            setState={SetSelectYear}
          />
        </div>
        <p className="text-sm font-semibold mb-3 mt-10">Comments</p>
        <input
          type="text"
          className="input text-sm w-full font-light"
          name="comments"
          placeholder={
            currentScore.comment ? currentScore.comment : "comment here"
          }
          onChange={(event) => SetComment(event.target.value)}
        />
        <div className="flex flex-row gap-6 mt-10">
          <Button
            iconType="plus"
            className="py-2 px-5 text-sm"
            onClick={() => ScoreSubmit()}
          >
            Save
          </Button>
          <Button
            className="border border-blue bg-white py-2 px-12 text-sm border-opacity-100"
            onClick={() => setOption("")}
          >
            Cancel
          </Button>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>
    </fieldset>
  );
};
export default EditScore;
