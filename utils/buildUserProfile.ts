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
  const originValueType = ProfileFieldValues[field.key];
  try {
    switch (originValueType) {
      case ProfileFieldValue.FloatWithComment:
      case ProfileFieldValue.IntegerWithComment:
        return JSON.stringify(field.draft);
      case ProfileFieldValue.TimeElapsed: {
        const draft = field.draft as ProfileFieldValueDeserializedTypes[typeof originValueType];
        return draft.toISOString();
      }
      case ProfileFieldValue.DistanceMeasured: {
        const draft = field.draft as ProfileFieldValueDeserializedTypes[typeof originValueType];
        return String(draft.feet * 12 + draft.inches);
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

export const deserializeProfileFieldValue = <
  T extends ProfileField,
  K extends ProfileFieldKey = T["key"]
>(
  field: T | undefined
): ProfileFieldValueDeserializedTypes[ProfileFieldValues[K]] | null => {
  if (field === undefined) {
    return null;
  }
  type Deserialized = ProfileFieldValueDeserializedTypes[ProfileFieldValues[K]];
  const targetValueType = ProfileFieldValues[field.key];

  try {
    switch (targetValueType) {
      case ProfileFieldValue.Integer:
        return Math.floor(Number(field.value)) as Deserialized;
      case ProfileFieldValue.FloatWithComment:
      case ProfileFieldValue.IntegerWithComment: {
        if (!field.value) {
          return null;
        }
        const parsed = JSON.parse(field.value);
        if (typeof parsed !== "object" || !("value" in parsed)) {
          return null;
        }
        return {
          comment: parsed.comment,
          value:
            targetValueType === ProfileFieldValue.IntegerWithComment
              ? Math.floor(Number(parsed.value))
              : Number(parsed.value),
        } as Deserialized;
      }
      case ProfileFieldValue.TimeElapsed:
        if (field.value === null) {
          return null;
        }
        return dayjs.duration(field.value) as Deserialized;
      case ProfileFieldValue.DistanceMeasured:
        if (field.value === null) {
          return null;
        }
        return {
          feet: Math.floor(Number(field.value) / 12),
          inches: Number((Number(field.value) % 12).toFixed(1)),
        } as Deserialized;
      case ProfileFieldValue.Text:
      case ProfileFieldValue.URL:
      default:
        return field.value as Deserialized;
    }
  } catch (err) {
    // TODO: Log out this error
    return null;
  }
};

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
