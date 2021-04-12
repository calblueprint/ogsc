/* eslint-disable react/destructuring-assignment */
import { Absence, ProfileFieldKey } from "@prisma/client";
import Button from "components/Button";
import Modal from "components/Modal";
import React, { useCallback, useMemo, useState } from "react";
import { IProfileField } from "interfaces/user";
import PropTypes from "prop-types";
import isAbsence from "utils/isAbsence";
import labelProfileField from "utils/labelProfileField";
import ProfileFieldEditor from "./ProfileFieldEditor";

type CreateProps = {
  fieldKey: ProfileFieldKey | "absence";
  onComplete?: (updated?: IProfileField | Absence) => void;
};

type UpdateProps = {
  field: IProfileField | Absence;
  onComplete?: (updated?: IProfileField | Absence) => void;
};

type Props = (CreateProps | UpdateProps) & {
  /**
   * Overrides the network request this component saves. Passing this makes `onComplete` a no-op.
   */
  onSave?: () => void;
  trigger?: React.ReactElement;
};

const ProfileFieldEditorModal: React.FC<Props> = ({
  onComplete,
  onSave,
  trigger,
  ...props
}: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");

  const wrappedOnComplete = useCallback(
    (updated?: IProfileField | Absence): void => {
      onComplete?.(updated);
      setModalOpen(false);
    },
    [onComplete]
  );

  const createOrUpdateField = useMemo(() => {
    if (onSave) {
      return function customCreateOrUpdate() {
        onSave();
        setModalOpen(false);
      };
    }
    if ("field" in props) {
      return async function updateField(): Promise<void> {
        try {
          const response = await fetch(
            isAbsence(props.field)
              ? `/api/absences/${props.field.id}`
              : `/api/profileFields/${props.field.id}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({}),
            }
          );
          if (!response.ok) {
            throw await response.json();
          }
          wrappedOnComplete(props.field);
        } catch (err) {
          setError(err.message);
        }
      };
    }
    return async function createField(): Promise<void> {
      try {
        const response = await fetch(
          props.fieldKey === "absence" ? "/api/absences" : "/api/profileFields",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({}),
          }
        );
        if (!response.ok) {
          throw await response.json();
        }
        wrappedOnComplete(await response.json());
      } catch (err) {
        setError(err.message);
      }
    };
  }, [wrappedOnComplete, onSave, props]);

  const intentLabel =
    "field" in props
      ? `Edit ${labelProfileField(props.field)}`
      : `Add ${labelProfileField(props.fieldKey)}`;

  return (
    <>
      {trigger ? (
        React.cloneElement(trigger, {
          onClick: () => {
            trigger.props?.onClick?.();
            setModalOpen(true);
          },
        })
      ) : (
        <Button iconType="plus" onClick={() => setModalOpen(true)}>
          {intentLabel}
        </Button>
      )}
      <Modal open={modalOpen}>
        <fieldset>
          <div className="rounded-lg">
            <div>
              <p className="text-2xl font-semibold mb-3">{intentLabel}</p>
              <hr className="pb-4" />
              {"field" in props ? (
                <ProfileFieldEditor profileField={props.field} updateExisting />
              ) : (
                <ProfileFieldEditor profileField={props.fieldKey} />
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
                onClick={() => wrappedOnComplete()}
              >
                Cancel
              </Button>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>
        </fieldset>
      </Modal>
    </>
  );
};

ProfileFieldEditorModal.propTypes = {
  onComplete: PropTypes.func,
};

ProfileFieldEditorModal.defaultProps = {
  onComplete: undefined,
  onSave: undefined,
  trigger: undefined,
};

export default ProfileFieldEditorModal;
