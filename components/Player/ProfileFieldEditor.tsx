import {
  Absence,
  AbsenceReason,
  AbsenceType,
  ProfileFieldKey,
} from "@prisma/client";
import { Dayjs } from "dayjs";
import {
  IAbsence,
  IProfileField,
  IProfileFieldBuilt,
  NumericProfileFields,
  ProfileFieldKeysOfProfileValueType,
  ProfileFieldValue,
  ProfileFieldValueDeserializedTypes,
  ProfileFieldValues,
} from "interfaces";
import dayjs from "lib/day";
import { AwsDTO } from "pages/api/admin/users/addImage";
import React, { useContext } from "react";
import { deserializeProfileFieldValue } from "utils/buildUserProfile";
import isAbsence from "utils/isAbsence";
import labelProfileField from "utils/labelProfileField";
import ProfileContext from "./ProfileContext";
import ProfileFieldEditorModal from "./ProfileFieldEditorModal";
import TestResultHistoryTable from "./TestResultHistoryTable";
import TextListTable from "./TextListTable";
import ValueHistoryTable from "./ValueHistoryTable";

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
DateTimeEditor.defaultProps = {
  hideDay: false,
  hideMonth: false,
  hideYear: false,
  onChange: undefined,
  value: undefined,
  yearRange: undefined,
};

