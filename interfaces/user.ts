import {
  Absence,
  ProfileField,
  ProfileFieldKey,
  Role,
  User,
  UserRoleType,
} from "@prisma/client";
import { IconType } from "components/Icon";
import { Duration } from "dayjs/plugin/duration";

export type PrivateUserFields = "hashedPassword";
export type SanitizedUser = Omit<User, PrivateUserFields>;

export const UserRoleLabel: Record<UserRoleType, string> = {
  [UserRoleType.Admin]: "Admin",
  [UserRoleType.Mentor]: "Mentor",
  [UserRoleType.Parent]: "Parent",
  [UserRoleType.Player]: "Player",
  [UserRoleType.Donor]: "Donor",
};

export enum ProfileFieldValue {
  Text = "text",
  URL = "url",
  Integer = "integer",
  Float = "float",
  IntegerWithComment = "integer_with_comment",
  FloatWithComment = "float_with_comment",
  TimeElapsed = "time_elapsed",
  /**
   * DistanceMeasured values are recorded in inches.
   */
  DistanceMeasured = "distance_measured",
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
  [ProfileFieldKey.Height]: ProfileFieldValue.DistanceMeasured,
  [ProfileFieldKey.DisciplinaryActions]: ProfileFieldValue.Text,
  [ProfileFieldKey.GPA]: ProfileFieldValue.FloatWithComment,
  [ProfileFieldKey.HealthAndWellness]: ProfileFieldValue.Text,
  [ProfileFieldKey.Highlights]: ProfileFieldValue.URL,
  [ProfileFieldKey.IntroVideo]: ProfileFieldValue.URL,
  [ProfileFieldKey.MileTime]: ProfileFieldValue.TimeElapsed,
  [ProfileFieldKey.PacerTest]: ProfileFieldValue.Integer,
  [ProfileFieldKey.YearOfBirth]: ProfileFieldValue.Integer,
  [ProfileFieldKey.Pushups]: ProfileFieldValue.Integer,
  [ProfileFieldKey.Situps]: ProfileFieldValue.Integer,
};
export type ProfileFieldValues = typeof ProfileFieldValues;

export const ProfileFieldLabels = {
  [ProfileFieldKey.BioAboutMe]: "About Me",
  [ProfileFieldKey.BioHobbies]: "Hobbies",
  [ProfileFieldKey.BioFavoriteSubject]: "Favorite Subject",
  [ProfileFieldKey.BioMostDifficultSubject]: "Most Difficult Subject",
  [ProfileFieldKey.BioSiblings]: "Siblings",
  [ProfileFieldKey.BioParents]: "Parents",
  [ProfileFieldKey.IntroVideo]: "Intro Video",
  [ProfileFieldKey.PacerTest]: "Pacer Test",
  [ProfileFieldKey.MileTime]: "1 Mile Time",
  [ProfileFieldKey.Situps]: "Sit-Ups",
  [ProfileFieldKey.Pushups]: "Push-Ups",
  [ProfileFieldKey.AcademicEngagementScore]: "School Engagement",
  [ProfileFieldKey.AdvisingScore]: "Academic Advising Engagement",
  [ProfileFieldKey.AthleticScore]: "Athletics Engagement",
  [ProfileFieldKey.GPA]: "Grade Point Average",
  [ProfileFieldKey.DisciplinaryActions]: "Disciplinary Actions",
  [ProfileFieldKey.HealthAndWellness]: "Comments",
  [ProfileFieldKey.YearOfBirth]: "Birth Year",
} as const;

export enum ProfileCategory {
  Overview = "Overview",
  Engagement = "Engagement",
  AcademicPerformance = "Academics",
  Attendance = "Attendance",
  PhysicalWellness = "Physical Wellness",
  Highlights = "Highlights",
}

export const ProfileCategoryIcons: Record<ProfileCategory, IconType> = {
  [ProfileCategory.Overview]: "profile",
  [ProfileCategory.Engagement]: "lightning",
  [ProfileCategory.AcademicPerformance]: "book",
  [ProfileCategory.Attendance]: "calendar",
  [ProfileCategory.PhysicalWellness]: "shoe",
  [ProfileCategory.Highlights]: "star",
};

/**
 * Categorizes each profile field, for determining if a category should appear given a partial
 * profile.
 *
 * Modifying this object will not update the display behavior of the profile field, those changes
 * must be added to the `ProfileContents` component.
 */
export const ProfileFieldsByCategory: Record<
  ProfileCategory,
  ProfileFieldKey[]
> = {
  [ProfileCategory.Overview]: [
    ProfileFieldKey.BioAboutMe,
    ProfileFieldKey.BioHobbies,
    ProfileFieldKey.BioFavoriteSubject,
    ProfileFieldKey.BioMostDifficultSubject,
    ProfileFieldKey.BioSiblings,
    ProfileFieldKey.BioParents,
    ProfileFieldKey.IntroVideo,
  ],
  [ProfileCategory.Engagement]: [
    ProfileFieldKey.AcademicEngagementScore,
    ProfileFieldKey.AdvisingScore,
    ProfileFieldKey.AthleticScore,
  ],
  [ProfileCategory.AcademicPerformance]: [
    ProfileFieldKey.GPA,
    ProfileFieldKey.DisciplinaryActions,
  ],
  [ProfileCategory.Attendance]: [],
  [ProfileCategory.PhysicalWellness]: [
    ProfileFieldKey.Height,
    ProfileFieldKey.PacerTest,
    ProfileFieldKey.MileTime,
    ProfileFieldKey.Situps,
    ProfileFieldKey.Pushups,
    ProfileFieldKey.HealthAndWellness,
  ],
  [ProfileCategory.Highlights]: [ProfileFieldKey.Highlights],
};

export const UncategorizedProfileFields: ProfileFieldKey[] = Object.values(
  ProfileFieldKey
).filter((key: ProfileFieldKey) => {
  const categorizedKeys = Object.values(ProfileFieldsByCategory).flat();
  return !categorizedKeys.includes(key);
});

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
  [ProfileFieldValue.TimeElapsed]: Duration;
  [ProfileFieldValue.DistanceMeasured]: { feet: number; inches: number };
};

export type IProfileField<K extends ProfileFieldKey = ProfileFieldKey> = Omit<
  ProfileField,
  "key"
> & {
  key: K;
};

export type IProfileFieldBuilt<K extends ProfileFieldKey> = {
  key: K;
  current?: IProfileField<K>;
  /**
   * In an editing context, `draft` will refer to the temporary value that the user has entered.
   */
  draft?: ProfileFieldValueDeserializedTypes[ProfileFieldValues[K]];
  lastUpdated: Date | null;
  history: IProfileField<K>[];
};

export type PlayerProfile = {
  [K in ProfileFieldKey]: IProfileFieldBuilt<K>;
};

export type ProfileFieldKeysOfProfileValueType<
  T extends ProfileFieldValue
> = Exclude<
  {
    [K in ProfileFieldKey]: ProfileFieldValues[K] extends T ? K : never;
  }[ProfileFieldKey],
  never
>;

export type NumericProfileFields = ProfileFieldKeysOfProfileValueType<
  | ProfileFieldValue.Integer
  | ProfileFieldValue.Float
  | ProfileFieldValue.IntegerWithComment
  | ProfileFieldValue.FloatWithComment
>;

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
