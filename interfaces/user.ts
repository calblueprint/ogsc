import { ProfileField, User, ViewingPermission } from "@prisma/client";

// TODO: Use Prisma-generated types for this once prisma/prisma#3252 is resolved
export declare const ProfileFieldKey: {
  AcademicEngagementScore: "AcademicEngagementScore";
  AdvisingScore: "AdvisingScore";
  AthleticScore: "AthleticScore";
  BioAboutMe: "BioAboutMe";
  BioFavorites: "BioFavorites";
  BioHobbies: "BioHobbies";
  BioMostDifficultSubject: "BioMostDifficultSubject";
  BioParents: "BioParents";
  BioSiblings: "BioSiblings";
  BMI: "BMI";
  DisciplinaryActions: "DisciplinaryActions";
  GPA: "GPA";
  HealthAndWellness: "HealthAndWellness";
  Highlights: "Highlights";
  MileTime: "MileTime";
  PacerTest: "PacerTest";
  PlayerNumber: "PlayerNumber";
  Pushups: "Pushups";
  Situps: "Situps";
};
export declare type ProfileFieldKey = typeof ProfileFieldKey[keyof typeof ProfileFieldKey];

export type PrivateUserFields = "hashedPassword";
export type SanitizedUser = Omit<User, PrivateUserFields>;

export const UserRoleConstants = <const>[
  "admin",
  "mentor",
  "parent",
  "player",
  "donor",
];
export type UserRole = typeof UserRoleConstants[number];
export const UserRoleLabel: Record<UserRole, string> = {
  admin: "Admin",
  mentor: "Mentor",
  parent: "Parent",
  player: "Player",
  donor: "Donor",
};

export enum ProfileFieldValue {
  Text = "text",
  URL = "url",
  Integer = "integer",
  Float = "float",
  TimeElapsed = "time_elapsed",
}

export const ProfileFieldValues = <const>{
  [ProfileFieldKey.AcademicEngagementScore]: ProfileFieldValue.Integer,
  [ProfileFieldKey.AdvisingScore]: ProfileFieldValue.Integer,
  [ProfileFieldKey.AthleticScore]: ProfileFieldValue.Integer,
  [ProfileFieldKey.BioAboutMe]: ProfileFieldValue.Text,
  [ProfileFieldKey.BioFavorites]: ProfileFieldValue.Text,
  [ProfileFieldKey.BioHobbies]: ProfileFieldValue.Text,
  [ProfileFieldKey.BioMostDifficultSubject]: ProfileFieldValue.Text,
  [ProfileFieldKey.BioParents]: ProfileFieldValue.Text,
  [ProfileFieldKey.BioSiblings]: ProfileFieldValue.Text,
  [ProfileFieldKey.BMI]: ProfileFieldValue.Float,
  [ProfileFieldKey.DisciplinaryActions]: ProfileFieldValue.Text,
  [ProfileFieldKey.GPA]: ProfileFieldValue.Float,
  [ProfileFieldKey.HealthAndWellness]: ProfileFieldValue.Text,
  [ProfileFieldKey.Highlights]: ProfileFieldValue.URL,
  [ProfileFieldKey.MileTime]: ProfileFieldValue.TimeElapsed,
  [ProfileFieldKey.PacerTest]: ProfileFieldValue.Integer,
  [ProfileFieldKey.PlayerNumber]: ProfileFieldValue.Text,
  [ProfileFieldKey.Pushups]: ProfileFieldValue.Integer,
  [ProfileFieldKey.Situps]: ProfileFieldValue.Integer,
};
export type ProfileFieldValues = typeof ProfileFieldValues;

export type ProfileFieldValueDeserializedTypes = {
  [ProfileFieldValue.Text]: string;
  [ProfileFieldValue.URL]: string;
  [ProfileFieldValue.Integer]: number;
  [ProfileFieldValue.Float]: number;
  [ProfileFieldValue.TimeElapsed]: string;
};

export type PlayerProfile = {
  [K in ProfileFieldKey]: {
    current: ProfileFieldValueDeserializedTypes[ProfileFieldValues[K]] | null;
    lastUpdated: Date | null;
    history: ProfileField[];
  };
};

export type UserInterface = SanitizedUser & {
  profile: PlayerProfile | null;
  viewerPermissions: ViewingPermission[];
};
