import React, { useContext, useState } from "react";
import { IconType } from "components/Icon";
import { PlayerProfile, ProfileFieldKey } from "interfaces";
import formatDate from "utils/formatDate";
import ScoreBox from "./ScoreBox";
import TextLayout from "./TextLayout";

enum ProfileCategory {
  Overview = "Overview",
  Engagement = "Engagement",
  AcademicPerformance = "Academic Performance",
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
    ProfileFieldKey.BMI,
    ProfileFieldKey.PacerTest,
    ProfileFieldKey.MileTime,
    ProfileFieldKey.Situps,
    ProfileFieldKey.Pushups,
    ProfileFieldKey.HealthAndWellness,
  ],
  [ProfileCategory.Highlights]: [ProfileFieldKey.Highlights],
};

const ProfileFieldLabels: Partial<Record<ProfileFieldKey, string>> = {
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
};

const ProfileContext = React.createContext<Partial<PlayerProfile>>({});

type ProfileContentCellProps = {
  fieldKey: ProfileFieldKey;
};

const ProfileContentCell: React.FC<ProfileContentCellProps> = ({
  fieldKey,
}: ProfileContentCellProps) => {
  const profile = useContext(ProfileContext);
  const profileField = profile[fieldKey];
  if (!profileField || !profileField.current || !profileField.lastUpdated) {
    return null;
  }
  switch (profileField.key) {
    case ProfileFieldKey.AcademicEngagementScore:
      return (
        <ScoreBox
          score={profileField.current}
          lastUpdated={profileField.lastUpdated}
          icon="school"
          title="School"
        />
      );
    case ProfileFieldKey.AdvisingScore:
      return (
        <ScoreBox
          score={profileField.current}
          lastUpdated={profileField.lastUpdated}
          icon="academics"
          title="Academic Advising"
        />
      );
    case ProfileFieldKey.AthleticScore:
      return (
        <ScoreBox
          score={profileField.current}
          lastUpdated={profileField.lastUpdated}
          icon="athletics"
          title="Athletic"
        />
      );
    case ProfileFieldKey.BMI:
      return (
        <>
          <div className="mb-6 text-lg font-bold">Body Mass Index</div>
          <TextLayout title="BMI">{profileField.current}</TextLayout>
        </>
      );
    case ProfileFieldKey.DisciplinaryActions:
      return (
        <>
          <div className="mb-6 mt-16 text-lg font-bold">
            Disciplinary Actions
          </div>
          <TextLayout title={null}>{profileField.current}</TextLayout>
        </>
      );
    case ProfileFieldKey.GPA:
      return (
        <>
          <TextLayout title="GPA">{profileField.current.toFixed(2)}</TextLayout>
          <div className="mb-5 text-sm font-light">
            Last Updated {formatDate(profileField.lastUpdated)}
          </div>
        </>
      );
    case ProfileFieldKey.HealthAndWellness:
      return (
        <>
          <div className="mb-6 mt-16 text-lg font-bold">
            Health and Wellness
          </div>
          <TextLayout title={null}>{profileField.current}</TextLayout>
        </>
      );
    default:
      return (
        <TextLayout title={ProfileFieldLabels[fieldKey] || fieldKey}>
          {profileField.current}
        </TextLayout>
      );
  }
};

type ProfileContentsProps<T extends ProfileCategory> = {
  category: T;
};

const ProfileContents = <T extends ProfileCategory>({
  category,
}: ProfileContentsProps<T>): JSX.Element => {
  switch (category) {
    case "Overview":
      return (
        <div>
          <div className="mt-12 mb-10 text-2xl font-display">
            Student Overview
          </div>
          <div className="mb-6 text-lg font-bold">Student Bio</div>
          <div className="m-5">
            <ProfileContentCell fieldKey={ProfileFieldKey.BioAboutMe} />
            <ProfileContentCell fieldKey={ProfileFieldKey.BioHobbies} />
            <ProfileContentCell fieldKey={ProfileFieldKey.BioFavoriteSubject} />
            <ProfileContentCell
              fieldKey={ProfileFieldKey.BioMostDifficultSubject}
            />
            <ProfileContentCell fieldKey={ProfileFieldKey.BioSiblings} />
            <ProfileContentCell fieldKey={ProfileFieldKey.BioParents} />
            <ProfileContentCell fieldKey={ProfileFieldKey.IntroVideo} />
          </div>
        </div>
      );
    case "Engagement":
      return (
        <div>
          <div className="mt-12 mb-10 text-2xl font-display">Engagement</div>
          <div className="grid grid-cols-3 gap-24 justify-items-stretch h-56">
            <ProfileContentCell
              fieldKey={ProfileFieldKey.AcademicEngagementScore}
            />
            <ProfileContentCell fieldKey={ProfileFieldKey.AdvisingScore} />
            <ProfileContentCell fieldKey={ProfileFieldKey.AthleticScore} />
          </div>
        </div>
      );
    case "Academic Performance":
      return (
        <div>
          <div className="mt-12 mb-10 text-2xl font-display">
            Academic Performance
          </div>
          <div className="mb-6 text-lg font-bold">Student Bio</div>
          <ProfileContentCell fieldKey={ProfileFieldKey.GPA} />
          <ProfileContentCell fieldKey={ProfileFieldKey.DisciplinaryActions} />
        </div>
      );
    case "Physical Wellness":
      return (
        <div>
          <div className="mt-12 mb-10 text-2xl font-display">
            Physical Wellness
          </div>
          <ProfileContentCell fieldKey={ProfileFieldKey.BMI} />
          <div className="mb-6 mt-16 text-lg font-bold">Fitness Testing</div>
          <ProfileContentCell fieldKey={ProfileFieldKey.PacerTest} />
          <ProfileContentCell fieldKey={ProfileFieldKey.MileTime} />
          <ProfileContentCell fieldKey={ProfileFieldKey.Situps} />
          <ProfileContentCell fieldKey={ProfileFieldKey.Pushups} />
        </div>
      );
    case ProfileCategory.Highlights:
      return (
        <div>
          <div className="mt-12 mb-10 text-2xl font-display">Highlights</div>
          <ProfileContentCell fieldKey={ProfileFieldKey.Highlights} />
        </div>
      );
    default:
      return (
        <div className="mt-12 mb-10 text-2xl font-display">No Information</div>
      );
  }
};

interface Props {
  profile: Partial<PlayerProfile>;
}

const Profile: React.FunctionComponent<Props> = ({ profile }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState(
    ProfileCategory.Overview
  );
  return (
    <div>
      <div className="flex flex-row justify-between text-sm text-center">
        {Object.values(ProfileCategory)
          .filter((category: ProfileCategory) =>
            ProfileFieldsByCategory[category].some(
              (key: ProfileFieldKey) => profile[key]
            )
          )
          .map((category: ProfileCategory) => (
            <button
              type="button"
              className={
                selectedCategory === category
                  ? "bg-button py-3 px-8 rounded-full font-bold tracking-wide"
                  : "py-3 px-8 rounded-full text-unselected tracking-wide"
              }
              onClick={() => {
                setSelectedCategory(category);
              }}
            >
              {category}
            </button>
          ))}
      </div>
      <ProfileContext.Provider value={profile}>
        <ProfileContents category={selectedCategory} />
      </ProfileContext.Provider>
    </div>
  );
};

export default Profile;
