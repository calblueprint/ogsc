import { ProfileField, User } from "@prisma/client";
import {
  PlayerProfile,
  ProfileFieldKey,
  ProfileFieldValue,
  ProfileFieldValueDeserializedTypes,
  ProfileFieldValues,
} from "interfaces";

export const deserializeProfileFieldValue = <T extends ProfileField>(
  field: T
): ProfileFieldValueDeserializedTypes[ProfileFieldValues[T["key"]]] | null => {
  type Deserialized = ProfileFieldValueDeserializedTypes[ProfileFieldValues[T["key"]]];
  switch (ProfileFieldValues[field.key]) {
    case ProfileFieldValue.Float:
      return Number(field.value) as Deserialized;
    case ProfileFieldValue.Integer:
      return Math.floor(Number(field.value)) as Deserialized;
    case ProfileFieldValue.Text:
    case ProfileFieldValue.TimeElapsed:
    case ProfileFieldValue.URL:
    default:
      return field.value as Deserialized;
  }
};

export default function buildUserProfile<
  T extends User & { profileFields: ProfileField[] }
>(user: T): T & { profile: PlayerProfile | null } {
  if (user.profileFields.length === 0) {
    return { ...user, profile: null };
  }
  const transformedUser: T & { profile: PlayerProfile } = {
    ...user,
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
    if (lastUpdated === null || lastUpdated < field.createdAt) {
      transformedUser.profile[field.key].current = deserializeProfileFieldValue(
        field
      );
      transformedUser.profile[field.key].lastUpdated = field.createdAt;
    }
    transformedUser.profile[field.key].history.push(field);
  });
  return transformedUser;
}
