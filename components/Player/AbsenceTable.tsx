import React from "react";
import { AbsenceType } from "interfaces";
import { Absence } from "@prisma/client";

type Props = {
  absenceType: AbsenceType;
  absences: Absence[];
};

const AbsenceTable: React.FC<Props> = ({ absenceType, absences }: Props) => {
  const filteredAbsences = absences
    .filter((absence: Absence) => absence.type === absenceType)
    .sort((a: Absence, b: Absence) => Number(a.date) - Number(b.date));

  return (
    <div className="mb-16 text-sm">
      <h2 className="text-xl font-semibold mb-4">{absenceType} Absences</h2>
      <table className="w-full mb-4">
        <thead>
          <tr className="h-16 text-left font-semibold text-unselected border-b border-unselected border-opacity-50">
            <th className="w-3/12 pl-5">Date</th>
            <th className="w-3/12">Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {filteredAbsences.map((absence: Absence) => (
            <tr
              key={absence.id}
              className="h-16 border-b border-unselected border-opacity-50"
            >
              <td className="w-3/12 pl-5">
                {absence.date.toLocaleString("default", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>
              <td className="w-3/12">
                <span className="bg-button px-5 py-3 rounded-full">
                  {absence.reason}
                </span>
              </td>
              <td>{absence.description}</td>
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
