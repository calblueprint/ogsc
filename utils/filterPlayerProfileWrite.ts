import {
  ProfileFieldCreateWithoutUserInput,
  ProfileFieldUpdateManyWithoutUserInput,
} from "@prisma/client";
import { IPlayer, IUser, UserRoleType } from "interfaces";
import ProfileAccessDefinitionsByRole from "lib/access/definitions";
import resolveAccessValue from "lib/access/resolve";

const filterPlayerProfileWrite = (
  player: IPlayer,
  user: IUser,
  profileFields: ProfileFieldUpdateManyWithoutUserInput
): ProfileFieldUpdateManyWithoutUserInput => {
  const filteredProfileFields: ProfileFieldUpdateManyWithoutUserInput = {};
  if (user.defaultRole.type === UserRoleType.Admin) {
    return profileFields;
  }
  if (profileFields.create) {
    filteredProfileFields.create = (Array.isArray(profileFields.create)
      ? profileFields.create
      : [profileFields.create]
    ).filter((fieldCreate: ProfileFieldCreateWithoutUserInput) => {
      const accessValue =
        ProfileAccessDefinitionsByRole[
          user.defaultRole.type as Exclude<UserRoleType, "Admin">
        ][fieldCreate.key];
      if (accessValue === undefined) {
        return false;
      }
      return resolveAccessValue(accessValue, "write", player, user);
    });
  }
  return filteredProfileFields;
};

export default filterPlayerProfileWrite;
