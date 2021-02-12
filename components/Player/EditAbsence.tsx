import Button from "components/Button";
import { useState } from "react";
import Joi from "lib/validate";
import DateComboBox from "components/Player/PlayerForm/DateComboBox";
import { years, months, getDays } from "components/Player/PlayerForm/FormItems";
import { useRouter } from "next/router";
import { Absence } from "@prisma/client";
import Icon from "components/Icon";

type Props = React.PropsWithChildren<{
  setOption: React.Dispatch<React.SetStateAction<string>>;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setType: React.Dispatch<
    React.SetStateAction<"updated" | "added" | "deleted" | undefined>
  >;
  setDate: React.Dispatch<React.SetStateAction<string>>;
  currentAbsence: Absence;
}>;

const EditAbsence: React.FC<Props> = ({
  setOption,
  currentAbsence,
  setSuccess,
  setDate,
  setType,
}: Props) => {
  const router = useRouter();
  const [reason, setReason] = useState<string>(currentAbsence.reason);
  const [selectDay, SetSelectDay] = useState<string>(
    currentAbsence.date.getDay().toString()
  );
  const [selectMonth, SetSelectMonth] = useState<string>(
    new Date(currentAbsence.date).toLocaleString("default", {
      month: "long",
    })
  );
  const [selectYear, SetSelectYear] = useState<string>(
    currentAbsence.date.getFullYear().toString()
  );
  const [comment, SetComment] = useState(currentAbsence.description);
  const [error, setError] = useState("");

  const check = (): void => {
    Joi.assert(
      comment,
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
      const date = `${selectDay}-${selectMonth}-${selectYear}`;
      const response = await fetch("/api/admin/users/player/editAbsences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: currentAbsence.id,
          userId: currentAbsence.userId,
          date: new Date(date),
          reason,
          description: comment,
        } as Absence),
      });
      if (!response.ok) {
        throw await response.json();
      }
      setDate(`${selectMonth} ${selectDay}, ${selectYear}`);
      setType("updated");
      setSuccess(true);
      setOption("");
      router.replace(router.asPath);
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <fieldset>
      <div className="rounded-lg">
        <p className="text-2xl font-semibold mb-3">Edit Engagement Score</p>
        <hr className="pb-4" />
        <p className="text-sm font-semibold mb-3">Score Category</p>
        <Button className="p-2 border cursor-not-allowed border-unselected w-40 h-10 rounded-lg bg-transparent font-light text-black justify-between">
          <p className="ml-2 text-sm">{currentAbsence.type}</p>
          <Icon className="w-3 h-3 stroke-current -ml-6 mr-3" type="chevron" />
        </Button>
        <p className="text-sm font-semibold mb-3 mt-10">Month/Year</p>
        <div className="grid grid-cols-5 mb-10">
          <DateComboBox
            items={months}
            placeholder={new Date(currentAbsence.date).toLocaleString(
              "default",
              {
                month: "long",
              }
            )}
            setState={SetSelectMonth}
          />
          <DateComboBox
            items={getDays(selectMonth)}
            placeholder={currentAbsence.date.getDate().toString()}
            setState={SetSelectDay}
          />
          <DateComboBox
            items={years}
            placeholder={currentAbsence.date.getFullYear().toString()}
            setState={SetSelectYear}
          />
        </div>
        <p className="text-sm font-semibold mb-3">Excused/Unexcused</p>
        <DateComboBox
          items={["Excused", "Unexcused"]}
          placeholder={currentAbsence.reason}
          setState={setReason}
        />
        <p className="text-sm font-semibold mb-3 mt-10">Description</p>
        <input
          type="text"
          className="input text-sm w-full font-light"
          name="comments"
          placeholder={currentAbsence.description}
          onChange={(event) => SetComment(event.target.value)}
        />
        <div className="flex flex-row gap-6 mt-10">
          <Button
            iconType="plus"
            className="py-2 px-5 text-sm"
            onClick={() => ScoreSubmit()}
          >
            Save
          </Button>
          <Button
            className="border border-blue bg-white py-2 px-12 text-sm border-opacity-100"
            onClick={() => setOption("")}
          >
            Cancel
          </Button>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>
    </fieldset>
  );
};
export default EditAbsence;