type AbsenceEditorProps = {
  absence: Partial<IAbsence> | undefined;
  onChange: (change: Partial<Absence>) => void;
};
const AbsenceEditor: React.FC<AbsenceEditorProps> = ({
  absence: _absence,
  onChange,
}: AbsenceEditorProps) => {
  const absence = _absence?.draft ?? _absence;
  return (
    <div>
      <p className="text-sm font-semibold mb-2">Absence Type</p>
      <select
        value={absence?.type}
        className="select"
        onChange={({ target: { value } }) =>
          onChange({ type: value as AbsenceType })
        }
      >
        <option disabled selected value={undefined}>
          {" "}
        </option>
        {Object.values(AbsenceType).map((type: AbsenceType) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      <p className="text-sm font-semibold mb-2 mt-8">Month/Year</p>
      <DateTimeEditor
        onChange={(date: Dayjs) => onChange({ date: date.toDate() })}
        value={absence?.date}
      />
      <p className="text-sm font-semibold mb-2 mt-8">Excused/Unexcused</p>
      <select
        value={absence?.reason}
        className="select"
        onChange={({ target: { value } }) =>
          onChange({ reason: value as AbsenceReason })
        }
      >
        <option disabled selected value={undefined}>
          {" "}
        </option>
        {Object.values(AbsenceReason).map((reason: AbsenceReason) => (
          <option key={reason} value={reason}>
            {reason}
          </option>
        ))}
      </select>
      <p className="text-sm font-semibold mb-2 mt-8">Description</p>
      <input
        type="text"
        className="input text-sm w-full font-light"
        value={absence?.description}
        onChange={({ target: { value } }) => onChange({ description: value })}
      />
    </div>
  );
};

type CreateTableHeaderProps = {
  field: IProfileFieldBuilt<NumericProfileFields>;
};

const CreateTableHeader: React.FC<CreateTableHeaderProps> = ({
  field,
}: CreateTableHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <p>
        Overall {labelProfileField(field.key)}:{" "}
        <span className="ml-2 text-blue font-semibold">
          {(field.history.length > 0
            ? field.history.reduce(
                (sum: number, value: IProfileField<NumericProfileFields>) =>
                  sum + (deserializeProfileFieldValue(value)?.value || 0),
                0
              ) / field.history.length
            : 0
          ).toFixed(2)}
        </span>
      </p>
      <ProfileFieldEditorModal fieldKey={field.key} />
    </div>
  );
};

type CreateProfileFieldProps = {
  profileField: IProfileFieldBuilt<ProfileFieldKey> | ProfileFieldKey;
};

type CreateAbsenceProps = {
  profileField: "absence";
};

type UpdateProfileFieldOrAbsenceProps = {
  /**
   * If profileField is specified as an IProfileField or Absence, the ProfileFieldEditor will
   * assume that you want to update a specific profile field's value rather than create a new
   * ProfileField in the database, which is why `updateExisting` must be specified as true to
   * disambiguate its meaning.
   */
  profileField: IProfileField | IAbsence;
  updateExisting: true;
};

type Props =
  | CreateProfileFieldProps
  | CreateAbsenceProps
  | UpdateProfileFieldOrAbsenceProps;

const ProfileFieldEditor: React.FC<Props> = (props: Props) => {
  const { state, dispatch } = useContext(ProfileContext);

  let profileKey: ProfileFieldKey;
  let profileFieldId: number | undefined;
  let deserializedValue;

  if (props.profileField === "absence" || isAbsence(props.profileField)) {
    const existingAbsence =
      props.profileField !== "absence"
        ? props.profileField
        : state.player?.absenceDraft;
    return (
      <AbsenceEditor
        absence={existingAbsence}
        onChange={(change: Partial<Absence>) => {
          dispatch({
            type: "EDIT_ABSENCE",
            id: existingAbsence?.id,
            value: change,
          });
        }}
      />
    );
  }
  if (typeof props.profileField === "string") {
    profileKey = props.profileField;
    deserializedValue = state.player?.profile?.[profileKey]?.draft;
  } else {
    profileKey = props.profileField.key;
    // Check if this is an IProfileFieldBuilt
    if ("history" in props.profileField) {
      deserializedValue =
        props.profileField.draft ??
        deserializeProfileFieldValue(props.profileField.current);
    } else {
      deserializedValue =
        props.profileField.draft ??
        deserializeProfileFieldValue(props.profileField);
      profileFieldId = props.profileField.id;
    }
  }

  const valueType = ProfileFieldValues[profileKey];

  switch (valueType) {
    case ProfileFieldValue.IntegerWithComment:
    case ProfileFieldValue.FloatWithComment: {
      if (
        typeof props.profileField === "object" &&
        "history" in props.profileField
      ) {
        const field = props.profileField as IProfileFieldBuilt<
          ProfileFieldKeysOfProfileValueType<typeof valueType>
        >;
        return (
          <div className="mb-16">
            <CreateTableHeader field={field} />
            <ValueHistoryTable fieldKey={field.key} values={field.history} />
          </div>
        );
      }
      const value = deserializedValue as
        | ProfileFieldValueDeserializedTypes[typeof valueType]
        | null;
      return (
        <div>
          <p className="text-sm font-semibold mb-3 mt-10">
            {labelProfileField(profileKey)} Value
          </p>
          <NumberEditor
            onChange={(event) => {
              dispatch({
                type: "EDIT_FIELD",
                key: profileKey as ProfileFieldKey,
                value: {
                  date: dayjs(),
                  ...value,
                  value: Number(event.target.value),
                },
                id: profileFieldId,
              });
            }}
            // Floats can't be controlled, because intermediate states will not have decimal point
            {...(valueType === ProfileFieldValue.IntegerWithComment
              ? { value: value?.value }
              : { defaultValue: value?.value })}
          />
          <p className="text-sm font-semibold mb-3 mt-10">Month/Year</p>
          <DateTimeEditor
            hideDay
            value={value?.date}
            onChange={(date) => {
              date.set("date", 1);
              dispatch({
                type: "EDIT_FIELD",
                key: profileKey as ProfileFieldKey,
                value: {
                  value: 0,
                  ...value,
                  date,
                },
                id: profileFieldId,
              });
            }}
          />
          <p className="text-sm font-semibold mb-3 mt-10">Comments</p>
          <input
            type="text"
            className="input text-sm w-full font-light"
            name="comments"
            value={value?.comment}
            onChange={(event) => {
              dispatch({
                type: "EDIT_FIELD",
                key: profileKey as ProfileFieldKey,
                value: {
                  value: 0,
                  date: dayjs(),
                  ...value,
                  comment: event.target.value,
                },
                id: profileFieldId,
              });
            }}
          />
        </div>
      );
    }
    case ProfileFieldValue.TextListItem: {
      if (
        typeof props.profileField === "object" &&
        "history" in props.profileField
      ) {
        const field = props.profileField as IProfileFieldBuilt<
          ProfileFieldKeysOfProfileValueType<typeof valueType>
        >;
        return (
          <div className="mb-16 text-sm">
            <div className="flex justify-between items-center">
              <p className="font-semibold mt-10">
                {labelProfileField(field.key)}:
              </p>
              <ProfileFieldEditorModal fieldKey={field.key} />
            </div>
            <TextListTable fieldKey={field.key} values={field.history} />
          </div>
        );
      }
      const value = deserializedValue as
        | ProfileFieldValueDeserializedTypes[typeof valueType]
        | null;
      return (
        <div>
          <p className="text-sm font-semibold mt-3 mb-3">Date</p>
          <DateTimeEditor
            value={value?.date}
            onChange={(date) => {
              dispatch({
                type: "EDIT_FIELD",
                key: profileKey as ProfileFieldKey,
                value: {
                  comment: "",
                  ...value,
                  date,
                },
                id: profileFieldId,
              });
            }}
          />
          <p className="text-sm font-semibold mb-3 mt-10">Description</p>
          <input
            type="text"
            className="input text-sm w-full font-light"
            name="comments"
            value={value?.comment}
            onChange={(event) => {
              dispatch({
                type: "EDIT_FIELD",
                key: profileKey as ProfileFieldKey,
                value: {
                  date: dayjs(),
                  ...value,
                  comment: event.target.value,
                },
                id: profileFieldId,
              });
            }}
          />
        </div>
      );
    }
    case ProfileFieldValue.StandardizedTestResult: {
      if (
        typeof props.profileField === "object" &&
        "history" in props.profileField
      ) {
        const field = props.profileField as IProfileFieldBuilt<
          ProfileFieldKeysOfProfileValueType<typeof valueType>
        >;
        return (
          <div className="mb-16 text-sm">
            <p className="font-semibold mt-10">
              {labelProfileField(field.key)}:
            </p>
            <CreateTableHeader field={field} />
            <TestResultHistoryTable
              fieldKey={field.key}
              values={field.history}
            />
          </div>
        );
      }

      const value = deserializedValue as
        | ProfileFieldValueDeserializedTypes[typeof valueType]
        | null;
      const fieldKey = profileKey as ProfileFieldKeysOfProfileValueType<
        typeof valueType
      >;
      return (
        <div>
          <p className="text-sm font-semibold mb-3 mt-10">
            {labelProfileField(fieldKey)} Score
          </p>
          <NumberEditor
            onChange={(event) => {
              dispatch({
                type: "EDIT_FIELD",
                key: fieldKey,
                value: {
                  date: dayjs(),
                  percentile: 0,
                  ...value,
                  value: Number(event.target.value),
                },
                id: profileFieldId,
              });
            }}
            defaultValue={value?.value}
          />
          <p className="text-sm font-semibold mb-3 mt-10">
            {labelProfileField(fieldKey)} Percentile
          </p>
          <NumberEditor
            onChange={(event) => {
              dispatch({
                type: "EDIT_FIELD",
                key: fieldKey,
                value: {
                  date: dayjs(),
                  value: 0,
                  ...value,
                  percentile: Number(event.target.value),
                },
                id: profileFieldId,
              });
            }}
            defaultValue={value?.percentile}
          />
          <p className="text-sm font-semibold mb-3 mt-10">Date</p>
          <DateTimeEditor
            value={value?.date}
            onChange={(date) => {
              dispatch({
                type: "EDIT_FIELD",
                key: fieldKey,
                value: {
                  value: 0,
                  percentile: 0,
                  ...value,
                  date,
                },
                id: profileFieldId,
              });
            }}
          />
          <p className="text-sm font-semibold mb-3 mt-10">Comments</p>
          <input
            type="text"
            className="input text-sm w-full font-light"
            name="comments"
            value={value?.comment}
            onChange={(event) => {
              dispatch({
                type: "EDIT_FIELD",
                key: fieldKey,
                value: {
                  value: 0,
                  date: dayjs(),
                  percentile: 0,
                  ...value,
                  comment: event.target.value,
                },
                id: profileFieldId,
              });
            }}
          />
        </div>
      );
    }
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
            value={value?.minutes?.()}
            onChange={(event) => {
              dispatch({
                type: "EDIT_FIELD",
                key: profileKey,
                value: dayjs.duration({
                  minutes: event.target.value,
                  seconds: value?.seconds?.(),
                }),
                id: profileFieldId,
              });
            }}
          />
          <NumberEditor
            unit="seconds"
            placeholder="8"
            min={0}
            max={59}
            value={value?.seconds?.()}
            onChange={(event) => {
              dispatch({
                type: "EDIT_FIELD",
                key: profileKey,
                value: dayjs.duration({
                  minutes: value?.minutes(),
                  seconds: event.target.value,
                }),
                id: profileFieldId,
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
            value={value?.feet}
            onChange={(event) => {
              dispatch({
                type: "EDIT_FIELD",
                key: profileKey,
                value: {
                  inches: 0,
                  ...value,
                  feet: Number(event.target.value),
                },
                id: profileFieldId,
              });
            }}
          />
          <NumberEditor
            unit="inches"
            placeholder="5"
            min={0}
            max={11}
            value={value?.inches}
            onChange={(event) => {
              dispatch({
                type: "EDIT_FIELD",
                key: profileKey,
                value: {
                  feet: 0,
                  ...value,
                  inches: Number(event.target.value),
                },
                id: profileFieldId,
              });
            }}
          />
        </div>
      );
    }
    case ProfileFieldValue.Integer: {
      const value = deserializedValue as
        | ProfileFieldValueDeserializedTypes[typeof valueType]
        | null;
      return (
        <NumberEditor
          value={value ?? undefined}
          onChange={(event) => {
            dispatch({
              type: "EDIT_FIELD",
              key: profileKey,
              value: event.target.value,
              id: profileFieldId,
            });
          }}
        />
      );
    }
    case ProfileFieldValue.File:
      return (
        <>
          <p>Upload a .png or .jpg image (max 1MB).</p>
          <input
            onChange={async (event) => {
              if (event.target.files != null) {
                const file = event.target.files[0];
                const filename = encodeURIComponent(
                  `${Date.now()}-${file.name}`
                );
                // reqeusting presigned url
                const res = await fetch(
                  `/api/admin/users/addImage?file=${filename}`
                );
                const { url, fields } = (await res.json()) as AwsDTO;
                const formData = new FormData();

                Object.entries({ ...fields, file }).forEach(([key, val]) => {
                  formData.append(key, val);
                });

                // posting to bucket?
                const upload = await fetch(url, {
                  method: "POST",
                  body: formData,
                });
                // error handling

                console.log(upload);

                if (upload.ok) {
                  console.log("Uploaded successfully!");
                } else {
                  console.error("Upload failed.");
                }

                // profile field??
                dispatch({
                  type: "EDIT_FIELD",
                  key: profileKey,
                  value: { key: filename },
                  id: profileFieldId,
                });
              }
            }}
            type="file"
            accept="image/png, image/jpeg"
          />
        </>
      );
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
          value={value ?? undefined}
          onChange={(event) =>
            dispatch({
              type: "EDIT_FIELD",
              key: profileKey,
              value: event.target.value,
              id: profileFieldId,
            })
          }
        />
      );
    }
  }
};

export default ProfileFieldEditor;
