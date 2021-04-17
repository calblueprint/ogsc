import { ProfileFieldKey } from "@prisma/client";
import {
  IProfileFieldBuilt,
  ProfileFieldValue,
  ProfileFieldValueDeserializedTypes,
  ProfileFieldValues,
} from "interfaces";
import dayjs from "lib/day";
import React, { useContext } from "react";
import { deserializeProfileFieldValue } from "utils/buildUserProfile";
import ProfileContext from "./ProfileContext";

type Props = {
  profileField: IProfileFieldBuilt<ProfileFieldKey>;
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

const ProfileFieldEditor: React.FC<Props> = ({ profileField }: Props) => {
  const { dispatch } = useContext(ProfileContext);
  const valueType = ProfileFieldValues[profileField.key];
  const deserializedValue = deserializeProfileFieldValue(profileField.current);

  switch (valueType) {
    case ProfileFieldValue.IntegerWithComment:
    case ProfileFieldValue.FloatWithComment:
      return null;
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
                key: profileField.key,
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
                key: profileField.key,
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
                key: profileField.key,
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
                key: profileField.key,
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
          name={profileField.key}
          defaultValue={value ?? undefined}
          onChange={(event) =>
            dispatch({
              type: "EDIT_FIELD",
              key: profileField.key,
              value: event.target.value,
            })
          }
        />
      );
    }
  }
};

export default ProfileFieldEditor;
