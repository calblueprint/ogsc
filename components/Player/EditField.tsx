/* eslint-disable react/destructuring-assignment */
import { Absence, ProfileFieldKey } from "@prisma/client";
import Button from "components/Button";
import { useMemo, useState } from "react";
import { IProfileField } from "interfaces/user";
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

type Props = CreateProps | UpdateProps;

const EditField: React.FC<Props> = ({ onComplete, ...props }: Props) => {
  const [error, setError] = useState("");

  const createOrUpdateField = useMemo(() => {
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
          onComplete?.(props.field);
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
        onComplete?.(await response.json());
      } catch (err) {
        setError(err.message);
      }
    };
  }, [onComplete, props]);

  return (
    <fieldset>
      <div className="rounded-lg">
        <div>
          <p className="text-2xl font-semibold mb-3">
            {"field" in props ? "Edit" : "Create"}{" "}
            {"field" in props
              ? labelProfileField(props.field)
              : labelProfileField(props.fieldKey)}
          </p>
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
            onClick={() => onComplete?.()}
          >
            Cancel
          </Button>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>
    </fieldset>
  );
};

EditField.defaultProps = {
  onComplete: undefined,
};

export default EditField;
