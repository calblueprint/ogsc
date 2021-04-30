/* eslint-disable react/destructuring-assignment */
import { Absence, ProfileFieldKey } from "@prisma/client";
import DateTimeInput from "components/DateTimeInput";
import NumberInput from "components/NumberInput";
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
import React, { useCallback, useContext, useEffect, useState } from "react";
import { deserializeProfileFieldValue } from "utils/buildUserProfile";
import isAbsence from "utils/isAbsence";
import labelProfileField from "utils/labelProfileField";
import validateProfileField from "utils/validateProfileField";
import AbsenceInput from "./AbsenceInput";
import ProfileContext from "./ProfileContext";
import ProfileFieldEditorModal from "./ProfileFieldEditorModal";
import TestResultHistoryTable from "./TestResultHistoryTable";
import TextListTable from "./TextListTable";
import ValueHistoryTable from "./ValueHistoryTable";

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

type ProfilePictureProps = {
  onUpload: (key: string) => void;
  currentFileName?: string | null;
};
const ProfilePictureEditor: React.FC<ProfilePictureProps> = ({
  onUpload,
  currentFileName,
}: ProfilePictureProps) => {
  const [error, setError] = useState<string>();
  const [profilePicture, setProfilePicture] = useState<string>(
    "/placeholder-profile.png"
  );

  useEffect(() => {
    const updatePreview = async (): Promise<void> => {
      if (currentFileName !== null) {
        const response = await fetch(
          `/api/profilePicture?key=${currentFileName}`,
          {
            method: "GET",
            headers: { "content-type": "application/json" },
            redirect: "follow",
          }
        );
        if (!response.ok) {
          throw await response.json();
        }
        setProfilePicture((await response.json()).url);
      }
    };
    updatePreview();
  }, [currentFileName]);

  async function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> {
    setError("");
    if (event.target.files != null && event.target.files.length !== 0) {
      const file = event.target.files[0];
      const filename = encodeURIComponent(`${Date.now()}-${file.name}`);
      const res = await fetch(`/api/admin/users/addImage?file=${filename}`);
      const { url, fields } = (await res.json()) as AwsDTO;
      const formData = new FormData();

      Object.entries({ ...fields, file }).forEach(([k, val]) => {
        formData.append(k, val);
      });
      const upload = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (upload.ok) {
        const response = await fetch(`/api/profilePicture?key=${filename}`, {
          method: "GET",
          headers: { "content-type": "application/json" },
          redirect: "follow",
        });
        if (!response.ok) {
          throw await response.json();
        }
        setProfilePicture((await response.json()).url);
        onUpload(filename);
      } else {
        setError("Preview failed. Try a square image less than 1MB");
      }
    }
  }

  return (
    <div className="flex mt-3 flex-wrap space-y-6 flex-col ">
      <div className="picture flex mr-10 mb-3">
        <img
          src={profilePicture}
          alt="player"
          className="bg-button rounded-full max-w-full align-middle border-none w-24 h-24"
        />
        <div className="mt-2 ml-5">
          <input
            onChange={handleChange}
            type="file"
            accept="image/png, image/jpeg"
          />
          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          <p className="mt-3 text-gray-600">JPG or PNG. Max size of 1MB.</p>
        </div>
      </div>
    </div>
  );
};
ProfilePictureEditor.defaultProps = {
  currentFileName: null,
};

type CreateProfileFieldProps = {
  profileField: IProfileFieldBuilt<ProfileFieldKey> | ProfileFieldKey;
};

type CreateAbsenceProps = {
  profileField: "absence";
};

type UpdateProfileFieldProps = {
  /**
   * If profileField is specified as an IProfileField, the ProfileFieldEditor will
   * assume that you want to update a specific profile field's value rather than create a new
   * ProfileField in the database, which is why `updateExisting` must be specified as true to
   * disambiguate its meaning.
   */
  profileField: IProfileField;
  updateExisting: true;
};

type UpdateAbsenceProps = {
  /**
   * If profileField is specified as an IAbsence, the ProfileFieldEditor will
   * assume that you want to update a specific absence's value rather than create a new
   * Absence in the database, which is why `updateExisting` must be specified as true to
   * disambiguate its meaning.
   */
  profileField: IAbsence;
  updateExisting: true;
};

type Props =
  | CreateProfileFieldProps
  | CreateAbsenceProps
  | UpdateProfileFieldProps
  | UpdateAbsenceProps;

const useValidationError = (
  props: CreateProfileFieldProps | UpdateProfileFieldProps
): string | undefined => {
  const { state } = useContext(ProfileContext);
  if ("updateExisting" in props) {
    return props.profileField.error;
  }
  return state.player?.profile?.[
    typeof props.profileField === "string"
      ? props.profileField
      : props.profileField.key
  ]?.error;
};

const WithInlineValidationErrors: React.FC<
  React.PropsWithChildren<CreateProfileFieldProps | UpdateProfileFieldProps>
