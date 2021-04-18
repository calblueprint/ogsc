import React from "react";
import { Absence, AbsenceReason, AbsenceType } from "@prisma/client";
import dayjs from "lib/day";
import useCanEditField from "utils/useCanEditField";
import EditMore from "./EditMore";
import ProfileFieldEditorModal from "./ProfileFieldEditorModal";

type Props = {
  absenceType: AbsenceType;
  absences: Absence[];
};

const AbsencePillColors: Record<AbsenceReason, string> = {
  [AbsenceReason.Excused]: "success",
  [AbsenceReason.Unexcused]: "danger",
};

const AbsenceTable: React.FC<Props> = ({ absenceType, absences }: Props) => {
  const canEdit = useCanEditField("absence", absenceType);
  const filteredAbsences = absences
    .filter((absence: Absence) => absence.type === absenceType)
    .sort((a: Absence, b: Absence) => Number(a.date) - Number(b.date));

  return (
    <div className="mb-8 text-sm">
      <h2 className="text-xl font-semibold my-4">{absenceType} Absences</h2>
      <table className="w-full mb-4">
        <thead>
          <tr className="h-16 text-left text-unselected tr-border">
            <th className="w-3/12 pl-5 font-semibold">Date</th>
            <th className="w-2/12 font-semibold">Score</th>
            <th className="w-5/12 font-semibold">Description</th>
            {canEdit && <th className="w-1/12 font-semibold">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredAbsences
            .sort((a, b) => +b.date - +a.date)
            .map((absence: Absence) => (
              <tr key={absence.id} className="h-16 tr-border">
                <td className="w-3/12 pl-5">
                  {dayjs(absence.date).format("MMM DD, YYYY")}
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
                {canEdit && (
                  <td className="w-1/12">
                    <EditMore absenceId={absence.id} />
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between w-64 pl-5">
        <p>Total {absenceType} Absences</p>
        <p className="font-semibold">{filteredAbsences.length}</p>
      </div>
      <div className="mt-8 grid grid-rows-2 w-full justify-end">
        <ProfileFieldEditorModal
          fieldKey="absence"
          onComplete={() => {
            // TODO: Dispatch notification
          }}
        />
      </div>
    </div>
  );
};

export default AbsenceTable;
