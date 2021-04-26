import { ProfileFieldKey } from "@prisma/client";
import {
  IProfileFieldBuilt,
  ProfileFieldValueDeserializedTypes,
  ProfileFieldValues,
} from "interfaces/user";
import Joi from "joi";
import {
  ProfileFieldExtraValidators,
  ProfileFieldValueValidators,
} from "lib/validate";
import { serializeProfileFieldValue } from "./buildUserProfile";
import labelProfileField from "./labelProfileField";

function validateProfileField(
  field: IProfileFieldBuilt<ProfileFieldKey> | null | undefined
): Joi.ValidationResult;
function validateProfileField(
  value: ProfileFieldValueDeserializedTypes[ProfileFieldValues[ProfileFieldKey]],
  fieldKey: ProfileFieldKey
): Joi.ValidationResult;
function validateProfileField(
  value: string,
  fieldKey: ProfileFieldKey
): Joi.ValidationResult;
function validateProfileField(
  fieldOrValue:
    | IProfileFieldBuilt<ProfileFieldKey>
    | ProfileFieldValueDeserializedTypes[ProfileFieldValues[ProfileFieldKey]]
    | string
    | null
    | undefined,
  fieldKey?: ProfileFieldKey
): Joi.ValidationResult {
  let serializedValue: string | null;
  let key: ProfileFieldKey;
  if (fieldOrValue == null) {
    return { value: fieldOrValue };
  }
  if (typeof fieldOrValue === "object" && "history" in fieldOrValue) {
    if (!fieldOrValue?.draft) {
      return { value: fieldOrValue };
    }
    serializedValue = serializeProfileFieldValue(
      fieldOrValue.draft,
      fieldOrValue.key
    );
    key = fieldOrValue.key;
  } else if (fieldKey) {
    serializedValue = serializeProfileFieldValue(fieldOrValue, fieldKey);
    key = fieldKey;
  } else {
    return { value: fieldOrValue };
  }

  const valueType = ProfileFieldValues[key];
  const valueTypeResult = ProfileFieldValueValidators[valueType]
    .label(labelProfileField(key))
    .validate(serializedValue);
  if (!valueTypeResult.error && ProfileFieldExtraValidators[key]) {
    const specificKeyResult = ProfileFieldExtraValidators[key]?.validate(
      serializedValue
    );
    if (specificKeyResult?.error) {
      return specificKeyResult;
    }
  }
  return valueTypeResult;
}

export default validateProfileField;
