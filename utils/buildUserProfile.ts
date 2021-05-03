import { Absence, ProfileField, ProfileFieldKey, Notes } from "@prisma/client";
import dayjs from "lib/day";
import {
  IProfileField,
  IProfileFieldBuilt,
  PlayerProfile,
  ProfileFieldValue,
  ProfileFieldValueDeserializedTypes,
  ProfileFieldValues,
  SanitizedUser,
} from "interfaces";

export function serializeProfileFieldValue(
  field: IProfileFieldBuilt<ProfileFieldKey> | IProfileField | null | undefined
): string | null;
export function serializeProfileFieldValue(
  value: ProfileFieldValueDeserializedTypes[ProfileFieldValues[ProfileFieldKey]],
  fieldKey: ProfileFieldKey
): string | null;
export function serializeProfileFieldValue(
  fieldOrValue:
    | IProfileFieldBuilt<ProfileFieldKey>
    | IProfileField
    | ProfileFieldValueDeserializedTypes[ProfileFieldValues[ProfileFieldKey]]
    | null
    | undefined,
  fieldKey?: ProfileFieldKey
): string | null {
  if (fieldOrValue == null) {
    return null;
  }
  let draftValue;
  let key: ProfileFieldKey;
  if (
    typeof fieldOrValue === "object" &&
    "key" in fieldOrValue &&
    ("id" in fieldOrValue || "history" in fieldOrValue)
  ) {
    if (!fieldOrValue) {
      return null;
    }
    draftValue = fieldOrValue.draft;
    key = fieldOrValue.key;
  } else if (fieldKey) {
    draftValue = fieldOrValue;
    key = fieldKey;
  } else {
    return null;
  }

  if (typeof draftValue === "string") {
    return draftValue;
  }
  if (draftValue === undefined) {
    return null;
  }

  const originValueType = ProfileFieldValues[key];
  try {
    switch (originValueType) {
      case ProfileFieldValue.FloatWithComment:
      case ProfileFieldValue.IntegerWithComment:
      case ProfileFieldValue.StandardizedTestResult:
      case ProfileFieldValue.TextListItem: {
        const draft = draftValue as ProfileFieldValueDeserializedTypes[typeof originValueType];
        return JSON.stringify({ ...draft, date: draft.date.toISOString() });
      }
      case ProfileFieldValue.File: {
        return JSON.stringify(draftValue);
      }
      case ProfileFieldValue.TimeElapsed: {
        const draft = draftValue as ProfileFieldValueDeserializedTypes[typeof originValueType];
        return draft.toISOString();
      }
      case ProfileFieldValue.DistanceMeasured: {
        const draft = draftValue as ProfileFieldValueDeserializedTypes[typeof originValueType];
        return String(
          (Number.isNaN(draft.feet) ? 0 : draft.feet * 12) +
            (Number.isNaN(draft.inches) ? 0 : draft.inches)
        );
      }
      case ProfileFieldValue.Text:
      case ProfileFieldValue.Integer:
      case ProfileFieldValue.URL:
      default:
        return String(draftValue);
    }
  } catch (err) {
    return null;
  }
}

export function deserializeProfileFieldValue<
  T extends ProfileField,
  K extends ProfileFieldKey = T["key"]
>(
  field: T | undefined
): ProfileFieldValueDeserializedTypes[ProfileFieldValues[K]] | null;
export function deserializeProfileFieldValue<
  T extends ProfileField,
  K extends ProfileFieldKey = T["key"]
>(
  value: string,
  fieldKey: K
): ProfileFieldValueDeserializedTypes[ProfileFieldValues[K]] | null;
export function deserializeProfileFieldValue<
  T extends ProfileField,
  K extends ProfileFieldKey = T["key"]
