/* eslint-disable react/destructuring-assignment */
import { Menu, Transition } from "@headlessui/react";
import { Absence } from "@prisma/client";
import React, { useContext, useState } from "react";
import Icon from "components/Icon";
import Modal from "components/Modal";
import { StandaloneProfileFieldEditor } from "components/Player/ProfileFieldEditorModal";
import { IProfileField, NumericProfileFields } from "interfaces/user";
import dayjs from "lib/day";
import toast from "lib/toast";
import { deserializeProfileFieldValue } from "utils/buildUserProfile";
import labelProfileField from "utils/labelProfileField";
import isAbsence from "utils/isAbsence";
import DeleteField from "./DeleteField";
import ProfileContext from "./ProfileContext";

type EditProps =
  | {
      fieldKey: NumericProfileFields;
      fieldId: number;
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
  } = useContext(ProfileContext);

  const profileFields: IProfileField<NumericProfileFields>[] | undefined =
    "fieldKey" in props
      ? player?.profile?.[props.fieldKey]?.history
      : undefined;
  const field =
    "fieldKey" in props
      ? profileFields?.find(
          (profileField: IProfileField<NumericProfileFields>) =>
            profileField.id === props.fieldId
        )
      : player?.absences?.find(
          (absence: Absence) => props.absenceId === absence.id
        );

  if (!field) {
    return null;
  }

  return (
    <>
      <Menu>
        {({ open }) => (
          <>
            <Menu.Button className="relative focus:outline-none flex align-center justify-center">
              <Icon type="more" className="h-5 ml-4 fill-current" />
            </Menu.Button>
            <Transition
              show={open}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Menu.Items
                className="absolute z-10 border-medium-gray shadow-lg bg-white rounded-md pt-12 focus:outline-none flex flex-col text-unselected font-semibold text-sm w-32"
                style={{ borderWidth: 1, transform: "translateY(-32px)" }}
                static
              >
                <Icon type="more" className="h-5 ml-4 -mt-10 fill-current" />
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      className={`flex items-center w-full px-4 py-2 font-medium ${
                        active ? "bg-button text-dark" : ""
                      }`}
                      onClick={() => {
                        setSelectedOption("edit");
                      }}
                    >
                      <Icon type="edit" className="h-4 mr-3 fill-current" />
                      <p className="justify-self-start">Edit</p>
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      className={`flex items-center w-full px-4 py-2 rounded-b-md font-medium ${
                        active ? "bg-button text-dark" : ""
                      }`}
                      onClick={() => {
                        setSelectedOption("delete");
                      }}
                    >
                      <Icon type="delete" className="h-4 mr-3 stroke-current" />
                      <p className="justify-self-start">Delete</p>
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
      <Modal
        open={selectedOption === "edit"}
        className="w-1/2"
        onClose={() => setSelectedOption(null)}
      >
        <StandaloneProfileFieldEditor
          field={field}
          onComplete={(updated?: IProfileField | Absence) => {
            setSelectedOption(null);
            if (updated) {
              toast.success(
                `${labelProfileField(updated)} for ${dayjs(
                  isAbsence(updated)
                    ? updated.date
                    : deserializeProfileFieldValue(
                        updated as IProfileField<NumericProfileFields>
                      )?.date
                ).format("MMMM YYYY")} has been updated!`
              );
            }
          }}
        />
      </Modal>
      <Modal
        open={selectedOption === "delete"}
        onClose={() => setSelectedOption(null)}
      >
        <DeleteField
          field={field}
          onComplete={(deleted?: IProfileField | Absence) => {
            setSelectedOption(null);
            if (deleted) {
              toast.success(
                `${labelProfileField(deleted)} for ${dayjs(
                  isAbsence(deleted)
                    ? deleted.date
                    : deserializeProfileFieldValue(
                        deleted as IProfileField<NumericProfileFields>
                      )?.date
                ).format("MMMM YYYY")} has been deleted.`
              );
            }
          }}
        />
      </Modal>
    </>
  );
};

export default EditMore;
