import Button from "components/Button";
import { useState } from "react";
import Joi from "joi";
import GPAFieldContent from "components/Player/GPAFieldContent";

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
      <div>
        <GPAFieldContent
          SetComment={SetComment}
          SetGPA={SetGPA}
          SetSelectMonth={SetSelectMonth}
          SetSelectYear={SetSelectYear}
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
