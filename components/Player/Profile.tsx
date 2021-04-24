import { Absence, AbsenceType, ProfileFieldKey } from "@prisma/client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Icon from "components/Icon";
import {
  IAbsence,
  IPlayer,
  IProfileField,
  ProfileCategory,
  ProfileCategoryIcons,
  ProfileFieldsByCategory,
  ProfileFieldValueDeserializedTypes,
  ProfileFieldValues,
} from "interfaces";
import { useRouter } from "next/router";
import { UpdateOneAbsenceDTO } from "pages/api/absences/update";
import { serializeProfileFieldValue } from "utils/buildUserProfile";
import isAbsence from "utils/isAbsence";
import AbsenceTable from "./AbsenceTable";
import ProfileFieldCell from "./ProfileFieldCell";
import NotesTable from "./NotesTable";
import ProfileContext, {
  ProfileContextType,
  useProfileContext,
} from "./ProfileContext";
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
            <ProfileFieldCell fieldKey={ProfileFieldKey.BioAboutMe} />
            <ProfileFieldCell fieldKey={ProfileFieldKey.BioHobbies} />
            <ProfileFieldCell fieldKey={ProfileFieldKey.BioFavoriteSubject} />
            <ProfileFieldCell
              fieldKey={ProfileFieldKey.BioMostDifficultSubject}
            />
            <ProfileFieldCell fieldKey={ProfileFieldKey.BioSiblings} />
            <ProfileFieldCell fieldKey={ProfileFieldKey.BioParents} />
          </Section>
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
        </div>
      );
    case ProfileCategory.PhysicalWellness:
      return (
        <div>
          <Section sectionName="Height">
            <ProfileFieldCell fieldKey={ProfileFieldKey.Height} />
          </Section>
          <hr className="mt-4" />
          <Section sectionName="Fitness Testing">
            <ProfileFieldCell fieldKey={ProfileFieldKey.PacerTest} />
            <ProfileFieldCell fieldKey={ProfileFieldKey.MileTime} />
            <ProfileFieldCell fieldKey={ProfileFieldKey.Situps} />
            <ProfileFieldCell fieldKey={ProfileFieldKey.Pushups} />
          </Section>
          <hr className="mt-4" />
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
          {player?.notes && (
            <NotesTable userId={player.id} defaultNotes={player.notes} />
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
  const [state, dispatch] = useProfileContext();
  const router = useRouter();

  const refreshProfile = useCallback(() => {
    router.replace(router.asPath);
  }, [router]);

  const createField: ProfileContextType["createField"] = useCallback(
    async function createField(fieldKey, draft, userId): Promise<void> {
      const serializedValue = JSON.stringify(
        fieldKey === "absence"
          ? {
              absences: [draft as Partial<Absence>],
              playerId: userId,
            }
          : {
              playerId: userId,
              fields: [
                {
                  key: fieldKey,
                  value: serializeProfileFieldValue(
                    draft as ProfileFieldValueDeserializedTypes[ProfileFieldValues[ProfileFieldKey]],
                    fieldKey
                  ),
                },
              ],
            }
      );

      const response = await fetch(
        fieldKey === "absence" ? "/api/absences" : "/api/profileFields",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: serializedValue,
        }
      );
      if (!response.ok) {
        throw await response.json();
      }
      refreshProfile();
    },
    [refreshProfile]
  );

  const updateField: ProfileContextType["updateField"] = useCallback(
    async function updateField(field: IProfileField | IAbsence): Promise<void> {
      if (!field.draft) {
        return;
      }
      const serializedValue = isAbsence(field)
        ? JSON.stringify({
            date: field.draft?.date,
            description: field.draft?.description,
            reason: field.draft?.reason,
            type: field.draft?.type,
            userId: field.draft?.userId,
          } as UpdateOneAbsenceDTO)
        : JSON.stringify({
            value: serializeProfileFieldValue(field.draft, field.key),
          });
      const response = await fetch(
        isAbsence(field)
          ? `/api/absences/${field.id}`
          : `/api/profileFields/${field.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: serializedValue,
        }
      );
      if (!response.ok) {
        throw await response.json();
      }
      refreshProfile();
    },
    [refreshProfile]
  );

  const deleteField: ProfileContextType["deleteField"] = useCallback(
    async function deleteField(
      fieldKey: ProfileFieldKey | "absence",
      id: number
    ): Promise<void> {
      const response = await fetch(
        fieldKey === "absence"
          ? `/api/absences/${id}`
          : `/api/profileFields/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw await response.json();
      }
      refreshProfile();
    },
    [refreshProfile]
  );

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
              (category === ProfileCategory.Attendance && player.absences) ||
              category === ProfileCategory.Notes
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
      <ProfileContext.Provider
        value={{ state, dispatch, createField, updateField, deleteField }}
      >
        <h1 className="mb-10 text-2xl font-semibold">{selectedCategory}</h1>
        <hr />
        <ProfileContents category={selectedCategory} />
      </ProfileContext.Provider>
    </div>
  );
};

export default Profile;