>(
  fieldOrValue: T | string | undefined,
  fieldKey?: K
): ProfileFieldValueDeserializedTypes[ProfileFieldValues[K]] | null {
  if (fieldOrValue === undefined) {
    return null;
  }
  type Deserialized = ProfileFieldValueDeserializedTypes[ProfileFieldValues[K]];
  let key: ProfileFieldKey;
  let value: string | null;
  if (typeof fieldOrValue === "string" && fieldKey) {
    key = fieldKey;
    value = fieldOrValue;
  } else if (typeof fieldOrValue !== "string") {
    key = fieldOrValue.key;
    value = fieldOrValue.value;
  } else {
    return null;
  }

  const targetValueType = ProfileFieldValues[key];

  try {
    switch (targetValueType) {
      case ProfileFieldValue.Integer:
        return Math.floor(Number(value)) as Deserialized;
      case ProfileFieldValue.FloatWithComment:
      case ProfileFieldValue.IntegerWithComment: {
        if (!value) {
          return null;
        }
        const parsed = JSON.parse(value);
        if (
          typeof parsed !== "object" ||
          !("value" in parsed) ||
          !("date" in parsed)
        ) {
          return null;
        }
        return {
          comment: parsed.comment,
          value:
            targetValueType === ProfileFieldValue.IntegerWithComment
              ? Math.floor(Number(parsed.value))
              : Number(parsed.value),
          date: dayjs(parsed.date),
        } as Deserialized;
      }
      case ProfileFieldValue.File:
        if (value === null) {
          return null;
        }
        return JSON.parse(value);
      case ProfileFieldValue.StandardizedTestResult: {
        if (!value) {
          return null;
        }
        const parsed = JSON.parse(value);
        if (
          typeof parsed !== "object" ||
          !("value" in parsed) ||
          !("date" in parsed)
        ) {
          return null;
        }
        return {
          comment: parsed.comment,
          date: dayjs(parsed.date),
          value: parsed.value,
          percentile: parsed.percentile,
        } as Deserialized;
      }
      case ProfileFieldValue.TextListItem: {
        if (!value) {
          return null;
        }
        const parsed = JSON.parse(value);
        if (
          typeof parsed !== "object" ||
          !("comment" in parsed) ||
          !("date" in parsed)
        ) {
          return null;
        }
        return {
          comment: parsed.comment,
          date: dayjs(parsed.date),
        } as Deserialized;
      }
      case ProfileFieldValue.TimeElapsed:
        if (value === null) {
          return null;
        }
        return dayjs.duration(value) as Deserialized;
      case ProfileFieldValue.DistanceMeasured:
        if (value === null) {
          return null;
        }
        return {
          feet: Math.floor(Number(value) / 12),
          inches: Number((Number(value) % 12).toFixed(1)),
        } as Deserialized;
      case ProfileFieldValue.Text:
      case ProfileFieldValue.URL:
      default:
        return value as Deserialized;
    }
  } catch (err) {
    // TODO: Log out this error
    return null;
  }
}

export default function buildUserProfile<
  T extends SanitizedUser & {
    absences?: Absence[];
    profileFields: ProfileField[];
    notes?: Notes[];
  }
>(user: T): T & { profile: PlayerProfile | null } {
  if (user.profileFields.length === 0) {
    return { ...user, profile: null };
  }
  const transformedUser: T & { profile: PlayerProfile } = {
    ...user,
    absences: user.absences?.map((absence: Absence) => ({
      ...absence,
      date: new Date(absence.date),
    })),
    notes: user.notes?.map((notes: Notes) => ({
      ...notes,
      date: new Date(notes.created_at),
    })),
    profile: <PlayerProfile>(
      Object.fromEntries<IProfileFieldBuilt<ProfileFieldKey>>(
        Object.values(ProfileFieldKey).map((key: ProfileFieldKey) => [
          key,
          { key, lastUpdated: null, history: [] },
        ])
      )
    ),
  };
  user.profileFields.forEach((field: ProfileField) => {
    const { lastUpdated } = transformedUser.profile[field.key];
    if (lastUpdated === null || lastUpdated < new Date(field.createdAt)) {
      (transformedUser.profile[
        field.key
      ] as IProfileFieldBuilt<ProfileFieldKey>).current = field;
      transformedUser.profile[field.key].lastUpdated = new Date(
        field.createdAt
      );
    }
    (transformedUser.profile[field.key].history as IProfileField<
      typeof field.key
    >[]).push(field);
  });
  return transformedUser;
}
