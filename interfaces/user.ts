import {
  Absence,
  ProfileField,
  ProfileFieldKey,
  Role,
  User,
  UserRoleType,
  Notes,
} from "@prisma/client";
import { IconType } from "components/Icon";
import { Dayjs } from "dayjs";
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
  File = "file",
  /**
   * DistanceMeasured values are recorded in inches.
   */
  DistanceMeasured = "distance_measured",
  StandardizedTestResult = "standardized_test",
  TextListItem = "text_list_item",
}

export const ProfileFieldValues = <const>{
  [ProfileFieldKey.AcademicEngagementScore]:
    ProfileFieldValue.IntegerWithComment,
  [ProfileFieldKey.AdvisingScore]: ProfileFieldValue.IntegerWithComment,
  [ProfileFieldKey.AthleticScore]: ProfileFieldValue.IntegerWithComment,
  [ProfileFieldKey.InternalAssessments]: ProfileFieldValue.IntegerWithComment,
  [ProfileFieldKey.StandardizedTesting]:
    ProfileFieldValue.StandardizedTestResult,
  [ProfileFieldKey.SAT]: ProfileFieldValue.StandardizedTestResult,
  [ProfileFieldKey.ACT]: ProfileFieldValue.StandardizedTestResult,
  [ProfileFieldKey.HighSchoolGraduation]: ProfileFieldValue.Text,
  [ProfileFieldKey.CollegeAdmissions]: ProfileFieldValue.Text,
  [ProfileFieldKey.BioAboutMe]: ProfileFieldValue.Text,
  [ProfileFieldKey.BioFavoriteSubject]: ProfileFieldValue.Text,
  [ProfileFieldKey.BioHobbies]: ProfileFieldValue.Text,
  [ProfileFieldKey.BioMostDifficultSubject]: ProfileFieldValue.Text,
  [ProfileFieldKey.BioParents]: ProfileFieldValue.Text,
  [ProfileFieldKey.BioSiblings]: ProfileFieldValue.Text,
  [ProfileFieldKey.Height]: ProfileFieldValue.DistanceMeasured,
  [ProfileFieldKey.DisciplinaryActions]: ProfileFieldValue.TextListItem,
  [ProfileFieldKey.GPA]: ProfileFieldValue.FloatWithComment,
  [ProfileFieldKey.HealthAndWellness]: ProfileFieldValue.Text,
  [ProfileFieldKey.Highlights]: ProfileFieldValue.URL,
  [ProfileFieldKey.IntroVideo]: ProfileFieldValue.URL,
  [ProfileFieldKey.MileTime]: ProfileFieldValue.TimeElapsed,
  [ProfileFieldKey.PacerTest]: ProfileFieldValue.Integer,
  [ProfileFieldKey.YearOfBirth]: ProfileFieldValue.Integer,
  [ProfileFieldKey.Pushups]: ProfileFieldValue.Integer,
  [ProfileFieldKey.Situps]: ProfileFieldValue.Integer,
  [ProfileFieldKey.ProfilePicture]: ProfileFieldValue.File,
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
  [ProfileFieldKey.ProfilePicture]: "Player Photo",
  [ProfileFieldKey.InternalAssessments]: "Internal Assessments",
  [ProfileFieldKey.StandardizedTesting]: "Standardized Testing",
  [ProfileFieldKey.SAT]: "SAT",
  [ProfileFieldKey.ACT]: "ACT",
  [ProfileFieldKey.HighSchoolGraduation]: "High School Graduation",
  [ProfileFieldKey.CollegeAdmissions]: "College Admissions",
} as const;

export enum ProfileCategory {
  Overview = "Overview",
  Engagement = "Engagement",
  AcademicPerformance = "Academics",
  Attendance = "Attendance",
  PhysicalWellness = "Physical Wellness",
  Highlights = "Highlights",
  // eslint-disable-next-line @typescript-eslint/no-shadow
  Notes = "Notes",
}

