import React, { useState } from "react";
import { AbsenceReason, AbsenceType } from "interfaces";
import { Absence } from "@prisma/client";
import EditMoreAbsence from "components/Player/EditMoreAbsence";
import SuccessfulChange from "./successChange";

type Props = {
  absenceType: AbsenceType;
  absences: Absence[];
};

const AbsencePillColors: Record<AbsenceReason, string> = {
  [AbsenceReason.Excused]: "success",
  [AbsenceReason.Unexcused]: "danger",
};

const AbsenceTable: React.FC<Props> = ({ absenceType, absences }: Props) => {
  const [success, setSuccess] = useState(false);
  const [editType, setEditType] = useState<"updated" | "added">();
  const [editDate, setEditDate] = useState<string>("");
  const filteredAbsences = absences
    .filter((absence: Absence) => absence.type === absenceType)
    .sort((a: Absence, b: Absence) => Number(a.date) - Number(b.date));

  return (
    <div className="mb-16 text-sm">
      {success && (
        <SuccessfulChange
          text={`${absenceType} Absence for ${editDate} has been ${editType}!`}
          setSuccess={setSuccess}
        />
      )}
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
                <EditMoreAbsence
                  absence={absence}
                  setType={setEditType}
                  setDate={setEditDate}
                  setSuccess={setSuccess}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between w-64 pl-5">
        <p>Total {absenceType} Absences</p>
        <p className="font-semibold">{filteredAbsences.length}</p>
      </div>
    </div>
  );
};

export default AbsenceTable;
