import Icon, { IconType } from "components/Icon";
import colors from "constants/colors";
import React from "react";

type Props = React.PropsWithChildren<{
  icon: IconType;
  color: keyof typeof colors.palette;
  displayedValue: number;
  maxValue: number;
}>;

const ValueHistorySummary: React.FC<Props> = ({
  icon,
  color,
  displayedValue,
  maxValue,
  children,
}: Props) => {
  return (
    <div className="flex items-center">
      <div
        className={`flex w-16 h-16 justify-center items-center bg-${color}-muted rounded-lg mr-6`}
      >
        <Icon className={`text-${color} fill-current w-6 h-6`} type={icon} />
      </div>
      <div>
        <p className={`text-2xl text-${color} font-semibold leading-none mb-1`}>
          {displayedValue.toFixed(1)}{" "}
          <span className="text-dark text-base">/ {maxValue}</span>
        </p>
        <p className="text-sm text-unselected">{children}</p>
      </div>
    </div>
  );
};

export default ValueHistorySummary;