export const ProfileCategoryIcons: Record<ProfileCategory, IconType> = {
  [ProfileCategory.Overview]: "profile",
  [ProfileCategory.Engagement]: "lightning",
  [ProfileCategory.AcademicPerformance]: "book",
  [ProfileCategory.Attendance]: "calendar",
  [ProfileCategory.PhysicalWellness]: "shoe",
  [ProfileCategory.Highlights]: "star",
  [ProfileCategory.Notes]: "note",
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
    ProfileFieldKey.HighSchoolGraduation,
    ProfileFieldKey.CollegeAdmissions,
    ProfileFieldKey.SAT,
    ProfileFieldKey.ACT,
    ProfileFieldKey.InternalAssessments,
    ProfileFieldKey.StandardizedTesting,
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
  [ProfileCategory.Notes]: [],
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

type TrackedOverTime = {
  /**
   * A field that represents what date this value is recorded for.
   */
  date: Dayjs;
};

export type ProfileFieldValueDeserializedTypes = {
  [ProfileFieldValue.Text]: string;
  [ProfileFieldValue.URL]: string;
  [ProfileFieldValue.Integer]: number;
  [ProfileFieldValue.IntegerWithComment]: TrackedOverTime &
    WithComment & {
      value: number;
    };
  [ProfileFieldValue.Float]: number;
  [ProfileFieldValue.FloatWithComment]: TrackedOverTime &
    WithComment & {
      value: number;
    };
  [ProfileFieldValue.TimeElapsed]: Duration;
  [ProfileFieldValue.DistanceMeasured]: { feet: number; inches: number };
  [ProfileFieldValue.File]: { key: string };
  [ProfileFieldValue.StandardizedTestResult]: TrackedOverTime &
    WithComment & {
      value: number;
      percentile: number;
    };
  [ProfileFieldValue.TextListItem]: TrackedOverTime & Required<WithComment>;
};

export type TimeSeriesProfileFieldValues = {
  [V in ProfileFieldValue]: ProfileFieldValueDeserializedTypes[V] extends TrackedOverTime
    ? V
    : never;
}[ProfileFieldValue];

export type IProfileField<K extends ProfileFieldKey = ProfileFieldKey> = Omit<
  ProfileField,
  "key"
> & {
  key: K;
  /**
   * In an editing context, `draft` will refer to the temporary new value for this particular
   * field that already exists.
   */
  draft?: ProfileFieldValueDeserializedTypes[ProfileFieldValues[K]];
  /**
   * A validation error message in reference to the current `draft` value.
   */
  error?: string;
  modified?: boolean;
};

export type UncreatedProfileField<
  K extends ProfileFieldKey = ProfileFieldKey
> = IProfileField<K> & {
  uncreated: true;
};

export type IProfileFieldBuilt<K extends ProfileFieldKey> = {
  key: K;
  current?: IProfileField<K>;
  lastUpdated: Date | null;
  history: (IProfileField<K> | UncreatedProfileField<K>)[];
  /**
   * In an editing context, `draft` will refer to the temporary value that the user has entered
   * for the new field to be created.
   */
  draft?: ProfileFieldValueDeserializedTypes[ProfileFieldValues[K]];
  /**
   * A validation error message in reference to the current `draft` value.
   */
  error?: string;
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
  | ProfileFieldValue.IntegerWithComment
  | ProfileFieldValue.FloatWithComment
  | ProfileFieldValue.StandardizedTestResult
>;

export type DefaultRole = {
  type: UserRoleType;
  relatedPlayerIds: number[];
};

export type IAbsence = Absence & {
  draft?: Partial<Absence>;
  modified?: boolean;
};
export type UncreatedAbsence = IAbsence & {
  uncreated: true;
};

export type IUser = SanitizedUser & {
  defaultRole: DefaultRole;
  roles?: Role[];
};

export type IPlayer = IUser & {
  profile: Partial<PlayerProfile> | null;
  absences?: (IAbsence | UncreatedAbsence)[];
  absenceDraft?: Partial<Absence>;
  playerNotes?: Notes[];
};
