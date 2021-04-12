/* eslint-disable react/destructuring-assignment */
import { Absence, ProfileFieldKey } from "@prisma/client";
import Button from "components/Button";
import Modal from "components/Modal";
import React, { useCallback, useContext, useState } from "react";
import { IProfileField } from "interfaces/user";
import PropTypes from "prop-types";
import labelProfileField from "utils/labelProfileField";
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
};

const ProfileFieldEditorModal: React.FC<Props> = ({
  onComplete,
  trigger,
  ...props
}: Props) => {
  const { createField, updateField, state } = useContext(ProfileContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");

  const wrappedOnComplete = useCallback(
    (updated?: IProfileField | Absence): void => {
      onComplete?.(updated);
      setModalOpen(false);
    },
    [onComplete]
  );

  const createOrUpdateField = useCallback(async () => {
    if ("field" in props) {
      try {
        await updateField(props.field);
        wrappedOnComplete();
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
        if (!draft) {
          return;
        }
        await createField(props.fieldKey, draft, state.player.id);
        wrappedOnComplete();
      } catch (err) {
        setError(err.message);
      }
    }
  }, [wrappedOnComplete, createField, updateField, state.player, props]);

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
  trigger: undefined,
};

export default ProfileFieldEditorModal;