> = ({
  children,
  ...props
}: React.PropsWithChildren<
  CreateProfileFieldProps | UpdateProfileFieldProps
>) => {
  const error = useValidationError(props);
  return (
    <div className={`flex flex-col input-wrapper ${error ? "has-errors" : ""}`}>
      {children}
      {error && (
        <p className="mt-1 text-error text-sm font-semibold">{error}</p>
      )}
    </div>
  );
};

const NumberOrUndefined = (numberStr: string): number | undefined => {
  return numberStr !== "" && !Number.isNaN(Number(numberStr))
    ? Number(numberStr)
    : undefined;
};

const ProfileFieldEditor: React.FC<
  CreateProfileFieldProps | UpdateProfileFieldProps
> = (props: CreateProfileFieldProps | UpdateProfileFieldProps) => {
  const { state, dispatch } = useContext(ProfileContext);

  let profileKey: ProfileFieldKey;
  let profileFieldId: number | undefined;
  let deserializedValue:
    | ProfileFieldValueDeserializedTypes[ProfileFieldValue]
    | null
    | undefined;

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

  const serializeAndValidate = useCallback(() => {
    if (!deserializedValue) {
      dispatch({
        type: "CLEAR_FIELD_VALIDATION_ERROR",
        key: profileKey,
        id: profileFieldId,
      });
      return;
    }
    const validationResult = validateProfileField(
      deserializedValue,
      profileKey
    );
    if (validationResult.error) {
      dispatch({
        type: "ADD_FIELD_VALIDATION_ERROR",
        error: validationResult.error.message,
        key: profileKey,
        id: profileFieldId,
      });
    } else {
      dispatch({
        type: "CLEAR_FIELD_VALIDATION_ERROR",
        key: profileKey,
        id: profileFieldId,
      });
    }
  }, [deserializedValue, dispatch, profileKey, profileFieldId]);

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
          <WithInlineValidationErrors {...props}>
            <NumberInput
              onBlur={serializeAndValidate}
              onChange={(event) => {
                dispatch({
                  type: "EDIT_FIELD",
                  key: profileKey as ProfileFieldKey,
                  value: {
                    date: dayjs(),
                    ...value,
                    value: NumberOrUndefined(event.target.value),
                  },
                  id: profileFieldId,
                });
              }}
              value={value?.value}
            />
          </WithInlineValidationErrors>
          <p className="text-sm font-semibold mb-3 mt-10">Month/Year</p>
          <DateTimeInput
            hideDay
            value={value?.date}
            onChange={(date) => {
              date.set("date", 1);
              dispatch({
                type: "EDIT_FIELD",
                key: profileKey as ProfileFieldKey,
                value: {
                  ...value,
                  date,
                },
                id: profileFieldId,
              });
              serializeAndValidate();
            }}
          />
          <p className="text-sm font-semibold mb-3 mt-10">Comments</p>
          <input
            type="text"
            className="input text-sm w-full font-light"
            name="comments"
            value={value?.comment}
            onBlur={serializeAndValidate}
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
              <p className="font-semibold">{labelProfileField(field.key)}:</p>
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
          <DateTimeInput
            value={value?.date}
            onChange={(date) => {
              dispatch({
                type: "EDIT_FIELD",
                key: profileKey as ProfileFieldKey,
                value: {
                  ...value,
                  date,
                },
                id: profileFieldId,
              });
              serializeAndValidate();
            }}
          />
          <p className="text-sm font-semibold mb-3 mt-10">Description</p>
          <WithInlineValidationErrors {...props}>
            <input
              type="text"
              className="input text-sm w-full font-light"
              name="comments"
              value={value?.comment}
              onBlur={serializeAndValidate}
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
          </WithInlineValidationErrors>
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
          <WithInlineValidationErrors {...props}>
            <p className="text-sm font-semibold mb-3 mt-10">
              {labelProfileField(fieldKey)} Score
            </p>
            <NumberInput
              onChange={(event) => {
                dispatch({
                  type: "CLEAR_FIELD_VALIDATION_ERROR",
                  key: profileKey,
                  id: profileFieldId,
                });
                dispatch({
                  type: "EDIT_FIELD",
                  key: fieldKey,
                  value: {
                    date: dayjs(),
                    ...value,
                    value: NumberOrUndefined(event.target.value),
                  },
                  id: profileFieldId,
                });
              }}
              defaultValue={value?.value}
            />
            <p className="text-sm font-semibold mb-3 mt-10">
              {labelProfileField(fieldKey)} Percentile
            </p>
            <NumberInput
              onChange={(event) => {
                dispatch({
                  type: "CLEAR_FIELD_VALIDATION_ERROR",
                  key: profileKey,
                  id: profileFieldId,
                });
                dispatch({
                  type: "EDIT_FIELD",
                  key: fieldKey,
                  value: {
                    date: dayjs(),
                    ...value,
                    percentile: NumberOrUndefined(event.target.value),
                  },
                  id: profileFieldId,
                });
              }}
              defaultValue={value?.percentile}
            />
            <p className="text-sm font-semibold mb-3 mt-10">Date</p>
            <DateTimeInput
              value={value?.date}
              onChange={(date) => {
                dispatch({
                  type: "CLEAR_FIELD_VALIDATION_ERROR",
                  key: profileKey,
                  id: profileFieldId,
                });
                dispatch({
                  type: "EDIT_FIELD",
                  key: fieldKey,
                  value: {
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
                  type: "CLEAR_FIELD_VALIDATION_ERROR",
                  key: profileKey,
                  id: profileFieldId,
                });
                dispatch({
                  type: "EDIT_FIELD",
                  key: fieldKey,
                  value: {
                    date: dayjs(),
                    ...value,
                    comment: event.target.value,
                  },
                  id: profileFieldId,
                });
              }}
            />
          </WithInlineValidationErrors>
        </div>
      );
    }
    case ProfileFieldValue.TimeElapsed: {
      const value = deserializedValue as
        | ProfileFieldValueDeserializedTypes[typeof valueType]
        | null;
      return (
        <WithInlineValidationErrors {...props}>
          <div className="flex items-center">
            <NumberInput
              step={1}
              unit="minutes"
              placeholder="8"
              min={0}
              value={value?.minutes?.()}
              onBlur={serializeAndValidate}
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
            <NumberInput
              unit="seconds"
              placeholder="8"
              min={0}
              max={59}
              value={value?.seconds?.()}
              onBlur={serializeAndValidate}
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
        </WithInlineValidationErrors>
      );
    }
    case ProfileFieldValue.DistanceMeasured: {
      const value = deserializedValue as
        | ProfileFieldValueDeserializedTypes[typeof valueType]
        | null;
      return (
        <WithInlineValidationErrors {...props}>
          <div className="flex items-center">
            <NumberInput
              step={1}
              unit="feet"
              placeholder="5"
              min={0}
              value={value?.feet}
              onBlur={serializeAndValidate}
              onChange={(event) => {
                dispatch({
                  type: "EDIT_FIELD",
                  key: profileKey,
                  value: {
                    inches: 0,
                    ...value,
                    feet: NumberOrUndefined(event.target.value),
                  },
                  id: profileFieldId,
                });
              }}
            />
            <NumberInput
              unit="inches"
              placeholder="5"
              min={0}
              max={11}
              value={value?.inches}
              onBlur={serializeAndValidate}
              onChange={(event) => {
                dispatch({
                  type: "EDIT_FIELD",
                  key: profileKey,
                  value: {
                    feet: 0,
                    ...value,
                    inches: NumberOrUndefined(event.target.value),
                  },
                  id: profileFieldId,
                });
              }}
            />
          </div>
        </WithInlineValidationErrors>
      );
    }
    case ProfileFieldValue.Integer: {
      const value = deserializedValue as
        | ProfileFieldValueDeserializedTypes[typeof valueType]
        | null;
      return (
        <WithInlineValidationErrors {...props}>
          <NumberInput
            value={value ?? undefined}
            onBlur={serializeAndValidate}
            onChange={(event) => {
              dispatch({
                type: "EDIT_FIELD",
                key: profileKey,
                value: event.target.value,
                id: profileFieldId,
              });
            }}
          />
        </WithInlineValidationErrors>
      );
    }
    case ProfileFieldValue.File: {
      const value = deserializedValue as
        | ProfileFieldValueDeserializedTypes[typeof valueType]
        | null;
      return (
        <div>
          <ProfilePictureEditor
            currentFileName={value?.key}
            onUpload={(filename) => {
              dispatch({
                type: "EDIT_FIELD",
                key: profileKey,
                value: { key: filename },
                id: profileFieldId,
              });
            }}
          />
        </div>
      );
    }

    case ProfileFieldValue.Text:
    default: {
      const value = deserializedValue as
        | ProfileFieldValueDeserializedTypes[typeof valueType]
        | null;
      return (
        <WithInlineValidationErrors {...props}>
          <input
            type="text"
            className="input max-w-3xl"
            name={profileKey}
            value={value ?? undefined}
            onBlur={serializeAndValidate}
            onChange={(event) =>
              dispatch({
                type: "EDIT_FIELD",
                key: profileKey,
                value: event.target.value,
                id: profileFieldId,
              })
            }
          />
        </WithInlineValidationErrors>
      );
    }
  }
};

const RootProfileFieldEditor: React.FC<Props> = (props: Props) => {
  const { state, dispatch } = useContext(ProfileContext);

  if (props.profileField === "absence" || isAbsence(props.profileField)) {
    const existingAbsence =
      props.profileField !== "absence"
        ? props.profileField
        : state.player?.absenceDraft;
    return (
      <AbsenceInput
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

  return (
    <ProfileFieldEditor
      {...(props as CreateProfileFieldProps | UpdateProfileFieldProps)}
    />
  );
};

export default RootProfileFieldEditor;
