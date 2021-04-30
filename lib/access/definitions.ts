import { AbsenceType, ProfileFieldKey, UserRoleType } from "@prisma/client";
import { IPlayer, IUser } from "interfaces";
import {
  AccessValue,
  AttendanceAccessDefinition,
  ProfileAccessDefinition,
} from "./types";

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
  [ProfileFieldKey.BioAboutMe]: { read: true },
  [ProfileFieldKey.BioFavoriteSubject]: { read: true },
  [ProfileFieldKey.BioMostDifficultSubject]: { read: true },
  [ProfileFieldKey.BioHobbies]: { read: true },
  [ProfileFieldKey.BioParents]: { read: true },
  [ProfileFieldKey.BioSiblings]: { read: true },
  [ProfileFieldKey.IntroVideo]: { read: true },
  [ProfileFieldKey.Highlights]: { read: true },
  [ProfileFieldKey.YearOfBirth]: { read: true },
  [ProfileFieldKey.ProfilePicture]: { read: true },
};

/**
 * Additional access given to non-players.
 */
const sharedReadAccess = {
  [ProfileFieldKey.GPA]: { read: isSharedPlayerProfile },
  [ProfileFieldKey.PacerTest]: { read: isSharedPlayerProfile },
  [ProfileFieldKey.MileTime]: { read: isSharedPlayerProfile },
  [ProfileFieldKey.Situps]: { read: isSharedPlayerProfile },
  [ProfileFieldKey.Pushups]: { read: isSharedPlayerProfile },
  [ProfileFieldKey.HealthAndWellness]: { read: isSharedPlayerProfile },
  [ProfileFieldKey.AcademicEngagementScore]: { read: isSharedPlayerProfile },
  [ProfileFieldKey.AdvisingScore]: { read: isSharedPlayerProfile },
  [ProfileFieldKey.AthleticScore]: { read: isSharedPlayerProfile },
  [ProfileFieldKey.DisciplinaryActions]: { read: isSharedPlayerProfile },
};

const allAbsencesSharedReadAccess = {
  [AbsenceType.Academic]: { read: isSharedPlayerProfile },
  [AbsenceType.Athletic]: { read: isSharedPlayerProfile },
  [AbsenceType.School]: { read: isSharedPlayerProfile },
};

export const AttendanceAccessDefinitionsByRole: Record<
  Exclude<UserRoleType, "Admin">,
  AttendanceAccessDefinition
> = {
  [UserRoleType.Donor]: {},
  [UserRoleType.Mentor]: {
    ...allAbsencesSharedReadAccess,
  },
  [UserRoleType.Parent]: {
    ...allAbsencesSharedReadAccess,
  },
  [UserRoleType.Player]: {
    [AbsenceType.Academic]: { read: isOwnPlayerProfile },
    [AbsenceType.Athletic]: { read: isOwnPlayerProfile },
    [AbsenceType.School]: { read: isOwnPlayerProfile },
  },
};

/**
 * A map of UserRoleTypes (except for Admins, who by default have full access) to
 * ProfileAccessDefinitions.
 */
export const ProfileAccessDefinitionsByRole: Record<
  Exclude<UserRoleType, "Admin">,
  ProfileAccessDefinition
> = {
  [UserRoleType.Donor]: {
    ...standardReadAccess,
    ...sharedReadAccess,
  },
  [UserRoleType.Mentor]: {
    ...standardReadAccess,
    ...sharedReadAccess,
  },
  [UserRoleType.Parent]: {
    ...standardReadAccess,
    ...sharedReadAccess,
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
    [ProfileFieldKey.GPA]: { read: isOwnPlayerProfile },
    [ProfileFieldKey.PacerTest]: { read: isOwnPlayerProfile },
    [ProfileFieldKey.MileTime]: { read: isOwnPlayerProfile },
    [ProfileFieldKey.Situps]: { read: isOwnPlayerProfile },
    [ProfileFieldKey.Pushups]: { read: isOwnPlayerProfile },
    [ProfileFieldKey.HealthAndWellness]: { read: isOwnPlayerProfile },
    [ProfileFieldKey.DisciplinaryActions]: { read: isOwnPlayerProfile },
    [ProfileFieldKey.ProfilePicture]: {
      read: true,
      write: isOwnPlayerProfile,
    },
  },
};
