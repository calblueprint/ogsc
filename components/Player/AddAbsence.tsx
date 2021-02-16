import Button from "components/Button";
import { useState } from "react";
import Joi from "lib/validate";
import AbsenceFieldContent from "components/Player/AbsenceFieldContent";
import { useRouter } from "next/router";

type Props = React.PropsWithChildren<{
  setHidden: React.Dispatch<React.SetStateAction<boolean>>;
  userId: number | undefined;
  category: string;
}>;

const AddScoreField: React.FC<Props> = ({
  setHidden,
  userId,
  category,
}: Props) => {
  const router = useRouter();
  const [field, SetField] = useState<string>(category);
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

  async function ScoreSubmit(event?: React.BaseSyntheticEvent): Promise<void> {
    event?.preventDefault();
    try {
      check();
      const dateShown = `${selectDay} ${selectMonth} ${selectYear}`;
      const value = `${dateShown} - ${type} - ${description}`;
      let body;
      if (field === "School") {
        body = JSON.stringify({
          id: userId,
          schoolAbsences: [value],
        });
      } else if (field === "Advising") {
        body = JSON.stringify({
          id: userId,
          academicAbsences: [value],
        });
      } else {
        body = JSON.stringify({
          id: userId,
          athleticAbsences: [value],
        });
      }
      const response = await fetch("/api/admin/users/player/updateAbsences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body,
      });
      if (!response.ok) {
        throw await response.json();
      }
      router.replace(router.asPath);
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
          preset={category}
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
