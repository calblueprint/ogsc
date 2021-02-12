import { years, months, getDays } from "components/Player/PlayerForm/FormItems";
import Button from "components/Button";
import { useState } from "react";
import Joi from "lib/validate";
import DateComboBox from "components/Player/PlayerForm/DateComboBox";

type Props = React.PropsWithChildren<{
  setHidden: React.Dispatch<React.SetStateAction<boolean>>;
  DisciplinaryActions: string[];
  SetDisciplinaryActions: React.Dispatch<React.SetStateAction<string[]>>;
}>;

const DAScoreField: React.FC<Props> = ({
  setHidden,
  DisciplinaryActions,
  SetDisciplinaryActions,
}: Props) => {
  const [DisciplinaryAction, SetDisciplinaryAction] = useState<string>("");
  const [selectMonth, SetSelectMonth] = useState<string>("");
  const [selectYear, SetSelectYear] = useState<string>("");
  const [selectDay, SetSelectDay] = useState<string>("");
  const [error, setError] = useState("");

  const check = (): void => {
    Joi.assert(
      DisciplinaryAction,
      Joi.string().required(),
      "You must input a Disciplinary Action"
    );
    Joi.assert(
      selectDay,
      Joi.number().required().max(31).min(1),
      "You must select a Day "
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
      const dateShown = `${selectDay} ${selectMonth} ${selectYear}`;
      const value = `${DisciplinaryAction} - ${dateShown}`;
      SetDisciplinaryActions(() => [...DisciplinaryActions, value]);
      setHidden(false);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <fieldset>
      <p className="text-2xl font-semibold mb-3">Add Disciplinary Action</p>
      <hr className="pb-8" />
      <div>
        <p className="text-sm font-semibold mb-3">
          Nature of Disciplinary Action
        </p>
        <input
          type="text"
          className="input text-sm w-full font-light"
          name="DisciplinaryAction"
          placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          onChange={(event) => SetDisciplinaryAction(event.target.value)}
        />
        <p className="text-sm font-semibold mb-3 mt-10">Month/Year</p>
        <div className="grid grid-cols-5 mb-10">
          <DateComboBox
            items={months}
            placeholder="Month"
            setState={SetSelectMonth}
          />
          <DateComboBox
            items={getDays(selectMonth)}
            placeholder="Day"
            setState={SetSelectDay}
          />
          <DateComboBox
            items={years}
            placeholder="Year"
            setState={SetSelectYear}
          />
        </div>
        <div className="flex flex-row gap-6">
          <Button
            iconType="plus"
            className="py-2 px-5 text-sm"
            onClick={() => ScoreSubmit()}
          >
            Enter Disciplinary Action
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
export default DAScoreField;
