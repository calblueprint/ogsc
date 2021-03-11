import { ProfileFieldKey, UserRoleType } from "@prisma/client";
import {
  ProfileFieldLabels,
  ProfileFieldValue,
  ProfileFieldValues,
} from "interfaces/user";
import ProfileAccessDefinitionsByRole from "lib/access/definitions";
import resolveAccessValue from "lib/access/resolve";
import React, { useContext } from "react";
import useSessionInfo from "utils/useSessionInfo";
import ProfileContext, { ProfileSectionContext } from "./ProfileContext";
import TextLayout from "./TextLayout";
import ValueHistoryView from "./ValueHistoryView";

export type ProfileFieldCellProps = {
  fieldKey: ProfileFieldKey;
};

const ProfileFieldCell: React.FC<ProfileFieldCellProps> = ({
  fieldKey,
}: ProfileFieldCellProps) => {
  const { user } = useSessionInfo();
  const {
    defaultRole: { type: currentUserType },
  } = user;
  const accessValue =
    currentUserType === UserRoleType.Admin ||
    ProfileAccessDefinitionsByRole[currentUserType][fieldKey];
  const {
    state: { player, editingState },
    dispatch,
  } = useContext(ProfileContext);
  const section = useContext(ProfileSectionContext);

  const profileField = player?.profile?.[fieldKey];
  if (
    !profileField ||
    !profileField.current ||
    !profileField.lastUpdated ||
    !player
  ) {
    return null;
  }

  const canRead =
    accessValue && resolveAccessValue(accessValue, "read", player, user);
  const canEdit =
    accessValue && resolveAccessValue(accessValue, "write", player, user);
  const editing = editingState.sections[section]?.editing && canEdit;

  const contentOrEditor = editing ? (
    <input
      type="text"
      className="input"
      name={profileField.key}
      defaultValue={profileField.current}
      value={profileField.draft}
      onChange={(event) =>
        dispatch({
          type: "EDIT_FIELD",
          key: profileField.key,
          value: event.target.value,
        })
      }
    />
  ) : (
    profileField.current
  );

  if (!canRead) {
    return null;
  }

  switch (profileField.key) {
    case ProfileFieldKey.AcademicEngagementScore:
      return (
        <ValueHistoryView
          icon="school"
          primaryColor="pink"
          fieldLabel={ProfileFieldLabels.AcademicEngagementScore}
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
          fieldLabel={ProfileFieldLabels.AdvisingScore}
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
          fieldLabel={ProfileFieldLabels.AthleticScore}
          shortFieldLabel="Engagement"
          values={profileField.history}
          valueLabel="point"
        />
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
          fieldLabel={ProfileFieldLabels.GPA}
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
      switch (ProfileFieldValues[profileField.key]) {
        case ProfileFieldValue.Text:
        default:
          return (
            <TextLayout
              title={
                fieldKey in ProfileFieldLabels
                  ? ProfileFieldLabels[
                      fieldKey as keyof typeof ProfileFieldLabels
                    ]
                  : fieldKey
              }
            >
              {contentOrEditor}
            </TextLayout>
          );
      }
  }
};
export default ProfileFieldCell;
