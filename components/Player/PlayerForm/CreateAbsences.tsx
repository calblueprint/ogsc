import Button from "components/Button";
import { useState } from "react";
import Joi from "lib/validate";
import AbsenceFieldContent from "components/Player/AbsenceFieldContent";

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
      <div>
        <AbsenceFieldContent
          SetDescription={SetDescription}
          SetField={SetField}
          SetSelectDay={SetSelectDay}
          SetSelectMonth={SetSelectMonth}
          SetSelectYear={SetSelectYear}
          SetType={SetType}
          selectMonth={selectMonth}
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
