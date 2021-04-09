/* eslint-disable react/destructuring-assignment */
import { Absence } from "@prisma/client";
import React, { useContext, useState } from "react";
import Icon from "components/Icon";
import Modal from "components/Modal";
import EditField from "components/Player/EditField";
import Popover from "components/Popover";
import { IProfileField, NumericProfileFields } from "interfaces/user";
import DeleteField from "./DeleteField";
import ProfileContext from "./ProfileContext";

type EditProps =
  | {
      fieldKey: NumericProfileFields;
    }
  | {
      absenceId: number;
    };

const EditMore: React.FunctionComponent<EditProps> = (props: EditProps) => {
  const [selectedOption, setSelectedOption] = useState<
    "edit" | "delete" | null
  >(null);
  const {
    state: { player },
    refreshProfile,
  } = useContext(ProfileContext);

  const profileFields: IProfileField<NumericProfileFields>[] | undefined =
    "fieldKey" in props
      ? player?.profile?.[props.fieldKey]?.history
      : undefined;
  const field =
    "fieldKey" in props
      ? profileFields?.find(
          (profileField: IProfileField<NumericProfileFields>) =>
            profileField.key === props.fieldKey
        )
      : player?.absences?.find(
          (absence: Absence) => props.absenceId === absence.id
        );

  if (!field) {
    return null;
  }

  return (
    <div>
      <Popover
        trigger={
          <button type="button">
            <Icon type="more" className="h-5 ml-4 fill-current" />
          </button>
        }
      >
        <div className="border border-unselected bg-white rounded-lg h-24 grid grid-rows-2">
          <button
            type="button"
            className=" text-dark grid grid-cols-3 place-items-center hover:bg-button rounded-b-none rounded-lg"
            onClick={() => {
              setSelectedOption("edit");
            }}
          >
            <Icon type="edit" className="h-3" />
            <p className="justify-self-start">Edit</p>
          </button>
          <button
            type="button"
            className="text-dark grid grid-cols-3 place-items-center hover:bg-button rounded-t-none rounded-lg"
            onClick={() => {
              setSelectedOption("delete");
            }}
          >
            <Icon type="delete" />
            <p className="justify-self-start">Delete</p>
          </button>
        </div>
        <Modal open={selectedOption === "edit"} className="w-2/3">
          <EditField
            field={field}
            onComplete={(updated?: IProfileField | Absence) => {
              setSelectedOption(null);
              if (updated) {
                refreshProfile();
              }
              // TODO: Dispatch notification
            }}
          />
        </Modal>
        <Modal open={selectedOption === "delete"} className="w-2/3">
          <DeleteField
            field={field}
            onComplete={(deleted?: IProfileField | Absence) => {
              setSelectedOption(null);
              if (deleted) {
                refreshProfile();
              }
              // TODO: Dispatch notification
            }}
          />
        </Modal>
      </Popover>
    </div>
  );
};

export default EditMore;
