import { ProfileField, ProfileFieldKey, User } from "@prisma/client";
import { PlayerProfile } from "interfaces";

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
