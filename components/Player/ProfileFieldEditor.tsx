import {
  Absence,
  AbsenceReason,
  AbsenceType,
  ProfileField,
  ProfileFieldKey,
} from "@prisma/client";
import { Dayjs } from "dayjs";
import {
  IProfileField,
  IProfileFieldBuilt,
  ProfileFieldValue,
  ProfileFieldValueDeserializedTypes,
  ProfileFieldValues,
} from "interfaces";
import dayjs from "lib/day";
import React, { useContext, useEffect, useState } from "react";
import { deserializeProfileFieldValue } from "utils/buildUserProfile";
import isAbsence from "utils/isAbsence";
import labelProfileField from "utils/labelProfileField";
import ProfileContext from "./ProfileContext";

type Props =
  | {
      profileField: IProfileFieldBuilt<ProfileFieldKey>;
    }
  | {
      /**
       * If profileField is specified as an IProfileField or Absence, the ProfileFieldEditor will
       * assume that you want to update a specific profile field's value rather than create a new
       * ProfileField in the database, which is why `updateExisting` must be specified as true to
       * disambiguate its meaning.
       */
      profileField: IProfileField | Absence;
      updateExisting: true;
    };

type InputProps = React.ComponentPropsWithRef<"input"> & { unit?: string };
const NumberEditor: React.FC<InputProps> = ({ unit, ...props }: InputProps) => {
  const input = (
    <input
      {...props}
      className={`${props.className ?? ""} input`}
      type="number"
    />
  );
  if (unit) {
    return (
      <div className="flex items-center">
        {input}
        <p className="ml-3 mr-6">{unit}</p>
      </div>
    );
  }
  return input;
};
NumberEditor.defaultProps = {
  unit: undefined,
};

type DateTimeInputProps = {
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
const DateTimeEditor: React.FC<DateTimeInputProps> = ({
  hideMonth,
  hideDay,
  hideYear,
  yearRange = [2015, dayjs().year()],
  onChange,
  value,
}: DateTimeInputProps) => {
  const [date, setDate] = useState(dayjs(value));
  useEffect(() => {
    onChange?.(date);
  }, [date, onChange]);

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
            setDate(newDate);
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
            setDate(newDate);
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
            setDate(newDate);
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
DateTimeEditor.defaultProps = {
  hideDay: false,
  hideMonth: false,
  hideYear: false,
  onChange: undefined,
  value: undefined,
  yearRange: undefined,
};

const ProfileFieldEditor: React.FC<Props> = (props: Props) => {
  const { dispatch } = useContext(ProfileContext);

  let profileKey: ProfileFieldKey;
  let profileField: ProfileField | undefined;
  if ("updateExisting" in props) {
    if (isAbsence(props.profileField)) {
      const absence = props.profileField;
      return (
        <div>
          <p className="text-sm font-semibold mb-2">Score Category</p>
          <select value={absence.type} className="select">
            {Object.values(AbsenceType).map((type: AbsenceType) => (
              <option value={type}>{type}</option>
            ))}
          </select>
          <p className="text-sm font-semibold mb-2 mt-8">Month/Year</p>
          <DateTimeEditor hideDay />
          <p className="text-sm font-semibold mb-2 mt-8">Excused/Unexcused</p>
          <select value={absence.reason} className="select">
            {Object.values(AbsenceReason).map((reason: AbsenceReason) => (
              <option value={reason}>{reason}</option>
            ))}
          </select>
          <p className="text-sm font-semibold mb-2 mt-8">Description</p>
          <input
            type="text"
            className="input text-sm w-full font-light"
            placeholder={absence.description}
          />
        </div>
      );
    }
    profileKey = props.profileField.key;
    profileField = props.profileField;
  } else {
    profileKey = props.profileField.key;
    profileField = props.profileField.current;
  }
  const valueType = ProfileFieldValues[profileKey];
  const deserializedValue = deserializeProfileFieldValue(profileField);

  switch (valueType) {
    case ProfileFieldValue.IntegerWithComment:
    case ProfileFieldValue.FloatWithComment:
      return (
        <div>
          <p className="text-sm font-semibold mb-3 mt-10">
            {profileField ? labelProfileField(profileField) : ""} Value
          </p>
          <input type="text" className="input text-sm w-1/12 font-light" />
          <p className="text-sm font-semibold mb-3 mt-10">Month/Year</p>
          <div className="grid grid-cols-5 mb-10">
            <DateTimeEditor hideDay />
          </div>
          <p className="text-sm font-semibold mb-3 mt-10">Comments</p>
          <input
            type="text"
            className="input text-sm w-full font-light"
            name="comments"
          />
        </div>
      );
    case ProfileFieldValue.TimeElapsed: {
      const value = deserializedValue as
        | ProfileFieldValueDeserializedTypes[typeof valueType]
        | null;
      return (
        <div className="flex items-center">
          <NumberEditor
            step={1}
            unit="minutes"
            placeholder="8"
            min={0}
            defaultValue={value?.minutes()}
            onChange={(event) => {
              dispatch({
                type: "EDIT_FIELD",
                key: profileKey,
                value: dayjs.duration({
                  minutes: event.target.value,
                  seconds: value?.seconds(),
                }),
              });
            }}
          />
          <NumberEditor
            unit="seconds"
            placeholder="8"
            min={0}
            max={59}
            defaultValue={value?.seconds()}
            onChange={(event) => {
              dispatch({
                type: "EDIT_FIELD",
                key: profileKey,
                value: dayjs.duration({
                  minutes: value?.minutes(),
                  seconds: event.target.value,
                }),
              });
            }}
          />
        </div>
      );
    }
    case ProfileFieldValue.DistanceMeasured: {
      const value = deserializedValue as
        | ProfileFieldValueDeserializedTypes[typeof valueType]
        | null;
      return (
        <div className="flex items-center">
          <NumberEditor
            step={1}
            unit="feet"
            placeholder="5"
            min={0}
            defaultValue={value?.feet}
            onChange={(event) => {
              dispatch({
                type: "EDIT_FIELD",
                key: profileKey,
                value: {
                  inches: 0,
                  ...value,
                  feet: Number(event.target.value),
                },
              });
            }}
          />
          <NumberEditor
            unit="inches"
            placeholder="5"
            min={0}
            max={11}
            defaultValue={value?.inches}
            onChange={(event) => {
              dispatch({
                type: "EDIT_FIELD",
                key: profileKey,
                value: {
                  feet: 0,
                  ...value,
                  inches: Number(event.target.value),
                },
              });
            }}
          />
        </div>
      );
    }
    case ProfileFieldValue.Integer:
    case ProfileFieldValue.Text:
    default: {
      const value = deserializedValue as
        | ProfileFieldValueDeserializedTypes[typeof valueType]
        | null;
      return (
        <input
          type="text"
          className="input"
          name={profileKey}
          defaultValue={value ?? undefined}
          onChange={(event) =>
            dispatch({
              type: "EDIT_FIELD",
              key: profileKey,
              value: event.target.value,
            })
          }
        />
      );
    }
  }
};

export default ProfileFieldEditor;
