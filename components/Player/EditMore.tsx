import React, { useState } from "react";
import Icon from "components/Icon";
import Modal from "components/Modal";
import EditScore from "components/Player/EditScore";
import DeleteField from "./DeleteField";

export function getCategory(key: string): string {
  if (key === "AcademicEngagementScore") {
    return "School";
  }
  if (key === "AdvisingScore") {
    return "Advising";
  }
  if (key === "AthleticScore") {
    return "Athletic";
  }
  return "GPA";
}

export type field = {
  value: number | undefined;
  createdAt: Date;
  comment?: string | undefined;
  id: number;
  userId: number;
  key:
    | "AcademicEngagementScore"
    | "AdvisingScore"
    | "AthleticScore"
    | "BMI"
    | "GPA"
    | "PacerTest"
    | "Pushups"
    | "Situps";
};

type EditProps = React.PropsWithChildren<{
  field: field;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setType: React.Dispatch<
    React.SetStateAction<"updated" | "added" | "deleted" | undefined>
  >;
  setDate: React.Dispatch<React.SetStateAction<string>>;
}>;

const EditMore: React.FunctionComponent<EditProps> = ({
  field,
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
        <EditScore
          setSuccess={setSuccess}
          setType={setType}
          setDate={setDate}
          currentScore={field}
          setOption={setSelectedOption}
          scoreCategory={getCategory(field.key)}
        />
      </Modal>
      <Modal open={selectedOption === "delete"} className="w-2/3">
        <DeleteField
          setSuccess={setSuccess}
          setType={setType}
          setDate={setDate}
          setOption={setSelectedOption}
          fieldType={getCategory(field.key) === "GPA" ? "gpa" : "Score"}
          id={field.id}
          userId={field.userId}
          date={`
          ${new Date(field.createdAt).toLocaleString("default", {
            month: "long",
          })}${" "}
          ${field.createdAt.getFullYear().toString()}`}
        />
      </Modal>
    </div>
  );
};

export default EditMore;
