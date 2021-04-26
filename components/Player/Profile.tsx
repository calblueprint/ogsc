import { AbsenceType, ProfileFieldKey } from "@prisma/client";
import React, { useContext, useState } from "react";
import Icon from "components/Icon";
import {
  IPlayer,
  ProfileCategory,
  ProfileCategoryIcons,
  ProfileFieldsByCategory,
} from "interfaces";
import AbsenceTable from "./AbsenceTable";
import ProfileFieldCell from "./ProfileFieldCell";
import { NotesTable } from "./NotesTable";
import ProfileContext from "./ProfileContext";
import ProfileSection, { Props as ProfileSectionProps } from "./ProfileSection";

type ProfileContentsProps<T extends ProfileCategory> = {
  category: T;
  // How do we do this with a FC that has a generic?
  // eslint-disable-next-line react/require-default-props
  renderSection?: (props: ProfileSectionProps) => JSX.Element;
};

export const ProfileContents = <T extends ProfileCategory>({
  category,
  renderSection,
}: ProfileContentsProps<T>): JSX.Element => {
  const {
    state: { player },
  } = useContext(ProfileContext);

  const Section = renderSection ?? ProfileSection;

  switch (category) {
    case ProfileCategory.Overview:
      return (
        <div>
          <Section sectionName="Student Bio">
            {/* <ProfileFieldCell fieldKey={ProfileFieldKey.ProfilePicture} /> */}
            <ProfileFieldCell fieldKey={ProfileFieldKey.BioAboutMe} />
            <ProfileFieldCell fieldKey={ProfileFieldKey.BioHobbies} />
            <ProfileFieldCell fieldKey={ProfileFieldKey.BioFavoriteSubject} />
            <ProfileFieldCell
              fieldKey={ProfileFieldKey.BioMostDifficultSubject}
            />
            <ProfileFieldCell fieldKey={ProfileFieldKey.BioSiblings} />
            <ProfileFieldCell fieldKey={ProfileFieldKey.BioParents} />
          </Section>
          <hr className="my-2 mb-6" />
          <Section sectionName="Intro Video">
            <ProfileFieldCell fieldKey={ProfileFieldKey.IntroVideo} />
          </Section>
        </div>
      );
    case ProfileCategory.Engagement:
      return (
        <div>
          <ProfileFieldCell
            fieldKey={ProfileFieldKey.AcademicEngagementScore}
          />
          <ProfileFieldCell fieldKey={ProfileFieldKey.AdvisingScore} />
          <ProfileFieldCell fieldKey={ProfileFieldKey.AthleticScore} />
        </div>
      );
    case ProfileCategory.AcademicPerformance:
      return (
        <div>
          <ProfileFieldCell fieldKey={ProfileFieldKey.GPA} />
          <ProfileFieldCell fieldKey={ProfileFieldKey.DisciplinaryActions} />
          <ProfileFieldCell fieldKey={ProfileFieldKey.InternalAssessments} />
          <ProfileFieldCell fieldKey={ProfileFieldKey.StandardizedTesting} />
        </div>
      );
    case ProfileCategory.PhysicalWellness:
      return (
        <div>
          <Section sectionName="Height">
            <ProfileFieldCell fieldKey={ProfileFieldKey.Height} />
          </Section>
          <hr className="my-2 mb-6" />
          <Section sectionName="Fitness Testing">
            <ProfileFieldCell fieldKey={ProfileFieldKey.PacerTest} />
            <ProfileFieldCell fieldKey={ProfileFieldKey.MileTime} />
            <ProfileFieldCell fieldKey={ProfileFieldKey.Situps} />
            <ProfileFieldCell fieldKey={ProfileFieldKey.Pushups} />
          </Section>
          <hr className="my-2 mb-6" />
          <Section sectionName="Health & Wellness">
            <ProfileFieldCell fieldKey={ProfileFieldKey.HealthAndWellness} />
          </Section>
        </div>
      );
    case ProfileCategory.Attendance:
      return (
        <div>
          {Object.values(AbsenceType).map((type: AbsenceType) => (
            <AbsenceTable
              key={type}
              absenceType={type}
              absences={player?.absences || []}
            />
          ))}
        </div>
      );
    case ProfileCategory.Highlights:
      return (
        <div>
          <Section sectionName="Highlights">
            <ProfileFieldCell fieldKey={ProfileFieldKey.Highlights} />
          </Section>
        </div>
      );
    case ProfileCategory.Notes:
      return (
        <div>
          {player?.playerNotes && (
            <NotesTable userId={player.id} playerNotes={player.playerNotes} />
          )}
        </div>
      );

    default:
      return (
        <div className="mt-12 mb-10 text-2xl font-semibold">No Information</div>
      );
  }
};

interface Props {
  player: IPlayer;
}

const Profile: React.FunctionComponent<Props> = ({ player }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState(
    ProfileCategory.Overview
  );

  return (
    <div className="pb-24">
      <div className="flex flex-row flex-wrap text-sm text-center">
        {Object.values(ProfileCategory)
          .filter(
            (category: ProfileCategory) =>
              ProfileFieldsByCategory[category].some(
                (key: ProfileFieldKey) => player.profile?.[key]
              ) ||
              (category === ProfileCategory.Attendance && player.absences) ||
              (category === ProfileCategory.Notes && player.playerNotes)
          )
          .map((category: ProfileCategory) => (
            <button
              key={category}
              type="button"
              className={`navigation-tab mr-6 ${
                selectedCategory === category
                  ? "navigation-tab-highlighted"
                  : ""
              }`}
              onClick={() => {
                setSelectedCategory(category);
              }}
            >
              <Icon
                className="w-4 h-4 mr-5 fill-current stroke-current"
                type={ProfileCategoryIcons[category]}
              />
              {category}
            </button>
          ))}
      </div>
      <hr className="my-10" />
      <h1 className="mb-10 text-2xl font-semibold">{selectedCategory}</h1>
      <hr />
      <ProfileContents category={selectedCategory} />
    </div>
  );
};

export default Profile;
