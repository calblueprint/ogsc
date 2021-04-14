import { Prisma, UserRoleType } from "@prisma/client";
import { IPlayer, IUser } from "interfaces";
import { AttendanceAccessDefinitionsByRole } from "lib/access/definitions";
import resolveAccessValue from "lib/access/resolve";

export const filterPlayerProfileAbsenceWrite = <
  T extends Prisma.AbsenceCreateWithoutUsersInput
>(
  player: IPlayer,
  user: IUser,
  absences: T[]
): T[] => {
  if (user.defaultRole.type === UserRoleType.Admin) {
    return absences;
  }
  return absences.filter((absence: Prisma.AbsenceCreateWithoutUsersInput) => {
    const accessValue =
      AttendanceAccessDefinitionsByRole[
        user.defaultRole.type as Exclude<UserRoleType, "Admin">
      ][absence.type];
    if (accessValue === undefined) {
      return false;
    }
    return resolveAccessValue(accessValue, "write", player, user);
  });
};

const filterPlayerProfileWrite = <
  T extends Prisma.ProfileFieldCreateWithoutUserInput
>(
  player: IPlayer,
  user: IUser,
  profileFields: T[]
): T[] => {
  if (user.defaultRole.type === UserRoleType.Admin) {
    return profileFields;
  }
  return profileFields.filter(
    (fieldCreate: Prisma.ProfileFieldCreateWithoutUserInput) => {
      const accessValue =
        ProfileAccessDefinitionsByRole[
          user.defaultRole.type as Exclude<UserRoleType, "Admin">
        ][fieldCreate.key];
      if (accessValue === undefined) {
        return false;
      }
      return resolveAccessValue(accessValue, "write", player, user);
    }
  );
};

export default filterPlayerProfileWrite;
