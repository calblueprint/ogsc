import React, { useState } from "react";
import dayjs from "lib/day";

import { ProfileField } from "@prisma/client";
import Button from "components/Button";
import Icon, { IconType } from "components/Icon";
import { IProfileField, NumericProfileFields } from "interfaces";
import { deserializeProfileFieldValue } from "utils/buildUserProfile";
import Modal from "components/Modal";
import EditMore from "components/Player/EditMore";
import labelProfileField from "utils/labelProfileField";
import colors from "../../constants/colors";
import EditField from "./EditField";
import ValueHistoryGraph from "./ValueHistoryGraph";

export type Props = {
  fieldKey: NumericProfileFields;

  /**
   * This label will be used as a short descriptor for the value type, i.e. Average "GPA" instead
   * of Average Grade Point Average.
   */
  shortFieldLabel?: string;

  icon: IconType;

  primaryColor: keyof typeof colors.palette;

  values: IProfileField<NumericProfileFields>[];

  /**
   * Specify the range of possible valules as [minimum, maximum].
   */
  valueRange?: [number, number];

  /**
   * Specify a noun and optionally, its pluaral form for what a value should be labeled as in a
   * chart, i.e. "3 **points**", "20 **pacers**".
   */
  valueLabel?: string | [string, string];
};

enum IntervalWindow {
  LastSixMonths,
  LastTwelveMonths,
  ThisYear,
  AllTime,
}

const IntervalWindowLabels: Record<IntervalWindow, string> = {
  [IntervalWindow.LastSixMonths]: "Last 6 Months",
  [IntervalWindow.LastTwelveMonths]: "Last 12 Months",
  [IntervalWindow.ThisYear]: "This Year",
  [IntervalWindow.AllTime]: "All Time",
};

const IntervalWindowBoundaries: Record<
  IntervalWindow,
  [Date | null, Date | null]
> = {
  [IntervalWindow.LastSixMonths]: [
    dayjs().subtract(6, "month").toDate(),
    dayjs().toDate(),
  ],
  [IntervalWindow.LastTwelveMonths]: [
    dayjs().subtract(12, "month").toDate(),
    dayjs().toDate(),
  ],
  [IntervalWindow.ThisYear]: [
    dayjs().startOf("year").toDate(),
    dayjs().endOf("year").toDate(),
  ],
  [IntervalWindow.AllTime]: [null, null],
};

const ValueHistoryView: React.FC<Props> = ({
  fieldKey,
  shortFieldLabel,
  icon,
  primaryColor,
  values,
  valueLabel = ["", ""],
  valueRange = [0, 10],
}: Props) => {
  const fieldLabel = labelProfileField(fieldKey);
  const [historyView, setHistoryView] = useState<"graph" | "table">("graph");
  const [intervalWindow, setIntervalWindow] = useState<IntervalWindow>(
    IntervalWindow.LastSixMonths
  );
  const [newValueFormOpen, setNewValueFormOpen] = useState(false);
  const [startDate, endDate] = IntervalWindowBoundaries[intervalWindow];

  const deserializedValues = values.map(
    (field: IProfileField<NumericProfileFields>) => {
      const deserialized = deserializeProfileFieldValue<
        ProfileField,
        NumericProfileFields
      >(field);
      return {
        ...field,
        ...(typeof deserialized === "number"
          ? {}
          : { comment: deserialized?.comment }),
        value:
          typeof deserialized === "number" ? deserialized : deserialized?.value,
        createdAt: new Date(field.createdAt),
      };
    }
  );
  const filteredValues = deserializedValues.filter(({ createdAt }) =>
    startDate && endDate
      ? dayjs(createdAt).isBefore(endDate) &&
        dayjs(createdAt).isAfter(startDate)
      : true
  );

  const averageValue =
    filteredValues.reduce(
      (total: number, field: typeof filteredValues[number]) =>
        total + (field.value ?? 0),
      0
    ) /
    filteredValues.filter(
      (field: typeof filteredValues[number]) => field.value !== null
    ).length;

  return (
    <div className="mb-10">
      <h2 className="text-dark text-lg font-semibold my-5">{fieldLabel}</h2>
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
            {averageValue.toFixed(1)}
            <span className="text-dark text-base">/ {valueRange[1]}</span>
          </p>
          <p className="text-sm text-unselected">
            Average {shortFieldLabel || fieldLabel}
          </p>
        </div>
      </div>
      <div className="mt-5 flex justify-between items-center text-sm">
        <div className="font-semibold">
          <label htmlFor="viewing-window">{fieldLabel} History for</label>
          <select
            className="ml-3 select"
            id="viewing-window"
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setIntervalWindow(Number(event.target.value) as IntervalWindow)
            }
          >
            {Object.entries(IntervalWindowLabels).map(
              ([interval, label]: [string, string]) => (
                <option value={interval}>{label}</option>
              )
            )}
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
              <th className="w-2/12 font-semibold">Score</th>
              <th className="w-5/12 font-semibold">Description</th>
              <th className="w-1/12 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredValues.map((field) => (
              <tr key={field.id} className="h-16 tr-border">
                <td className="w-3/12 px-5">
                  {new Date(field.createdAt).toLocaleString("default", {
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="w-2/12">{field.value}</td>
                <td>{field.comment}</td>
                <td className="w-1/12">
                  <EditMore fieldKey={field.key} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {historyView === "graph" && (
        <ValueHistoryGraph
          primaryColor={primaryColor}
          values={deserializedValues}
          valueLabel={valueLabel}
          valueRange={valueRange}
          startDate={startDate}
          endDate={endDate}
        />
      )}
      <div className="mb-16 mt-8 grid grid-rows-2 w-full justify-end">
        <Button iconType="plus" onClick={() => setNewValueFormOpen(true)}>
          Add Engagement Score
        </Button>
      </div>
      <Modal open={newValueFormOpen} className="w-2/3">
        <EditField
          fieldKey={fieldKey}
          onComplete={() => {
            setNewValueFormOpen(false);
            // TODO: Dispatch notification
          }}
        />
      </Modal>
    </div>
  );
};

ValueHistoryView.defaultProps = {
  shortFieldLabel: undefined,
  valueRange: [0, 10],
  valueLabel: ["", ""],
};

export default ValueHistoryView;
