import React, { useState } from "react";
import dayjs from "dayjs";
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryGroup,
  VictoryLabel,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";
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
  fieldLabel,
  shortFieldLabel,
  icon,
  primaryColor,
  values,
}: Props) => {
  const [historyView, setHistoryView] = useState<"graph" | "table">("graph");
  const [intervalWindow, setIntervalWindow] = useState<IntervalWindow>(
    IntervalWindow.LastSixMonths
  );
  const [startDate, endDate] = IntervalWindowBoundaries[intervalWindow];

  const deserializedValues = values.map(
    (field: IProfileField<NumericProfileFields>) => ({
      ...field,
      value: deserializeProfileFieldValue<ProfileField, NumericProfileFields>(
        field
      ),
      createdAt: new Date(field.createdAt),
    })
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
  const mutedPrimaryColor = `${primaryColor}-muted` as keyof typeof colors.mutedPalette;

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
              <th className="w-3/12 font-semibold">Score</th>
              <th className="font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredValues.map((field) => (
              <tr key={field.id} className="h-16 tr-border">
                <td className="w-3/12 pl-5">
                  {new Date(field.createdAt).toLocaleString("default", {
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="w-3/12">{field.value}</td>
                <td />
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {historyView === "graph" && (
        <>
          <svg style={{ height: 0 }}>
            <defs>
              <linearGradient
                id={`${primaryColor}ChartFill`}
                gradientTransform="rotate(90)"
              >
                <stop
                  offset="0%"
                  stopColor={colors.mutedPalette[mutedPrimaryColor]}
                />
                <stop
                  offset="100%"
                  stopColor={colors.mutedPalette[mutedPrimaryColor]}
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
          </svg>
          <VictoryChart
            containerComponent={
              <VictoryVoronoiContainer voronoiDimension="x" />
            }
            theme={{
              ...VictoryTheme.grayscale,
              axis: {
                style: {
                  grid: {
                    fill: "none",
                    stroke: "transparent",
                  },
                },
              },
            }}
            width={800}
            height={250}
            domain={{
              x: startDate && endDate ? [startDate, endDate] : undefined,
              y: [0, 10],
            }}
            scale={{
              x: "time",
            }}
          >
            <VictoryAxis
              style={{
                grid: {
                  stroke: colors.border,
                  pointerEvents: "painted",
                  strokeWidth: 0.5,
                  strokeDasharray: "3, 5",
                },
                axis: {
                  stroke: colors.unselected,
                  strokeWidth: 0.5,
                },
                tickLabels: {
                  fill: colors.unselected,
                  fontFamily: "Montserrat",
                  fontWeight: "600",
                  fontSize: "8px",
                  padding: "12",
                },
              }}
              tickValues={Array(11)
                .fill(0)
                .map((_, index: number) => index)}
              tickFormat={(x) => (![0, 5, 10].includes(x) ? "" : x)}
              dependentAxis
            />
            <VictoryAxis
              style={{
                axis: {
                  stroke: colors.unselected,
                  strokeWidth: 0.5,
                },
                tickLabels: {
                  fill: colors.unselected,
                  fontFamily: "Montserrat",
                  fontWeight: "600",
                  fontSize: "8px",
                  padding: "12",
                },
              }}
              tickFormat={
                startDate && endDate
                  ? (x) =>
                      new Date(x).toLocaleDateString("default", {
                        month: "short",
                      })
                  : undefined
              }
              tickValues={
                startDate && endDate
                  ? Array(dayjs(endDate).diff(dayjs(startDate), "month") + 1)
                      .fill(null)
                      .map((_, index) =>
                        dayjs(startDate)
                          .startOf("month")
                          .add(index, "month")
                          .toDate()
                      )
                  : undefined
              }
            />
            <VictoryGroup
              data={deserializedValues.map((datum) => ({
                x: datum.createdAt,
                y: datum.value,
                label: [
                  datum.createdAt.toLocaleDateString("default", {
                    month: "short",
                    year: "numeric",
                  }),
                  datum.value === 1
                    ? `${datum.value} point`
                    : `${datum.value} points`,
                ],
              }))}
              labelComponent={
                <VictoryTooltip
                  labelComponent={
                    <VictoryLabel
                      lineHeight={[1.5, 1]}
                      style={[
                        {
                          fill: "#FFFFFF",
                          fontFamily: "Montserrat",
                          fontSize: "6px",
                          fontWeight: 500,
                          opacity: 0.8,
                        },
                        {
                          fill: "#FFFFFF",
                          fontFamily: "Montserrat",
                          fontSize: "8px",
                          fontWeight: 600,
                        },
                      ]}
                    />
                  }
                  flyoutStyle={{
                    fill: colors.palette[primaryColor],
                    strokeWidth: 0,
                  }}
                  cornerRadius={3}
                  flyoutPadding={{
                    top: -3,
                    bottom: -3,
                    left: 5,
                    right: -5,
                  }}
                  pointerLength={5}
                  pointerWidth={6}
                  dy={-8}
                  style={{ textAnchor: "start" }}
                />
              }
            >
              <VictoryArea
                animate
                style={{
                  data: {
                    fill: `url(#${primaryColor}ChartFill)`,
                    strokeWidth: 0,
                  },
                }}
              />
              <VictoryLine
                animate
                style={{
                  data: {
                    stroke: colors.palette[primaryColor],
                    strokeWidth: 1.5,
                  },
                }}
              />
              <VictoryScatter
                size={({ active }) => (active ? 4 : 0)}
                style={{
                  data: {
                    fill: colors.palette[primaryColor],
                    stroke: "#FFFFFF",
                    strokeWidth: 2,
                  },
                }}
              />
            </VictoryGroup>
            {deserializedValues.map((datum) => (
              <VictoryLine
                style={{
                  data: {
                    stroke: ({ active }) =>
                      active ? colors.palette[primaryColor] : "transparent",
                    strokeDasharray: "6, 4",
                    strokeWidth: 1.5,
                  },
                }}
                data={[
                  { x: datum.createdAt, y: 0 },
                  { x: datum.createdAt, y: datum.value },
                ]}
              />
            ))}
          </VictoryChart>
        </>
      )}
    </div>
  );
};

ValueHistoryView.defaultProps = {
  shortFieldLabel: undefined,
};

export default ValueHistoryView;
