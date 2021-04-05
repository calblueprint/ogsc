import dayjs from "lib/day";
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
import colors from "../../constants/colors";
import type { Props as ValueHistoryViewProps } from "./ValueHistoryView";

export type ValueHistoryGraphProps = Pick<
  ValueHistoryViewProps,
  "primaryColor" | "valueLabel" | "valueRange"
> & {
  startDate: Date | null;
  endDate: Date | null;
  values: { value?: number; createdAt: Date }[];
};

const ValueHistoryGraph: React.FC<ValueHistoryGraphProps> = ({
  primaryColor,
  values,
  valueLabel,
  valueRange = [0, 10],
  startDate,
  endDate,
}: ValueHistoryGraphProps) => {
  const mutedPrimaryColor = `${primaryColor}-muted` as keyof typeof colors.mutedPalette;
  return (
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
        containerComponent={<VictoryVoronoiContainer voronoiDimension="x" />}
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
          y: valueRange,
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
          tickCount={valueRange[1] - valueRange[0] + 1}
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
          data={values.map((datum) => ({
            x: datum.createdAt,
            y: datum.value,
            label: [
              datum.createdAt.toLocaleDateString("default", {
                month: "short",
                year: "numeric",
              }),
              datum.value === 1
                ? `${datum.value} ${valueLabel}`
                : `${datum.value} ${
                    Array.isArray(valueLabel) ? valueLabel[1] : `${valueLabel}s`
                  }`,
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
                right: -10,
              }}
              pointerLength={5}
              pointerWidth={6}
              dy={-8}
              style={{ textAnchor: "start" }}
            />
          }
        >
          <VictoryArea
            animate={{ duration: 500 }}
            style={{
              data: {
                fill: `url(#${primaryColor}ChartFill)`,
                strokeWidth: 0,
              },
            }}
          />
          <VictoryLine
            animate={{ duration: 500 }}
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
        {values.map((datum) => (
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
  );
};

export default ValueHistoryGraph;
