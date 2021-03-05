import Button from "components/Button";
import { useState } from "react";
import Joi from "lib/validate";
import GPAFieldContent from "components/Player/GPAFieldContent";
import { useRouter } from "next/router";

type Props = React.PropsWithChildren<{
  setHidden: React.Dispatch<React.SetStateAction<boolean>>;
  userId: number | undefined;
}>;

const AddGPA: React.FC<Props> = ({ setHidden, userId }: Props) => {
  const router = useRouter();
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
      const response = await fetch("/api/admin/users/player/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: userId, GPA: [value] }),
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
        <GPAFieldContent
          SetGPA={SetGPA}
          SetComment={SetComment}
          SetSelectMonth={SetSelectMonth}
          SetSelectYear={SetSelectYear}
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
export default AddGPA;
