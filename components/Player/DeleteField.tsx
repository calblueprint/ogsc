import { Absence } from "@prisma/client";
import Button from "components/Button";
import dayjs from "dayjs";
import { IProfileField } from "interfaces/user";
import { useContext, useState } from "react";
import { deserializeProfileFieldValue } from "utils/buildUserProfile";
import isAbsence from "utils/isAbsence";
import labelProfileField from "utils/labelProfileField";
import ProfileContext from "./ProfileContext";

type Props = {
  field: IProfileField | Absence;
  onComplete?: (deleted?: IProfileField | Absence) => void;
};

const DeleteField: React.FC<Props> = ({ field, onComplete }: Props) => {
  const { deleteField } = useContext(ProfileContext);
  const [error, setError] = useState("");

  let date;
  if (isAbsence(field)) {
    date = field.date;
  } else {
    const value = deserializeProfileFieldValue(field);
    if (typeof value === "object" && value && "date" in value) {
      date = value.date;
    } else {
      date = field.createdAt;
    }
  }

  async function onDelete(): Promise<void> {
    try {
      await deleteField(isAbsence(field) ? "absence" : field.key, field.id);
      onComplete?.(field);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <p>
        Are you sure you want to delete this {labelProfileField(field)} entry
        for {dayjs(date).format("MM/DD/YYYY")} ?
      </p>
      <div className="flex flex-row gap-6 mt-10">
        <Button className="py-2 px-16 text-sm" onClick={onDelete}>
          Yes
        </Button>
        <Button
          className="border border-blue bg-white py-2 px-12 text-sm border-opacity-100"
          onClick={() => onComplete?.()}
        >
          Cancel
        </Button>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
};

DeleteField.defaultProps = {
  onComplete: undefined,
};

export default DeleteField;
