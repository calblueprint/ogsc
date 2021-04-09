import React, { useState } from "react";
import { Absence, AbsenceReason, AbsenceType } from "@prisma/client";
import Button from "components/Button";
import Modal from "components/Modal";
import EditMore from "./EditMore";
import EditField from "./EditField";

type Props = {
  absenceType: AbsenceType;
  absences: Absence[];
};

const AbsencePillColors: Record<AbsenceReason, string> = {
  [AbsenceReason.Excused]: "success",
  [AbsenceReason.Unexcused]: "danger",
};

const AbsenceTable: React.FC<Props> = ({ absenceType, absences }: Props) => {
  const [addAbsence, setAddAbsence] = useState(false);
  const filteredAbsences = absences
    .filter((absence: Absence) => absence.type === absenceType)
    .sort((a: Absence, b: Absence) => Number(a.date) - Number(b.date));

  return (
    <div className="mb-16 text-sm">
      <h2 className="text-xl font-semibold my-4">{absenceType} Absences</h2>
      <table className="w-full mb-4">
        <thead>
          <tr className="h-16 text-left text-unselected tr-border">
            <th className="w-3/12 pl-5 font-semibold">Date</th>
            <th className="w-2/12 font-semibold">Score</th>
            <th className="w-5/12 font-semibold">Description</th>
            <th className="w-1/12 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAbsences.map((absence: Absence) => (
            <tr key={absence.id} className="h-16 tr-border">
              <td className="w-3/12 pl-5">
                {absence.date.toLocaleString("default", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>
              <td className="w-3/12">
                <span
                  className={`font-medium bg-${
                    AbsencePillColors[absence.reason]
                  }-muted text-${
                    AbsencePillColors[absence.reason]
                  } px-5 py-3 rounded-full`}
                >
                  {absence.reason}
                </span>
              </td>
              <td>{absence.description}</td>
              <td className="w-1/12">
                <EditMore absenceId={absence.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between w-64 pl-5">
        <p>Total {absenceType} Absences</p>
        <p className="font-semibold">{filteredAbsences.length}</p>
      </div>
      <div className=" mb-16 mt-8 grid grid-rows-2 w-full justify-end">
        <Button
          iconType="plus"
          onClick={() => {
            setAddAbsence(true);
          }}
        >
          Add Absence
        </Button>
      </div>
      <Modal open={addAbsence} className="w-2/3">
        <EditField
          fieldKey="absence"
          onComplete={() => {
            setAddAbsence(false);
            // TODO: Dispatch notification
          }}
        />
      </Modal>
    </div>
  );
};

export default AbsenceTable;
