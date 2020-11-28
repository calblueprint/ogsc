import Button from "components/Button";
import { useState } from "react";
import Joi from "joi";
import DateComboBox from "components/Player/PlayerForm/DateComboBox";
import { years, months, getDays } from "components/Player/PlayerForm/FormItems";

type Props = React.PropsWithChildren<{
  setHidden: React.Dispatch<React.SetStateAction<boolean>>;
  schoolAbsences: string[];
  setSchoolAbsences: React.Dispatch<React.SetStateAction<string[]>>;
  advisingAbsences: string[];
  setAdvisingAbsences: React.Dispatch<React.SetStateAction<string[]>>;
  athleticAbsences: string[];
  setAthleticAbsences: React.Dispatch<React.SetStateAction<string[]>>;
}>;

const AddAbsencesField: React.FC<Props> = ({
  setHidden,
  schoolAbsences,
  setSchoolAbsences,
  advisingAbsences,
  setAdvisingAbsences,
  athleticAbsences,
  setAthleticAbsences,
}: Props) => {
  const [field, SetField] = useState<string>("");
  const [type, SetType] = useState<string>("");
  const [description, SetDescription] = useState<string>("");
  const [selectDay, SetSelectDay] = useState<string>("");
  const [selectMonth, SetSelectMonth] = useState<string>("");
  const [selectYear, SetSelectYear] = useState<string>("");
  const [error, setError] = useState("");

  const check = (): void => {
    Joi.assert(
      field,
      Joi.string().required(),
      "You must select a score category "
    );
    Joi.assert(
      type,
      Joi.string().required(),
      "You must select if this absence is excused or unexcused. "
    );
    Joi.assert(
      description,
      Joi.string().required(),
      "Please describe the reason for absence."
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

  async function AbsenceSubmit(
    event?: React.BaseSyntheticEvent
  ): Promise<void> {
    event?.preventDefault();
    try {
      check();
      const dateShown = `${selectDay} ${selectMonth} ${selectYear}`;
      const value = `${dateShown} - ${type} - ${description}`;
      if (field === "School") {
        setSchoolAbsences(() => [...schoolAbsences, value]);
      } else if (field === "Advising") {
        setAdvisingAbsences(() => [...advisingAbsences, value]);
      } else {
        setAthleticAbsences(() => [...athleticAbsences, value]);
      }
      setHidden(false);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <fieldset>
      <div className="border border-border rounded-lg p-10">
        <p className="text-sm font-semibold mb-3">Absence Category</p>
        <DateComboBox
          items={["School", "Advising", "Athletic"]}
          placeholder=""
          setState={SetField}
        />
        <p className="text-sm font-semibold mb-3 mt-10">Absence Date</p>
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
        <p className="text-sm font-semibold mb-3">Excused/Unexcused</p>
        <DateComboBox
          items={["Excused", "Unexcused"]}
          placeholder=""
          setState={SetType}
        />
        <p className="text-sm font-semibold mb-3 mt-10">Description</p>
        <input
          type="text"
          className="input text-sm w-full font-light"
          name="description"
          placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          onChange={(event) => SetDescription(event.target.value)}
        />
        <div className="flex flex-row gap-6 pt-10">
          <Button
            iconType="plus"
            className="py-2 px-5 text-sm"
            onClick={() => AbsenceSubmit()}
          >
            Enter Absence
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
export default AddAbsencesField;
