import { AbsenceType, ProfileFieldKey, UserRoleType } from "@prisma/client";
import { IPlayer, IUser } from "interfaces";
import {
  AccessValue,
  AttendanceAccessDefinition,
  NotesAccessDefinition,
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

const isCreator: AccessValue = (
  _: IPlayer,
  user: IUser,
  data?: Record<string, unknown>
): boolean => {
  if (!data || !("creatorId" in data)) return false;
  return user.id === data.creatorId;
};

// Takes in an arbitrary number of AccessValue functions, and returns
// a new AccessValue function that requires all of them to be true.
const requireAll = (
  ...conditions: ((
    player: IPlayer,
    user: IUser,
    data?: Record<string, unknown>
  ) => AccessValue)[]
) => (player: IPlayer, user: IUser, data?: Record<string, unknown>) =>
  conditions.every((condition) => condition(player, user, data));

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
  [ProfileFieldKey.HighSchoolGraduation]: { read: true },
  [ProfileFieldKey.CollegeAdmissions]: { read: true },
};

/**
 * Additional access given to non-players.
 */
const sharedReadAccess = {
  [ProfileFieldKey.GPA]: { read: isSharedPlayerProfile },
  [ProfileFieldKey.ACT]: { read: isSharedPlayerProfile },
  [ProfileFieldKey.SAT]: { read: isSharedPlayerProfile },
  [ProfileFieldKey.InternalAssessments]: { read: isSharedPlayerProfile },
  [ProfileFieldKey.Height]: { read: isSharedPlayerProfile },
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

export const NotesAccessDefinitionsByRole: Record<
  Exclude<UserRoleType, "Admin">,
  NotesAccessDefinition
> = {
  [UserRoleType.Donor]: {},
  [UserRoleType.Mentor]: {
    read: isSharedPlayerProfile,
    write: requireAll(isSharedPlayerProfile, isCreator),
  },
  [UserRoleType.Parent]: {},
  [UserRoleType.Player]: {},
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
