/* eslint-disable react/destructuring-assignment */
import { Absence, ProfileFieldKey } from "@prisma/client";
import Button from "components/Button";
import Modal from "components/Modal";
import dayjs from "lib/day";
import toast from "lib/toast";
import React, { useCallback, useContext, useState } from "react";
import {
  IProfileField,
  ProfileFieldKeysOfProfileValueType,
  ProfileFieldValueDeserializedTypes,
  ProfileFieldValues,
  TimeSeriesProfileFieldValues,
} from "interfaces/user";
import PropTypes from "prop-types";
import {
  deserializeProfileFieldValue,
  serializeProfileFieldValue,
} from "utils/buildUserProfile";
import labelProfileField from "utils/labelProfileField";
import isAbsence from "utils/isAbsence";
import useCanEditField from "utils/useCanEditField";
import validateProfileField from "utils/validateProfileField";
import ProfileFieldEditor from "./ProfileFieldEditor";
import ProfileContext from "./ProfileContext";

type CreateProps = {
  fieldKey: ProfileFieldKey | "absence";
  onComplete?: (updated?: IProfileField | Absence) => void;
};

type UpdateProps = {
  field: IProfileField | Absence;
  onComplete?: (updated?: IProfileField | Absence) => void;
};

type Props = (CreateProps | UpdateProps) & {
  trigger?: React.ReactElement;
  shouldToastOnSuccess?: boolean;
};

export const StandaloneProfileFieldEditor: React.FC<
  CreateProps | UpdateProps
> = ({ onComplete, ...props }: CreateProps | UpdateProps) => {
  const { createField, updateField, state, dispatch } = useContext(
    ProfileContext
  );
  const [error, setError] = useState("");
  const createOrUpdateField = useCallback(async () => {
    if ("field" in props) {
      if (!isAbsence(props.field)) {
        const validationResult = validateProfileField(props.field);
        if (validationResult.error) {
          dispatch({
            type: "ADD_FIELD_VALIDATION_ERROR",
            key: props.field.key,
            id: props.field.id,
            error: validationResult.error.message,
          });
          return;
        }
      }
      try {
        await updateField(props.field);
        onComplete?.(props.field);
      } catch (err) {
        setError(err.message);
      }
    } else {
      try {
        if (state.player == null || state.player.profile == null) {
          throw new Error("No player loaded in context");
        }
        const draft =
          props.fieldKey === "absence"
            ? state.player.absenceDraft
            : state.player.profile[props.fieldKey]?.draft;

        if (props.fieldKey !== "absence") {
          if (!draft) {
            dispatch({
              type: "ADD_FIELD_VALIDATION_ERROR",
              key: props.fieldKey,
              error: `${labelProfileField(
                props.fieldKey
              )} value is required, but none was entered`,
            });
          }
          const validationResult = validateProfileField(
            draft as ProfileFieldValueDeserializedTypes[ProfileFieldValues[ProfileFieldKey]],
            props.fieldKey
          );
          if (validationResult.error) {
            dispatch({
              type: "ADD_FIELD_VALIDATION_ERROR",
              key: props.fieldKey,
              error: validationResult.error.message,
            });
            return;
          }
        }
        if (!draft) {
          return;
        }
        await createField(props.fieldKey, draft, state.player.id);
        onComplete?.(
          props.fieldKey === "absence"
            ? (draft as Absence)
            : {
                createdAt: new Date(),
                id: 0,
                userId: state.player.id,
                key: props.fieldKey,
                value: serializeProfileFieldValue(
                  draft as ProfileFieldValueDeserializedTypes[ProfileFieldValues[ProfileFieldKey]],
                  props.fieldKey
                ),
              }
        );
      } catch (err) {
        setError(err.message);
      }
    }
  }, [onComplete, createField, updateField, dispatch, state.player, props]);

  const intentLabel =
    "field" in props
      ? `Edit ${labelProfileField(props.field)}`
      : `Add ${labelProfileField(props.fieldKey)}`;

  return (
    <fieldset>
      <div className="rounded-lg">
        <div>
          <p className="text-2xl font-semibold mb-3">{intentLabel}</p>
          <hr className="pb-4" />
          {"field" in props ? (
            <ProfileFieldEditor profileField={props.field} updateExisting />
          ) : (
            <ProfileFieldEditor
              profileField={props.fieldKey as ProfileFieldKey}
            />
          )}
        </div>
        <div className="flex flex-row gap-6 mt-10">
          <Button
            iconType="plus"
            className="py-2 px-5 text-sm"
            onClick={createOrUpdateField}
          >
            Save
          </Button>
          <Button
            className="border border-blue bg-white py-2 px-12 text-sm border-opacity-100"
            onClick={() => {
              if ("field" in props && !isAbsence(props.field)) {
                dispatch({
                  type: "CLEAR_FIELD_DRAFT",
                  key: props.field.key,
                  id: props.field.id,
                });
              } else if ("fieldKey" in props && props.fieldKey !== "absence") {
                dispatch({
                  type: "CLEAR_FIELD_DRAFT",
                  key: props.fieldKey,
                });
              }

              onComplete?.();
            }}
          >
            Cancel
          </Button>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>
    </fieldset>
  );
};

const ProfileFieldEditorModal: React.FC<Props> = ({
  onComplete,
  trigger,
  shouldToastOnSuccess,
  ...props
}: Props) => {
  const { state } = useContext(ProfileContext);
  const [modalOpen, setModalOpen] = useState(false);
  const wrappedOnComplete = useCallback(
    (updated?: IProfileField | Absence): void => {
      if (updated && shouldToastOnSuccess) {
        toast.success(
          `${labelProfileField(updated)} for ${dayjs(
            isAbsence(updated)
              ? updated.date
              : deserializeProfileFieldValue(
                  updated as IProfileField<
                    ProfileFieldKeysOfProfileValueType<TimeSeriesProfileFieldValues>
                  >
                )?.date
          ).format("MMMM YYYY")} has been created!`
        );
      }
      onComplete?.(updated);
      setModalOpen(false);
    },
    [onComplete, shouldToastOnSuccess]
  );
  const canEdit = useCanEditField(
    (() => {
      if ("field" in props) {
        if (isAbsence(props.field)) {
          return "absence";
        }
        return props.field.key;
      }
      return props.fieldKey;
    })(),
    "field" in props && isAbsence(props.field) ? props.field.type : undefined
  );
  const intentLabel =
    "field" in props
      ? `Edit ${labelProfileField(props.field)}`
      : `Add ${labelProfileField(props.fieldKey)}`;

  if (!state.player || !canEdit) {
    return null;
  }

  return (
    <>
      {trigger ? (
        React.cloneElement(trigger, {
          ...props,
          onClick: (...args: unknown[]) => {
            trigger.props?.onClick?.(...args);
            setModalOpen(true);
          },
        })
      ) : (
        <Button iconType="plus" onClick={() => setModalOpen(true)}>
          {intentLabel}
        </Button>
      )}
      <Modal
        open={modalOpen}
        className="w-1/2"
        onClose={() => setModalOpen(false)}
      >
        <StandaloneProfileFieldEditor
          onComplete={wrappedOnComplete}
          {...props}
        />
      </Modal>
    </>
  );
};

ProfileFieldEditorModal.propTypes = {
  onComplete: PropTypes.func,
};

ProfileFieldEditorModal.defaultProps = {
  onComplete: undefined,
  trigger: undefined,
  shouldToastOnSuccess: false,
};

export default ProfileFieldEditorModal;
