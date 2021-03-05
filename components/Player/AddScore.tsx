import Button from "components/Button";
import { useState } from "react";
import Joi from "lib/validate";
import ScoreFieldContent from "components/Player/ScoreFieldContent";
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
      let body;
      if (field === "School") {
        body = JSON.stringify({
          id: userId,
          AcademicEngagementScore: [value],
        });
      } else if (field === "Advising") {
        body = JSON.stringify({
          id: userId,
          AdvisingScore: [value],
        });
      } else {
        body = JSON.stringify({
          id: userId,
          AthleticScore: [value],
        });
      }
      const response = await fetch("/api/admin/users/player/update", {
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
        <ScoreFieldContent
          SetField={SetField}
          SetScore={SetScore}
          SetComment={SetComment}
          SetSelectMonth={SetSelectMonth}
          SetSelectYear={SetSelectYear}
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
