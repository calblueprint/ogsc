import React from "react";
import DateComboBox from "components/Player/PlayerForm/DateComboBox";
import { years, months } from "components/Player/PlayerForm/FormItems";

type Props = React.PropsWithChildren<{
  SetGPA: React.Dispatch<React.SetStateAction<string>>;
  SetSelectMonth: React.Dispatch<React.SetStateAction<string>>;
  SetSelectYear: React.Dispatch<React.SetStateAction<string>>;
  SetComment: React.Dispatch<React.SetStateAction<string>>;
}>;

const GPAFieldContent: React.FC<Props> = ({
  SetGPA,
  SetComment,
  SetSelectMonth,
  SetSelectYear,
}: Props) => {
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
      </div>
    </fieldset>
  );
};

export default GPAFieldContent;
