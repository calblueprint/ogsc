import React from "react";
import BarTab from "./ProgressBar";

type Props = {
  children: React.ReactNode;
  tabNum: number;
};

const PlayerFormLayout: React.FC<Props> = ({ children, tabNum }: Props) => {
  return (
    <div className="text-dark">
      <div className="mt-6 grid grid-cols-7 gap-4">
        <BarTab fill content="1. Basic Info" title="" />
        <BarTab
          fill={!(tabNum < 2)}
          content="2. Student Overview"
          title="overview"
        />
        <BarTab
          fill={!(tabNum < 3)}
          content="3. Engagement"
          title="engagement"
        />
        <BarTab fill={!(tabNum < 4)} content="4. Academics" title="academics" />
        <BarTab
          fill={!(tabNum < 5)}
          content="5. Attendence"
          title="attendence"
        />
        <BarTab
          fill={!(tabNum < 6)}
          content="6. Physical Wellness"
          title="physicalWellness"
        />
        <BarTab
          fill={!(tabNum < 7)}
          content="7. Highlights"
          title="highlights"
        />
      </div>
      <div>{children}</div>
    </div>
  );
};

export default PlayerFormLayout;
