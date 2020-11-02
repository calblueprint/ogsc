import { ProfileField, ProfileFieldKey, User } from "@prisma/client";
import {
  PlayerProfile,
  ProfileFieldValue,
  ProfileFieldValueDeserializedTypes,
  ProfileFieldValues,
} from "interfaces";

export const deserializeProfileFieldValue = <T extends ProfileField>(
  field: T
): ProfileFieldValueDeserializedTypes[ProfileFieldValues[T["key"]]] => {
  switch (ProfileFieldValues[field.key]) {
    case ProfileFieldValue.Float:
      // Observe the TS error here:
      return Number(field.value);
    default:
      return field.value;
  }
};

// See the return type of test: this works!
const test = deserializeProfileFieldValue({
  id: 1,
  userId: 1,
  createdAt: new Date(),
  key: ProfileFieldKey.GPA,
  value: "3",
});

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
          { current: null, lastUpdated: null, history: [] },
        ])
      )
    ),
  };
  user.profileFields.forEach((field: ProfileField) => {
    const { lastUpdated } = transformedUser.profile[field.key];
    if (lastUpdated === null || lastUpdated < field.createdAt) {
      transformedUser.profile[field.key].current = field.value;
      transformedUser.profile[field.key].lastUpdated = field.createdAt;
    }
    transformedUser.profile[field.key].history.push(field);
  });
  return transformedUser;
}
