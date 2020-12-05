import React, { useState } from "react";
import Icon from "components/Icon";
import Modal from "components/Modal";
import EditScore from "components/Player/EditScore";

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
}>;

const EditMore: React.FunctionComponent<EditProps> = ({ field }: EditProps) => {
  const [editMode, setEditMode] = useState(false);
  const [edit, setEdit] = useState(false);
  return (
    <button type="button" onClick={() => setEditMode(!editMode)}>
      <Icon type="more" className="h-5 ml-4 fill-current" />
      {editMode ? (
        <div className="absolute border border-unselected bg-white rounded-lg h-24 w-1/12 grid grid-rows-2">
          <button
            type="button"
            className=" text-dark grid grid-cols-3 place-items-center hover:bg-button rounded-b-none rounded-lg"
            onClick={() => setEdit(true)}
          >
            <Icon type="edit" className="h-3" />
            <p className="justify-self-start">Edit</p>
          </button>
          <button
            type="button"
            className="text-dark grid grid-cols-3 place-items-center hover:bg-button rounded-t-none rounded-lg"
          >
            <Icon type="delete" />
            <p className="justify-self-start">Delete</p>
          </button>
        </div>
      ) : null}
      <Modal open={edit}>
        <EditScore currentScore={field} setHidden={setEdit} />
      </Modal>
    </button>
  );
};

export default EditMore;
