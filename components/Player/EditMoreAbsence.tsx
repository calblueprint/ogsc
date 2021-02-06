import React, { useState } from "react";
import Icon from "components/Icon";
import Modal from "components/Modal";
import { Absence } from "@prisma/client";
import EditAbsence from "./EditAbsence";
import DeleteField from "./DeleteField";

type EditProps = React.PropsWithChildren<{
  absence: Absence;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setType: React.Dispatch<
    React.SetStateAction<"updated" | "added" | "deleted" | undefined>
  >;
  setDate: React.Dispatch<React.SetStateAction<string>>;
}>;

const EditMoreAbsence: React.FunctionComponent<EditProps> = ({
  absence,
  setSuccess,
  setType,
  setDate,
}: EditProps) => {
  const [editMode, setEditMode] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  return (
    <div>
      <button type="button" onClick={() => setEditMode(!editMode)}>
        <Icon type="more" className="h-5 ml-4 fill-current" />
        {editMode ? (
          <div className="absolute border border-unselected bg-white rounded-lg h-24 w-1/12 grid grid-rows-2">
            <button
              type="button"
              className=" text-dark grid grid-cols-3 place-items-center hover:bg-button rounded-b-none rounded-lg"
              onClick={() => {
                setSelectedOption("edit");
                setEditMode(false);
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
                setEditMode(false);
              }}
            >
              <Icon type="delete" />
              <p className="justify-self-start">Delete</p>
            </button>
          </div>
        ) : null}
      </button>
      <Modal open={selectedOption === "edit"} className="w-2/3">
        <EditAbsence
          setSuccess={setSuccess}
          setType={setType}
          setDate={setDate}
          currentAbsence={absence}
          setOption={setSelectedOption}
        />
      </Modal>
      <Modal open={selectedOption === "delete"} className="w-2/3">
        <DeleteField
          setSuccess={setSuccess}
          setType={setType}
          setDate={setDate}
          setOption={setSelectedOption}
          fieldType="absence"
          id={absence.id}
          userId={absence.userId}
          date={`
          ${new Date(absence.date).toLocaleString("default", {
            month: "long",
          })}${" "}
          ${absence.date.getFullYear().toString()}`}
        />
      </Modal>
    </div>
  );
};

export default EditMoreAbsence;
