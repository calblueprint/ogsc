import { ProfileFieldKey, UserRoleType } from "@prisma/client";
import {
  ProfileFieldLabels,
  ProfileFieldValue,
  ProfileFieldValueDeserializedTypes,
  ProfileFieldValues,
} from "interfaces/user";
import ProfileAccessDefinitionsByRole from "lib/access/definitions";
import resolveAccessValue from "lib/access/resolve";
import React, { useContext } from "react";
import { deserializeProfileFieldValue } from "utils/buildUserProfile";
import useSessionInfo from "utils/useSessionInfo";
import ProfileContext, { ProfileSectionContext } from "./ProfileContext";
import ProfileFieldEditor from "./ProfileFieldEditor";
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

  const deserializedValue = deserializeProfileFieldValue(profileField.current);
  const canRead =
    accessValue && resolveAccessValue(accessValue, "read", player, user);
  const canEdit =
    accessValue && resolveAccessValue(accessValue, "write", player, user);
  const editing = editingState.sections[section]?.editing && canEdit;

  const contentOrEditor = editing ? (
    <ProfileFieldEditor profileField={profileField} />
  ) : (
    deserializedValue
  );

  if (!canRead || deserializedValue === null) {
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
    default: {
      const title =
        fieldKey in ProfileFieldLabels
          ? ProfileFieldLabels[fieldKey as keyof typeof ProfileFieldLabels]
          : fieldKey;
      const valueType = ProfileFieldValues[profileField.key];

      switch (valueType) {
        case ProfileFieldValue.TimeElapsed: {
          const value = deserializedValue as ProfileFieldValueDeserializedTypes[typeof valueType];

          return (
            <TextLayout title={title}>
              {editing ? (
                <ProfileFieldEditor profileField={profileField} />
              ) : (
                `${value.minutes()} minutes ${value.seconds()} seconds`
              )}
            </TextLayout>
          );
        }
        case ProfileFieldValue.DistanceMeasured: {
          const value = deserializedValue as ProfileFieldValueDeserializedTypes[typeof valueType];

          return (
            <TextLayout title={title}>
              {editing ? (
                <ProfileFieldEditor profileField={profileField} />
              ) : (
                `${value.feet} ft. ${value.inches} in.`
              )}
            </TextLayout>
          );
        }
        case ProfileFieldValue.Text:
        default:
          return <TextLayout title={title}>{contentOrEditor}</TextLayout>;
      }
    }
  }
};
export default ProfileFieldCell;
