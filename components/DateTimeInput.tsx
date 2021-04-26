import dayjs, { Dayjs } from "dayjs";

export type DateTimeInputProps = {
  hideMonth?: boolean;
  hideDay?: boolean;
  hideYear?: boolean;
  /**
   * Defaults to [2015, <current year>]. Maximum is inclusive.
   */
  yearRange?: [number, number];
  onChange?: (date: Dayjs) => void;
  value?: dayjs.ConfigType;
};

const DateTimeInput: React.FC<DateTimeInputProps> = ({
  hideMonth,
  hideDay,
  hideYear,
  yearRange = [2015, dayjs().year()],
  onChange,
  value,
}: DateTimeInputProps) => {
  const date = dayjs(value);
  const [minYear, maxYear] = yearRange;
  const yearDiff = maxYear - minYear + 1;
  if (yearDiff <= 0) {
    throw new Error("Year range must be specified as [min, max].");
  }

  return (
    <div className="flex items-center">
      {!hideMonth && (
        <select
          value={date.month()}
          className="select mr-3"
          onChange={({
            target: { value: monthValue },
          }: React.ChangeEvent<HTMLSelectElement>) => {
            const newDate = dayjs(date).month(Number(monthValue));
            onChange?.(newDate);
          }}
        >
          {Array(12)
            .fill(null)
            .map((_: null, month: number) => (
              // Options are stable:
              // eslint-disable-next-line react/no-array-index-key
              <option key={month} value={month}>
                {dayjs().month(month).format("MMMM")}
              </option>
            ))}
        </select>
      )}
      {!hideDay && (
        <select
          value={date.date()}
          className="select mr-3"
          onChange={({
            target: { value: dayValue },
          }: React.ChangeEvent<HTMLSelectElement>) => {
            const newDate = dayjs(date).date(Number(dayValue));
            onChange?.(newDate);
          }}
        >
          {Array(date.daysInMonth())
            .fill(null)
            .map((_: null, day: number) => (
              <option
                // Options are stable:
                // eslint-disable-next-line react/no-array-index-key
                key={`${date.month()}-${day}-${date.year()}`}
                value={day + 1}
              >
                {dayjs()
                  .month(date.month())
                  .year(date.year())
                  .date(day + 1)
                  .format("DD")}
              </option>
            ))}
        </select>
      )}
      {!hideYear && (
        <select
          value={date.year()}
          className="select"
          onChange={({
            target: { value: yearValue },
          }: React.ChangeEvent<HTMLSelectElement>) => {
            const newDate = dayjs(date).year(Number(yearValue));
            onChange?.(newDate);
          }}
        >
          {Array(yearDiff)
            .fill(null)
            .map((_: null, index: number) => {
              const year = minYear + index;
              return (
                <option key={year} value={year}>
                  {dayjs().year(year).format("YYYY")}
                </option>
              );
            })}
        </select>
      )}
    </div>
  );
};

DateTimeInput.defaultProps = {
  hideDay: false,
  hideMonth: false,
  hideYear: false,
  onChange: undefined,
  value: undefined,
  yearRange: undefined,
};

export default DateTimeInput;
