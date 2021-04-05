import { AbsenceType, ProfileFieldKey } from "@prisma/client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Icon from "components/Icon";
import {
  IPlayer,
  ProfileCategory,
  ProfileCategoryIcons,
  ProfileFieldsByCategory,
} from "interfaces";
import { useRouter } from "next/router";
import AbsenceTable from "./AbsenceTable";
import ProfileFieldCell from "./ProfileFieldCell";
import ProfileContext, { useProfileContext } from "./ProfileContext";
import ProfileSection from "./ProfileSection";

type ProfileContentsProps<T extends ProfileCategory> = {
  category: T;
};

const ProfileContents = <T extends ProfileCategory>({
  category,
}: ProfileContentsProps<T>): JSX.Element => {
  const {
    state: { player },
  } = useContext(ProfileContext);

  switch (category) {
    case ProfileCategory.Overview:
      return (
        <div>
          <h1 className="mb-10 text-2xl font-semibold">Student Overview</h1>
          <hr />
          <ProfileSection sectionName="Student Bio">
            <ProfileFieldCell fieldKey={ProfileFieldKey.BioAboutMe} />
            <ProfileFieldCell fieldKey={ProfileFieldKey.BioHobbies} />
            <ProfileFieldCell fieldKey={ProfileFieldKey.BioFavoriteSubject} />
            <ProfileFieldCell
              fieldKey={ProfileFieldKey.BioMostDifficultSubject}
            />
            <ProfileFieldCell fieldKey={ProfileFieldKey.BioSiblings} />
            <ProfileFieldCell fieldKey={ProfileFieldKey.BioParents} />
            <ProfileFieldCell fieldKey={ProfileFieldKey.IntroVideo} />
          </ProfileSection>
        </div>
      );
    case ProfileCategory.Engagement:
      return (
        <div>
          <h1 className="mb-10 text-2xl font-semibold">Engagement</h1>
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
          <h1 className="mb-10 text-2xl font-semibold">Academic Performance</h1>
          <ProfileFieldCell fieldKey={ProfileFieldKey.GPA} />
          <ProfileFieldCell fieldKey={ProfileFieldKey.DisciplinaryActions} />
        </div>
      );
    case ProfileCategory.PhysicalWellness:
      return (
        <div>
          <h1 className="mb-10 text-2xl font-semibold">Physical Wellness</h1>
          <hr className="mb-10" />
          <ProfileSection sectionName="Height">
            <ProfileFieldCell fieldKey={ProfileFieldKey.Height} />
          </ProfileSection>
          <hr className="mt-4" />
          <ProfileSection sectionName="Fitness Testing">
            <ProfileFieldCell fieldKey={ProfileFieldKey.PacerTest} />
            <ProfileFieldCell fieldKey={ProfileFieldKey.MileTime} />
            <ProfileFieldCell fieldKey={ProfileFieldKey.Situps} />
            <ProfileFieldCell fieldKey={ProfileFieldKey.Pushups} />
          </ProfileSection>
          <ProfileSection sectionName="Health & Wellness">
            <ProfileFieldCell fieldKey={ProfileFieldKey.HealthAndWellness} />
          </ProfileSection>
        </div>
      );
    case ProfileCategory.Attendance:
      return (
        <div>
          <h1 className="mb-10 text-2xl font-semibold">Attendance</h1>
          {player?.absences &&
            Object.values(AbsenceType).map(
              (type: AbsenceType) =>
                player.absences && (
                  <AbsenceTable
                    key={type}
                    absenceType={type}
                    absences={player.absences}
                    userId={player.id}
                  />
                )
            )}
        </div>
      );
    case ProfileCategory.Highlights:
      return (
        <div>
          <ProfileSection sectionName="Highlights">
            <ProfileFieldCell fieldKey={ProfileFieldKey.Highlights} />
          </ProfileSection>
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
  const [state, dispatch] = useProfileContext();
  const router = useRouter();

  const refreshProfile = useCallback(() => {
    router.replace(router.asPath);
  }, [router]);

  useEffect(() => {
    dispatch({ type: "SET_PLAYER", player });
  }, [player, dispatch]);

  return (
    <div>
      <div className="flex flex-row text-sm text-center">
        {Object.values(ProfileCategory)
          .filter(
            (category: ProfileCategory) =>
              ProfileFieldsByCategory[category].some(
                (key: ProfileFieldKey) => player.profile?.[key]
              ) ||
              (category === ProfileCategory.Attendance && player.absences)
          )
          .map((category: ProfileCategory) => (
            <button
              key={category}
              type="button"
              className={`navigation-tab mr-8 ${
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
      <ProfileContext.Provider value={{ state, dispatch, refreshProfile }}>
        <ProfileContents category={selectedCategory} />
      </ProfileContext.Provider>
    </div>
  );
};

export default Profile;
