import React, { useState } from "react";
import dayjs from "lib/day";

import { ProfileField } from "@prisma/client";
import Button from "components/Button";
import { IconType } from "components/Icon";
import {
  IProfileField,
  NumericProfileFields,
  ProfileFieldValueDeserializedTypes,
  ProfileFieldValues,
  UncreatedProfileField,
} from "interfaces";
import { deserializeProfileFieldValue } from "utils/buildUserProfile";
import labelProfileField from "utils/labelProfileField";
import colors from "../../constants/colors";
import LargeFieldCellLayout from "./LargeFieldCellLayout";
import ProfileFieldEditorModal from "./ProfileFieldEditorModal";
import ValueHistoryGraph from "./ValueHistoryGraph";
import ValueHistoryTable from "./ValueHistoryTable";
import ValueHistorySummary from "./ValueHistorySummary";

export type Props = {
  fieldKey: NumericProfileFields;

  /**
   * This label will be used as a short descriptor for the value type, i.e. Average "GPA" instead
   * of Average Grade Point Average.
   */
  shortFieldLabel?: string;

  icon: IconType;

  primaryColor: keyof typeof colors.palette;

  values: (
    | IProfileField<NumericProfileFields>
    | UncreatedProfileField<NumericProfileFields>
  )[];

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
  const [startDate, endDate] = IntervalWindowBoundaries[intervalWindow];

  const deserializedValues = values

    .map((field: IProfileField<NumericProfileFields>) => {
      const deserialized = deserializeProfileFieldValue<
        ProfileField,
        NumericProfileFields
      >(field);
      return deserialized;
    })
    .filter(
      (
        value
      ): value is ProfileFieldValueDeserializedTypes[ProfileFieldValues[NumericProfileFields]] =>
        value != null
    );

  const filteredValues = deserializedValues.filter((value) =>
    value != null && startDate && endDate
      ? dayjs(value.date).isBefore(endDate, "day") &&
        dayjs(value.date).isAfter(startDate, "day")
      : true
  );

  const averageValue =
    filteredValues.reduce(
      (total: number, field: typeof filteredValues[number]) =>
        total + (field?.value ?? 0),
      0
    ) /
    (filteredValues.filter(
      (field: typeof filteredValues[number]) => field?.value !== null
    ).length || 1);

  return (
    <LargeFieldCellLayout fieldKey={fieldKey}>
      <ValueHistorySummary
        icon={icon}
        color={primaryColor}
        displayedValue={averageValue}
        maxValue={valueRange[1]}
      >
        Average {shortFieldLabel || fieldLabel}
      </ValueHistorySummary>
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
                <option key={interval} value={interval}>
                  {label}
                </option>
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
        <ValueHistoryTable
          fieldKey={fieldKey}
          values={values}
          startDate={startDate}
          endDate={endDate}
        />
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
      <div className="mt-8 flex w-full justify-end">
        <ProfileFieldEditorModal fieldKey={fieldKey} shouldToastOnSuccess />
      </div>
    </LargeFieldCellLayout>
  );
};

ValueHistoryView.defaultProps = {
  shortFieldLabel: undefined,
  valueRange: [0, 10],
  valueLabel: ["", ""],
};

export default ValueHistoryView;
