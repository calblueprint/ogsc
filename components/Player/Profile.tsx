import React, { useContext, useState } from "react";
import Icon, { IconType } from "components/Icon";
import { AbsenceType, IPlayer, ProfileFieldKey } from "interfaces";
import updateActionPlayer from "utils/updateActionPlayer";
import { useStateMachine } from "little-state-machine";
import TextLayout from "./TextLayout";
import AbsenceTable from "./AbsenceTable";
import ValueHistoryView from "./ValueHistoryView";
import EditLayout from "./EditLayout";
import BioEdit from "./BioEdit";

enum ProfileCategory {
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
    ProfileFieldKey.BMI,
    ProfileFieldKey.PacerTest,
    ProfileFieldKey.MileTime,
    ProfileFieldKey.Situps,
    ProfileFieldKey.Pushups,
    ProfileFieldKey.HealthAndWellness,
  ],
  [ProfileCategory.Highlights]: [ProfileFieldKey.Highlights],
};

export const ProfileFieldLabels: Partial<Record<ProfileFieldKey, string>> = {
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
};

const PlayerContext = React.createContext<IPlayer | null>(null);

type ProfileContentCellProps = {
  fieldKey: ProfileFieldKey;
};

const ProfileContentCell: React.FC<ProfileContentCellProps> = ({
  fieldKey,
}: ProfileContentCellProps) => {
  const player = useContext(PlayerContext);
  const profileField = player?.profile?.[fieldKey];
  if (!profileField || !profileField.current || !profileField.lastUpdated) {
    return null;
  }
  switch (profileField.key) {
    case ProfileFieldKey.AcademicEngagementScore:
      return (
        <ValueHistoryView
          icon="school"
          primaryColor="pink"
          fieldLabel={
            ProfileFieldLabels.AcademicEngagementScore || "Engagement"
          }
          shortFieldLabel="Engagement"
          values={profileField.history}
          valueLabel="point"
        />
      );
    case ProfileFieldKey.AdvisingScore:
      return (
        <ValueHistoryView
          icon="academics"
          primaryColor="gold"
          fieldLabel={ProfileFieldLabels.AdvisingScore || "Engagement"}
          shortFieldLabel="Engagement"
          values={profileField.history}
          valueLabel="point"
        />
      );
    case ProfileFieldKey.AthleticScore:
      return (
        <ValueHistoryView
          icon="athletics"
          primaryColor="purple"
          fieldLabel={ProfileFieldLabels.AthleticScore || "Engagement"}
          shortFieldLabel="Engagement"
          values={profileField.history}
          valueLabel="point"
        />
      );

    case ProfileFieldKey.BMI:
      return (
        <>
          <TextLayout title="BMI">{profileField.current}</TextLayout>
        </>
      );
    case ProfileFieldKey.DisciplinaryActions:
      return (
        <>
          <div className="mb-6 mt-16 text-lg font-semibold">
            Disciplinary Actions
          </div>
          <TextLayout title={null}>{profileField.current}</TextLayout>
        </>
      );
    case ProfileFieldKey.GPA:
      return (
        <ValueHistoryView
          icon="book"
          primaryColor="blue"
          fieldLabel={ProfileFieldLabels.GPA || "GPA"}
          shortFieldLabel="GPA"
          values={profileField.history}
          valueRange={[2, 4]}
        />
      );
    case ProfileFieldKey.HealthAndWellness:
      return (
        <>
          <div className="mb-6 mt-16 text-lg font-semibold">
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
  const player = useContext(PlayerContext);
  const [BioEditState, setBioEditState] = useState(false);
  const [schoolScoreState, setSchoolScoreState] = useState(false);
  const [bmiState, setBMIState] = useState(false);
  const { action } = useStateMachine(updateActionPlayer);

  switch (category) {
    case ProfileCategory.Overview:
      return (
        <div>
          <h1 className="mb-10 text-2xl font-semibold">Student Overview</h1>
          <hr />
          <div className="mt-10 grid grid-cols-3">
            <div className="flex flex-row">
              <div className="mb-6 text-lg font-semibold pr-6">Student Bio</div>
              <button
                type="button"
                onClick={() => setBioEditState(true)}
                className="h-6"
              >
                <Icon type="edit" />
              </button>
            </div>
            <div className="col-span-2">
              {BioEditState ? (
                <div>
                  <BioEdit editState={setBioEditState} playerID={player?.id}>
                    <EditLayout
                      title={ProfileFieldLabels[ProfileFieldKey.BioAboutMe]}
                      currentText={player?.profile?.BioAboutMe?.current}
                      setState={(input) => action({ BioAboutMe: input })}
                    />
                    <EditLayout
                      title={ProfileFieldLabels[ProfileFieldKey.BioHobbies]}
                      currentText={player?.profile?.BioHobbies?.current}
                      setState={(input) => action({ BioHobbies: input })}
                    />
                    <EditLayout
                      title={
                        ProfileFieldLabels[ProfileFieldKey.BioFavoriteSubject]
                      }
                      currentText={player?.profile?.BioFavoriteSubject?.current}
                      setState={(input) =>
                        action({ BioFavoriteSubject: input })
                      }
                    />
                    <EditLayout
                      title={
                        ProfileFieldLabels[
                          ProfileFieldKey.BioMostDifficultSubject
                        ]
                      }
                      currentText={
                        player?.profile?.BioMostDifficultSubject?.current
                      }
                      setState={(input) =>
                        action({ BioMostDifficultSubject: input })
                      }
                    />
                    <EditLayout
                      title={ProfileFieldLabels[ProfileFieldKey.BioSiblings]}
                      currentText={player?.profile?.BioSiblings?.current}
                      setState={(input) => action({ BioSiblings: input })}
                    />
                    <EditLayout
                      title={ProfileFieldLabels[ProfileFieldKey.BioParents]}
                      currentText={player?.profile?.BioParents?.current}
                      setState={(input) => action({ BioParents: input })}
                    />
                  </BioEdit>
                </div>
              ) : (
                <div>
                  <ProfileContentCell fieldKey={ProfileFieldKey.BioAboutMe} />
                  <ProfileContentCell fieldKey={ProfileFieldKey.BioHobbies} />
                  <ProfileContentCell
                    fieldKey={ProfileFieldKey.BioFavoriteSubject}
                  />
                  <ProfileContentCell
                    fieldKey={ProfileFieldKey.BioMostDifficultSubject}
                  />
                  <ProfileContentCell fieldKey={ProfileFieldKey.BioSiblings} />
                  <ProfileContentCell fieldKey={ProfileFieldKey.BioParents} />
                  <ProfileContentCell fieldKey={ProfileFieldKey.IntroVideo} />
                </div>
              )}
            </div>
          </div>
        </div>
      );
    case ProfileCategory.Engagement:
      return (
        <div>
          <h1 className="mb-10 text-2xl font-semibold">Engagement</h1>
          <div className="mb-16">
            <ProfileContentCell
              fieldKey={ProfileFieldKey.AcademicEngagementScore}
            />
          </div>
          <div className="mb-16">
            <ProfileContentCell fieldKey={ProfileFieldKey.AdvisingScore} />
          </div>
          <div className="mb-16">
            <ProfileContentCell fieldKey={ProfileFieldKey.AthleticScore} />
          </div>
        </div>
      );
    case ProfileCategory.AcademicPerformance:
      return (
        <div>
          <h1 className="mb-10 text-2xl font-semibold">Academic Performance</h1>
          <ProfileContentCell fieldKey={ProfileFieldKey.GPA} />
          <ProfileContentCell fieldKey={ProfileFieldKey.DisciplinaryActions} />
        </div>
      );
    case ProfileCategory.PhysicalWellness:
      return (
        <div>
          <h1 className="mb-10 text-2xl font-semibold">Physical Wellness</h1>
          <hr className="mb-10" />
          <div className="grid grid-cols-3">
            <div className="mb-6 text-lg font-semibold">
              Body Mass Index
              <button
                type="button"
                onClick={() => setBMIState(true)}
                className="pl-4"
              >
                <Icon type="edit" />
              </button>
            </div>
            <div className="col-span-2">
              {bmiState ? (
                <BioEdit editState={setBMIState} playerID={player?.id}>
                  <EditLayout
                    title={ProfileFieldKey.BMI}
                    currentText={player?.profile?.BMI?.current?.toString()}
                    setState={(input) => action({ BMI: input })}
                  />
                </BioEdit>
              ) : (
                <ProfileContentCell fieldKey={ProfileFieldKey.BMI} />
              )}
            </div>
          </div>
          <hr className="mt-4" />
          <div className="mt-16 grid grid-cols-3">
            <div className="mb-6 text-lg font-semibold">
              Fitness Testing
              <button
                type="button"
                onClick={() => setSchoolScoreState(true)}
                className="pl-4"
              >
                <Icon type="edit" />
              </button>
            </div>
            <div className="col-span-2">
              {schoolScoreState ? (
                <BioEdit editState={setSchoolScoreState} playerID={player?.id}>
                  <EditLayout
                    title={ProfileFieldLabels[ProfileFieldKey.PacerTest]}
                    currentText={player?.profile?.PacerTest?.current?.toString()}
                    setState={(input) => action({ PacerTest: input })}
                  />
                  <EditLayout
                    title={ProfileFieldLabels[ProfileFieldKey.MileTime]}
                    currentText={player?.profile?.MileTime?.current}
                    setState={(input) => action({ MileTime: input })}
                  />
                  <EditLayout
                    title={ProfileFieldLabels[ProfileFieldKey.Situps]}
                    currentText={player?.profile?.Situps?.current?.toString()}
                    setState={(input) => action({ Situps: input })}
                  />
                  <EditLayout
                    title={ProfileFieldLabels[ProfileFieldKey.Pushups]}
                    currentText={player?.profile?.Pushups?.current?.toString()}
                    setState={(input) => action({ Pushups: input })}
                  />
                </BioEdit>
              ) : (
                <div>
                  <ProfileContentCell fieldKey={ProfileFieldKey.PacerTest} />
                  <ProfileContentCell fieldKey={ProfileFieldKey.MileTime} />
                  <ProfileContentCell fieldKey={ProfileFieldKey.Situps} />
                  <ProfileContentCell fieldKey={ProfileFieldKey.Pushups} />
                </div>
              )}
            </div>
          </div>
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
                  />
                )
            )}
        </div>
      );
    case ProfileCategory.Highlights:
      return (
        <div>
          <h1 className="mb-10 text-2xl font-semibold">Highlights</h1>
          <ProfileContentCell fieldKey={ProfileFieldKey.Highlights} />
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
      <PlayerContext.Provider value={player}>
        <ProfileContents category={selectedCategory} />
      </PlayerContext.Provider>
    </div>
  );
};

export default Profile;
