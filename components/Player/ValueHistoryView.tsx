import React, { useState } from "react";
import { ProfileField } from "@prisma/client";
import Button from "components/Button";
import Icon, { IconType } from "components/Icon";
import {
  IProfileField,
  ProfileFieldKey,
  ProfileFieldValue,
  ProfileFieldValues,
} from "interfaces";
import { deserializeProfileFieldValue } from "utils/buildUserProfile";
import colors from "../../constants/colors";

type NumericProfileFields = Exclude<
  {
    [K in ProfileFieldKey]: ProfileFieldValues[K] extends
      | ProfileFieldValue.Integer
      | ProfileFieldValue.Float
      ? K
      : never;
  }[ProfileFieldKey],
  never
>;

type Props = {
  /**
   * This label will be used as the header for the history view.
   */
  fieldLabel: string;

  /**
   * This label will be used as a short descriptor for the value type, i.e. Average "GPA" instead
   * of Average Grade Point Average.
   */
  shortFieldLabel?: string;

  icon: IconType;

  primaryColor: keyof typeof colors.palette;

  values: IProfileField<NumericProfileFields>[];
};

const ValueHistoryView: React.FC<Props> = ({
  fieldLabel,
  shortFieldLabel,
  icon,
  primaryColor,
  values,
}: Props) => {
  const [historyView, setHistoryView] = useState<"graph" | "table">("table");

  const averageValue =
    values.reduce(
      (total: number, field: ProfileField) =>
        total +
        (deserializeProfileFieldValue<ProfileField, NumericProfileFields>(
          field
        ) ?? 0),
      0
    ) / values.filter((field: ProfileField) => field.value !== null).length;

  return (
    <div>
      <h2 className="text-dark text-lg font-semibold mb-5">{fieldLabel}</h2>
      <div className="flex items-center">
        <div
          className={`flex w-16 h-16 justify-center items-center bg-${primaryColor}-muted rounded-lg mr-6`}
        >
          <Icon
            className={`text-${primaryColor} fill-current w-6 h-6`}
            type={icon}
          />
        </div>
        <div>
          <p
            className={`text-2xl text-${primaryColor} font-semibold leading-none mb-1`}
          >
            {averageValue.toFixed(1)}{" "}
            <span className="text-dark text-base">/ 10</span>
          </p>
          <p className="text-sm text-unselected">
            Average {shortFieldLabel || fieldLabel}
          </p>
        </div>
      </div>
      <div className="mt-5 flex justify-between items-center text-sm">
        <div className="font-semibold">
          <label htmlFor="viewing-window">{fieldLabel} History for</label>
          <select className="ml-3 select" id="viewing-window">
            <option>This Year</option>
            <option>This Month</option>
            <option>Last 30 Days</option>
            <option>Last 6 Months</option>
          </select>
        </div>
        <div className="flex">
          <Button
            className={`bg-transparent navigation-tab rounded-full border-none py-2 mr-2 leading-7 ${
              historyView === "graph"
                ? `bg-${primaryColor}-muted text-${primaryColor} font-semibold`
                : ""
            }`}
            onClick={() => setHistoryView("graph")}
          >
            Graph
          </Button>
          <Button
            className={`bg-transparent navigation-tab rounded-full border-none py-2 leading-7 ${
              historyView === "table"
                ? `bg-${primaryColor}-muted text-${primaryColor} font-semibold`
                : ""
            }`}
            onClick={() => setHistoryView("table")}
          >
            Table
          </Button>
        </div>
      </div>
      {historyView === "table" && (
        <table className="w-full mt-4">
          <thead>
            <tr className="h-10 text-left text-unselected tr-border">
              <th className="w-3/12 pl-5 font-semibold">Date</th>
              <th className="w-3/12 font-semibold">Score</th>
              <th className="font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            {values.map((field: IProfileField<NumericProfileFields>) => (
              <tr key={field.id} className="h-16 tr-border">
                <td className="w-3/12 pl-5">
                  {new Date(field.createdAt).toLocaleString("default", {
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="w-3/12">
                  {deserializeProfileFieldValue<
                    ProfileField,
                    NumericProfileFields
                  >(field)}
                </td>
                <td />
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

ValueHistoryView.defaultProps = {
  shortFieldLabel: undefined,
};

export default ValueHistoryView;
