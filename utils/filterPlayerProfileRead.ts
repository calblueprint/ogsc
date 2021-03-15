import { ProfileFieldKey, UserRoleType } from "@prisma/client";
import { IPlayer, IUser, PlayerProfile } from "interfaces";
import ProfileAccessDefinitionsByRole from "lib/access/definitions";
import resolveAccessValue from "lib/access/resolve";

export const filterProfileFieldRead = (
  fieldKey: ProfileFieldKey,
  player: IPlayer,
  user: IUser
): boolean => {
  if (user.defaultRole.type === UserRoleType.Admin) {
    return true;
  }
  const accessValue =
    ProfileAccessDefinitionsByRole[
      user.defaultRole.type as Exclude<UserRoleType, "Admin">
    ][fieldKey as ProfileFieldKey];
  if (accessValue === undefined) {
    return false;
  }
  return resolveAccessValue(accessValue, "read", player, user);
};

const filterPlayerProfileRead = (player: IPlayer, user: IUser): IPlayer => {
  if (!player.profile || user.defaultRole.type === UserRoleType.Admin) {
    return player;
  }

  return {
    ...player,
    absences: undefined,
    profile: Object.fromEntries(
      Object.entries<PlayerProfile[ProfileFieldKey]>(
        player.profile as PlayerProfile
      ).filter(([fieldKey]: [string, PlayerProfile[ProfileFieldKey]]) =>
        filterProfileFieldRead(fieldKey as ProfileFieldKey, player, user)
      )
    ),
  };
};

export default filterPlayerProfileRead;
