import React from "react";
import DateComboBox from "components/Player/PlayerForm/DateComboBox";
import { years, months, getDays } from "components/Player/PlayerForm/FormItems";

type Props = React.PropsWithChildren<{
  SetField: React.Dispatch<React.SetStateAction<string>>;
  selectMonth: string;
  SetSelectDay: React.Dispatch<React.SetStateAction<string>>;
  SetType: React.Dispatch<React.SetStateAction<string>>;
  SetDescription: React.Dispatch<React.SetStateAction<string>>;
  SetSelectMonth: React.Dispatch<React.SetStateAction<string>>;
  SetSelectYear: React.Dispatch<React.SetStateAction<string>>;
  preset?: string;
}>;

const AbsenceFieldContent: React.FC<Props> = ({
  SetField,
  selectMonth,
  SetSelectDay,
  SetType,
  SetDescription,
  SetSelectMonth,
  SetSelectYear,
  preset,
}: Props) => {
  return (
    <fieldset>
      <p className="text-2xl font-semibold mb-3">Add Absence</p>
      <hr className="pb-8" />
      <div>
        <p className="text-sm font-semibold mb-3">Absence Category</p>
        <DateComboBox
          items={["School", "Advising", "Athletic"]}
          placeholder={preset || ""}
          setState={SetField}
          short
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
          short
        />
        <p className="text-sm font-semibold mb-3 mt-10">Description</p>
        <input
          type="text"
          className="input text-sm w-full font-light"
          name="description"
          placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          onChange={(event) => SetDescription(event.target.value)}
        />
      </div>
    </fieldset>
  );
};

export default AbsenceFieldContent;
