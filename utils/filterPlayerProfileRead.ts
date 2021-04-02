import { Absence } from "@prisma/client";
import {
  AbsenceType,
  IPlayer,
  IUser,
  PlayerProfile,
  ProfileFieldKey,
  UserRoleType,
} from "interfaces";
import {
  ProfileAccessDefinitionsByRole,
  AttendanceAccessDefinitionsByRole,
} from "lib/access/definitions";
import resolveAccessValue from "lib/access/resolve";

const filterPlayerProfileRead = (player: IPlayer, user: IUser): IPlayer => {
  if (!player.profile || user.defaultRole.type === UserRoleType.Admin) {
    return player;
  }

  const canAccessAbsenceType = (type: AbsenceType): boolean => {
    const accessValue =
      AttendanceAccessDefinitionsByRole[
        user.defaultRole.type as Exclude<UserRoleType, "Admin">
      ][type];
    if (accessValue === undefined) {
      return false;
    }
    return resolveAccessValue(accessValue, "read", player, user);
  };

  const canAccessAbsences = Object.values(AbsenceType).some((type) =>
    canAccessAbsenceType(type)
  );

  return {
    ...player,
    absences: canAccessAbsences
      ? player.absences?.filter((absence: Absence) =>
          canAccessAbsenceType(absence.type)
        )
      : undefined,
    profile: Object.fromEntries(
      Object.entries<PlayerProfile[ProfileFieldKey]>(
        player.profile as PlayerProfile
      ).filter(([fieldKey]: [string, PlayerProfile[ProfileFieldKey]]) => {
        const accessValue =
          ProfileAccessDefinitionsByRole[
            user.defaultRole.type as Exclude<UserRoleType, "Admin">
          ][fieldKey as ProfileFieldKey];
        if (accessValue === undefined) {
          return false;
        }
        return resolveAccessValue(accessValue, "read", player, user);
      })
    ),
  };
};

export default filterPlayerProfileRead;
