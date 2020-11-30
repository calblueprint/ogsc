import { years, months } from "components/Player/PlayerForm/FormItems";
import Button from "components/Button";
import { useState } from "react";
import Joi from "joi";
import DateComboBox from "components/Player/PlayerForm/DateComboBox";

type Props = React.PropsWithChildren<{
  setHidden: React.Dispatch<React.SetStateAction<boolean>>;
  listGPA: string[];
  setListGPA: React.Dispatch<React.SetStateAction<string[]>>;
}>;

const GPAScoreField: React.FC<Props> = ({
  setHidden,
  listGPA,
  setListGPA,
}: Props) => {
  const [GPA, SetGPA] = useState<string>("");
  const [selectMonth, SetSelectMonth] = useState<string>("");
  const [selectYear, SetSelectYear] = useState<string>("");
  const [comment, SetComment] = useState<string>("");
  const [error, setError] = useState("");

  const check = (): void => {
    Joi.assert(
      GPA,
      Joi.number().required().max(5).min(0),
      "You must input a GPA "
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
      const value = `${GPA} - ${dateShown} - ${comment}`;
      setListGPA(() => [...listGPA, value]);
      setHidden(false);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <fieldset>
      <p className="text-2xl font-semibold mb-3">Add Grade Point Average</p>
      <hr className="pb-8" />
      <div>
        <p className="text-sm font-semibold mb-3">Quarter GPA</p>
        <input
          type="text"
          className="input text-sm w-1/12 font-light"
          name="gpa"
          placeholder="eg. 3.51"
          onChange={(event) => SetGPA(event.target.value)}
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
            Enter Grade Point Average
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
export default GPAScoreField;
