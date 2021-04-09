import { Absence, ProfileField, ProfileFieldKey } from "@prisma/client";
import {
  IProfileField,
  PlayerProfile,
  ProfileFieldValue,
  ProfileFieldValueDeserializedTypes,
  ProfileFieldValues,
  SanitizedUser,
} from "interfaces";

export const deserializeProfileFieldValue = <
  T extends ProfileField,
  K extends ProfileFieldKey = T["key"]
>(
  field: T
): ProfileFieldValueDeserializedTypes[ProfileFieldValues[K]] | null => {
  type Deserialized = ProfileFieldValueDeserializedTypes[ProfileFieldValues[K]];
  const targetValueType = ProfileFieldValues[field.key];

  try {
    switch (targetValueType) {
      case ProfileFieldValue.Float:
        return Number(field.value) as Deserialized;
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
      case ProfileFieldValue.Text:
      case ProfileFieldValue.TimeElapsed:
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
          { key, current: null, lastUpdated: null, history: [] },
        ])
      )
    ),
  };
  user.profileFields.forEach((field: ProfileField) => {
    const { lastUpdated } = transformedUser.profile[field.key];
    if (lastUpdated === null || lastUpdated < new Date(field.createdAt)) {
      transformedUser.profile[field.key].current = deserializeProfileFieldValue(
        field
      );
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
