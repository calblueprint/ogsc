import { Absence, ProfileField, ProfileFieldKey } from "@prisma/client";
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

export const serializeProfileFieldValue = (
  field: IProfileFieldBuilt<ProfileFieldKey> | null | undefined
): string | null => {
  if (field?.draft == null) {
    return null;
  }
  if (typeof field.draft === "string") {
    return field.draft;
  }

  const originValueType = ProfileFieldValues[field.key];
  try {
    switch (originValueType) {
      case ProfileFieldValue.FloatWithComment:
      case ProfileFieldValue.IntegerWithComment: {
        const draft = field.draft as ProfileFieldValueDeserializedTypes[typeof originValueType];
        return JSON.stringify({ ...draft, date: draft.date.toISOString() });
      }
      case ProfileFieldValue.TimeElapsed: {
        const draft = field.draft as ProfileFieldValueDeserializedTypes[typeof originValueType];
        return draft.toISOString();
      }
      case ProfileFieldValue.DistanceMeasured: {
        const draft = field.draft as ProfileFieldValueDeserializedTypes[typeof originValueType];
        return String(
          (Number.isNaN(draft.feet) ? 0 : draft.feet * 12) +
            (Number.isNaN(draft.inches) ? 0 : draft.inches)
        );
      }
      case ProfileFieldValue.Text:
      case ProfileFieldValue.Integer:
      case ProfileFieldValue.URL:
      default:
        return String(field.draft);
    }
  } catch (err) {
    return null;
  }
};

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
        if (typeof parsed !== "object" || !("value" in parsed)) {
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
    profile: <PlayerProfile>(
      Object.fromEntries<PlayerProfile[ProfileFieldKey]>(
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
      transformedUser.profile[field.key].current = field;
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
