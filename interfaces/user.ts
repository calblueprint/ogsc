import {
  Absence,
  ProfileField,
  ProfileFieldKey,
  Role,
  User,
  UserRoleType,
} from "@prisma/client";

export type PrivateUserFields = "hashedPassword";
export type SanitizedUser = Omit<User, PrivateUserFields>;

export const UserRoleLabel: Record<UserRoleType, string> = {
  [UserRoleType.Admin]: "Admin",
  [UserRoleType.Mentor]: "Mentor",
  [UserRoleType.Parent]: "Parent",
  [UserRoleType.Player]: "Player",
  [UserRoleType.Donor]: "Donor",
};

export enum NoteType {
  General = "general",
  Soccer = "soccer",
  Academics = "academics",
  Mentorship = "mentorship",
}

export enum ProfileFieldValue {
  Text = "text",
  URL = "url",
  Integer = "integer",
  Float = "float",
  IntegerWithComment = "integer_with_comment",
  FloatWithComment = "float_with_comment",
  TimeElapsed = "time_elapsed",
}

export const ProfileFieldValues = <const>{
  [ProfileFieldKey.AcademicEngagementScore]:
    ProfileFieldValue.IntegerWithComment,
  [ProfileFieldKey.AdvisingScore]: ProfileFieldValue.IntegerWithComment,
  [ProfileFieldKey.AthleticScore]: ProfileFieldValue.IntegerWithComment,
  [ProfileFieldKey.BioAboutMe]: ProfileFieldValue.Text,
  [ProfileFieldKey.BioFavoriteSubject]: ProfileFieldValue.Text,
  [ProfileFieldKey.BioHobbies]: ProfileFieldValue.Text,
  [ProfileFieldKey.BioMostDifficultSubject]: ProfileFieldValue.Text,
  [ProfileFieldKey.BioParents]: ProfileFieldValue.Text,
  [ProfileFieldKey.BioSiblings]: ProfileFieldValue.Text,
  [ProfileFieldKey.BMI]: ProfileFieldValue.Float,
  [ProfileFieldKey.DisciplinaryActions]: ProfileFieldValue.Text,
  [ProfileFieldKey.GPA]: ProfileFieldValue.FloatWithComment,
  [ProfileFieldKey.HealthAndWellness]: ProfileFieldValue.Text,
  [ProfileFieldKey.Highlights]: ProfileFieldValue.URL,
  [ProfileFieldKey.IntroVideo]: ProfileFieldValue.URL,
  [ProfileFieldKey.MileTime]: ProfileFieldValue.TimeElapsed,
  [ProfileFieldKey.PacerTest]: ProfileFieldValue.Integer,
  [ProfileFieldKey.PlayerNumber]: ProfileFieldValue.Text,
  [ProfileFieldKey.Pushups]: ProfileFieldValue.Integer,
  [ProfileFieldKey.Situps]: ProfileFieldValue.Integer,
};
export type ProfileFieldValues = typeof ProfileFieldValues;

type WithComment = {
  /**
   * An optional description to provide context about the value or to add commentary.
   */
  comment?: string;
};

export type ProfileFieldValueDeserializedTypes = {
  [ProfileFieldValue.Text]: string;
  [ProfileFieldValue.URL]: string;
  [ProfileFieldValue.Integer]: number;
  [ProfileFieldValue.IntegerWithComment]: WithComment & { value: number };
  [ProfileFieldValue.Float]: number;
  [ProfileFieldValue.FloatWithComment]: WithComment & { value: number };
  [ProfileFieldValue.TimeElapsed]: string;
};

export type IProfileField<K extends ProfileFieldKey> = Omit<
  ProfileField,
  "key"
> & {
  key: K;
};

export type PlayerProfile = {
  [K in ProfileFieldKey]: {
    key: K;
    current: ProfileFieldValueDeserializedTypes[ProfileFieldValues[K]] | null;
    lastUpdated: Date | null;
    history: IProfileField<K>[];
  };
};

export type DefaultRole = {
  type: UserRoleType;
  relatedPlayerIds: number[];
};

export type IUser = SanitizedUser & {
  defaultRole: DefaultRole;
  roles?: Role[];
};

export type IPlayer = IUser & {
  profile: Partial<PlayerProfile> | null;
  absences?: Absence[];
};
