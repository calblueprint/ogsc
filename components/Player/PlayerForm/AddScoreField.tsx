import Button from "components/Button";
import { useState } from "react";
import Joi from "joi";
import DateComboBox from "components/Player/PlayerForm/DateComboBox";
import { years, months } from "components/Player/PlayerForm/FormItems";

type Props = React.PropsWithChildren<{
  setHidden: React.Dispatch<React.SetStateAction<boolean>>;
  schoolScores: string[];
  setSchoolScores: React.Dispatch<React.SetStateAction<string[]>>;
  advisingScores: string[];
  setAdvisingScores: React.Dispatch<React.SetStateAction<string[]>>;
  athleticScores: string[];
  setAthleticScores: React.Dispatch<React.SetStateAction<string[]>>;
}>;

const AddScoreField: React.FC<Props> = ({
  setHidden,
  schoolScores,
  setSchoolScores,
  advisingScores,
  setAdvisingScores,
  athleticScores,
  setAthleticScores,
}: Props) => {
  const [field, SetField] = useState<string>("");
  const [score, SetScore] = useState<string>("");
  const [selectMonth, SetSelectMonth] = useState<string>("");
  const [selectYear, SetSelectYear] = useState<string>("");
  const [comment, SetComment] = useState<string>("");
  const [error, setError] = useState("");

  const check = (): void => {
    Joi.assert(
      field,
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
      const dateShown = `${selectMonth} ${selectYear}`;
      const value = `${score} - ${dateShown} - ${comment}`;
      if (field === "School") {
        setSchoolScores(() => [...schoolScores, value]);
      } else if (field === "Advising") {
        setAdvisingScores(() => [...advisingScores, value]);
      } else {
        setAthleticScores(() => [...athleticScores, value]);
      }
      setHidden(false);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <fieldset>
      <p className="text-2xl font-semibold mb-3">Add Engagement Score</p>
      <hr className="pb-8" />
      <div>
        <p className="text-sm font-semibold mb-3">Score Category</p>
        <DateComboBox
          items={["School", "Advising", "Athletic"]}
          placeholder=""
          setState={SetField}
        />
        <p className="text-sm font-semibold mb-3 mt-10">Score</p>
        <input
          type="text"
          className="input text-sm w-1/12 font-light"
          name="score"
          placeholder="1 - 10"
          onChange={(event) => SetScore(event.target.value)}
        />
        <p className="text-sm font-semibold mb-3 mt-10">Month/Year</p>
        <div className="grid grid-cols-4 mb-10">
          <DateComboBox
            items={months}
            placeholder="Month"
            setState={SetSelectMonth}
          />
          <DateComboBox
            items={years}
            placeholder="Year"
            setState={SetSelectYear}
          />
        </div>
        <p className="text-sm font-semibold mb-3 mt-10">Comments</p>
        <input
          type="text"
          className="input text-sm w-full font-light"
          name="comments"
          placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
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
export default AddScoreField;
