import React from "react";
import DateComboBox from "components/Player/PlayerForm/DateComboBox";
import { years, months } from "components/Player/PlayerForm/FormItems";

type Props = React.PropsWithChildren<{
  SetField: React.Dispatch<React.SetStateAction<string>>;
  SetScore: React.Dispatch<React.SetStateAction<string>>;
  SetSelectMonth: React.Dispatch<React.SetStateAction<string>>;
  SetSelectYear: React.Dispatch<React.SetStateAction<string>>;
  SetComment: React.Dispatch<React.SetStateAction<string>>;
  preset?: string;
}>;

const ScoreFieldContent: React.FC<Props> = ({
  SetField,
  SetScore,
  SetComment,
  SetSelectMonth,
  SetSelectYear,
  preset,
}: Props) => {
  return (
    <fieldset>
      <p className="text-2xl font-semibold mb-3">Add Engagement Score</p>
      <hr className="pb-8" />
      <div>
        <p className="text-sm font-semibold mb-3">Score Category</p>
        <DateComboBox
          items={["School", "Advising", "Athletic"]}
          placeholder={preset || ""}
          setState={SetField}
          short
        />
        <p className="text-sm font-semibold mb-3 mt-10">Score</p>
        <input
          type="text"
          className="input text-sm w-1/12 font-light"
          name="score"
          placeholder="1 - 10"
          onChange={(event) => SetScore(event.target.value)}
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

export default ScoreFieldContent;
