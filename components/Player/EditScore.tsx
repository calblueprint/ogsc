import Button from "components/Button";
import { useState } from "react";
import Joi from "joi";
import DateComboBox from "components/Player/PlayerForm/DateComboBox";
import { years, months } from "components/Player/PlayerForm/FormItems";
import type { field } from "components/Player/EditMore";
import { PlayerDTO } from "pages/api/admin/users/player/edit";

type Props = React.PropsWithChildren<{
  setHidden: React.Dispatch<React.SetStateAction<boolean>>;
  currentScore: field;
}>;

const EditScore: React.FC<Props> = ({ setHidden, currentScore }: Props) => {
  const [category, SetCategory] = useState<string>(currentScore.key);
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
      category,
      Joi.string().required(),
      "You must select a score category "
    );
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

  async function ScoreSubmit(event?: React.BaseSyntheticEvent): Promise<void> {
    event?.preventDefault();
    try {
      check();
      const date = selectMonth + selectYear;
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
      setHidden(false);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <fieldset>
      <div className="border border-border rounded-lg p-10">
        <p className="text-sm font-semibold mb-3">Score Category</p>
        <DateComboBox
          items={["School", "Advising", "Athletic"]}
          placeholder={currentScore.key}
          setState={SetCategory}
        />
        <p className="text-sm font-semibold mb-3 mt-10">Score</p>
        <input
          type="text"
          className="input text-sm w-1/12 font-light"
          name="score"
          placeholder={currentScore.value?.toString()}
          onChange={(event) => SetScore(event.target.value)}
        />
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
            Enter Score
          </Button>
          <Button
            className="border border-blue bg-white py-2 px-12 text-sm border-opacity-100"
            onClick={() => setHidden(false)}
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
