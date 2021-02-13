import { ProfileFieldKey, UserRoleType } from "@prisma/client";
import { IPlayer, IUser } from "interfaces";
import { AccessValue, ProfileAccessDefinition } from "./types";

const isSharedPlayerProfile: AccessValue = (
  player: IPlayer,
  upstreamUser: IUser
): boolean => upstreamUser.defaultRole.relatedPlayerIds.includes(player.id);

const isOwnPlayerProfile: AccessValue = (
  player: IPlayer,
  user: IUser
): boolean => player.id === user.id;

/**
 * The standard access that all users share, minimally.
 */
const standardReadAccess = {
  [ProfileFieldKey.PlayerNumber]: { read: true },
  [ProfileFieldKey.BioAboutMe]: { read: true },
  [ProfileFieldKey.BioFavoriteSubject]: { read: true },
  [ProfileFieldKey.BioMostDifficultSubject]: { read: true },
  [ProfileFieldKey.BioHobbies]: { read: true },
  [ProfileFieldKey.BioParents]: { read: true },
  [ProfileFieldKey.BioSiblings]: { read: true },
  [ProfileFieldKey.IntroVideo]: { read: true },
  [ProfileFieldKey.Highlights]: { read: true },
};

/**
 * A map of UserRoleTypes (except for Admins, who by default have full access) to
 * ProfileAccessDefinitions.
 */
const ProfileAccessDefinitionsByRole: Record<
  Exclude<UserRoleType, "Admin">,
  ProfileAccessDefinition
> = {
  [UserRoleType.Donor]: standardReadAccess,
  [UserRoleType.Mentor]: {
    ...standardReadAccess,
    [ProfileFieldKey.GPA]: { read: isSharedPlayerProfile },
    [ProfileFieldKey.BMI]: { read: isSharedPlayerProfile },
    [ProfileFieldKey.PacerTest]: { read: isSharedPlayerProfile },
    [ProfileFieldKey.MileTime]: { read: isSharedPlayerProfile },
    [ProfileFieldKey.Situps]: { read: isSharedPlayerProfile },
    [ProfileFieldKey.Pushups]: { read: isSharedPlayerProfile },
    [ProfileFieldKey.HealthAndWellness]: { read: isSharedPlayerProfile },
  },
  [UserRoleType.Parent]: {
    ...standardReadAccess,
    [ProfileFieldKey.BioAboutMe]: { read: true, write: isSharedPlayerProfile },
    [ProfileFieldKey.BioFavoriteSubject]: {
      read: true,
      write: isSharedPlayerProfile,
    },
    [ProfileFieldKey.BioMostDifficultSubject]: {
      read: true,
      write: isSharedPlayerProfile,
    },
    [ProfileFieldKey.BioHobbies]: { read: true, write: isSharedPlayerProfile },
    [ProfileFieldKey.BioParents]: { read: true, write: isSharedPlayerProfile },
    [ProfileFieldKey.BioSiblings]: { read: true, write: isSharedPlayerProfile },
  },
  [UserRoleType.Player]: {
    ...standardReadAccess,
    [ProfileFieldKey.BioAboutMe]: { read: true, write: isOwnPlayerProfile },
    [ProfileFieldKey.BioFavoriteSubject]: {
      read: true,
      write: isOwnPlayerProfile,
    },
    [ProfileFieldKey.BioMostDifficultSubject]: {
      read: true,
      write: isOwnPlayerProfile,
    },
    [ProfileFieldKey.BioHobbies]: { read: true, write: isOwnPlayerProfile },
    [ProfileFieldKey.BioParents]: { read: true, write: isOwnPlayerProfile },
    [ProfileFieldKey.BioSiblings]: { read: true, write: isOwnPlayerProfile },
  },
};

export default ProfileAccessDefinitionsByRole;
