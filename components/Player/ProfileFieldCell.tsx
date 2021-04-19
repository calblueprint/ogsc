import { ProfileFieldKey, UserRoleType } from "@prisma/client";
import {
  IProfileFieldBuilt,
  ProfileFieldKeysOfProfileValueType,
  ProfileFieldLabels,
  ProfileFieldValue,
  ProfileFieldValueDeserializedTypes,
  ProfileFieldValues,
} from "interfaces/user";
import { ProfileAccessDefinitionsByRole } from "lib/access/definitions";
import resolveAccessValue from "lib/access/resolve";
import React, { useContext } from "react";
import { deserializeProfileFieldValue } from "utils/buildUserProfile";
import labelProfileField from "utils/labelProfileField";
import sortTimeSeriesFields from "utils/sortTimeSeriesFields";
import useSessionInfo from "utils/useSessionInfo";
import ProfileContext, { ProfileSectionContext } from "./ProfileContext";
import ProfileFieldEditor from "./ProfileFieldEditor";
import TestResultHistoryTable from "./TestResultHistoryTable";
import TextLayout from "./TextLayout";
import ValueHistorySummary from "./ValueHistorySummary";
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
  if (!profileField || !player) {
    return null;
  }

  const deserializedValue = deserializeProfileFieldValue(profileField.current);
  const canRead =
    accessValue && resolveAccessValue(accessValue, "read", player, user);
  const canEdit =
    accessValue && resolveAccessValue(accessValue, "write", player, user);
  const editing =
    (editingState.sections[section]?.editing ||
      editingState.allEditingOverride) &&
    canEdit;

  const contentOrEditor = editing ? (
    <ProfileFieldEditor profileField={profileField} />
  ) : (
    deserializedValue
  );

  if (!editing && (!canRead || deserializedValue === null)) {
    return null;
  }

  if (!editing) {
    switch (profileField.key) {
      case ProfileFieldKey.AcademicEngagementScore:
        return (
          <ValueHistoryView
            icon="school"
            primaryColor="pink"
            fieldKey={ProfileFieldKey.AcademicEngagementScore}
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
            fieldKey={ProfileFieldKey.AdvisingScore}
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
            fieldKey={ProfileFieldKey.AthleticScore}
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
            fieldKey={ProfileFieldKey.GPA}
            shortFieldLabel="GPA"
            values={profileField.history}
            valueRange={[2, 4]}
          />
        );
      case ProfileFieldKey.InternalAssessments:
        return (
          <ValueHistoryView
            icon="book"
            primaryColor="pink"
            fieldKey={ProfileFieldKey.InternalAssessments}
            shortFieldLabel="Internal Assessment"
            values={profileField.history}
            valueRange={[0, 5]}
          />
        );
      default:
    }
  }

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
    case ProfileFieldValue.StandardizedTestResult: {
      type StandardizedTestResultKeys = ProfileFieldKeysOfProfileValueType<ProfileFieldValue.StandardizedTestResult>;
      const field = profileField as IProfileFieldBuilt<StandardizedTestResultKeys>;
      if (editing) {
        return <ProfileFieldEditor profileField={field} />;
      }

      const [mostRecentField] = field.history.sort(sortTimeSeriesFields);
      const mostRecentValue = deserializeProfileFieldValue(mostRecentField);

      return (
        <div className="mb-10">
          <h2 className="text-dark text-lg font-semibold my-5">
            {labelProfileField(field.key)}
          </h2>
          <ValueHistorySummary
            icon="academics"
            color="gold"
            displayedValue={mostRecentValue?.value ?? 0}
            maxValue={100}
          >
            Most recent test -{" "}
            {mostRecentValue?.date.format("MMM DD, YYYY") ?? "N/A"}
          </ValueHistorySummary>
          <TestResultHistoryTable fieldKey={field.key} values={field.history} />
        </div>
      );
    }
    case ProfileFieldValue.Text:
    default:
      return <TextLayout title={title}>{contentOrEditor}</TextLayout>;
  }
};
export default ProfileFieldCell;
