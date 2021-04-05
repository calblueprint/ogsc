import { Absence } from "@prisma/client";
import Button from "components/Button";
import dayjs from "dayjs";
import { IProfileField } from "interfaces/user";
import { useState } from "react";
import isAbsence from "utils/isAbsence";
import labelProfileField from "utils/labelProfileField";

type Props = {
  field: IProfileField | Absence;
  onComplete?: (deleted?: IProfileField | Absence) => void;
};

const DeleteField: React.FC<Props> = ({ field, onComplete }: Props) => {
  const [error, setError] = useState("");

  async function deleteField(): Promise<void> {
    try {
      const response = await fetch(
        isAbsence(field)
          ? `/api/absences/${field.id}`
          : `/api/profileFields/${field.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw await response.json();
      }
      onComplete?.(field);
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <div>
      <p>
        Are you sure you want to delete this {labelProfileField(field)} entry
        for{" "}
        {dayjs(isAbsence(field) ? field.date : field.createdAt).format(
          "MM/DD/YYYY"
        )}{" "}
        ?
      </p>
      <div className="flex flex-row gap-6 mt-10">
        <Button className="py-2 px-16 text-sm" onClick={deleteField}>
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
