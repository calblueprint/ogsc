import {
  IProfileField,
  NumericProfileFields,
  UncreatedProfileField,
} from "interfaces/user";
import dayjs from "lib/day";
import React from "react";
import { deserializeProfileFieldValue } from "utils/buildUserProfile";
import sortTimeSeriesFields from "utils/sortTimeSeriesFields";
import useCanEditField from "utils/useCanEditField";
import EditMore from "./EditMore";

type Props = {
  fieldKey: NumericProfileFields;
  values: (
    | IProfileField<NumericProfileFields>
    | UncreatedProfileField<NumericProfileFields>
  )[];
  startDate?: Date | null;
  endDate?: Date | null;
};

const ValueHistoryTable: React.FC<Props> = ({
  fieldKey,
  values,
  startDate,
  endDate,
}: Props) => {
  const canEdit = useCanEditField(fieldKey);
  return (
    <table className="w-full mt-4 text-sm">
      <thead>
        <tr className="h-10 text-left text-unselected tr-border">
          <th className="w-2/12 pl-5 font-semibold">Date</th>
          <th className="w-2/12 font-semibold">Value</th>
          <th className="w-6/12 font-semibold">Description</th>
          {canEdit && <th className="w-1/12 font-semibold">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {values.sort(sortTimeSeriesFields).map((field) => {
          const value = deserializeProfileFieldValue(field);
          if (startDate && endDate && value) {
            if (
              value.date.isAfter(endDate, "day") ||
              value.date.isBefore(startDate, "day")
            ) {
              return null;
            }
          }

          return (
            <tr key={field.id} className="h-16 tr-border">
              <td className="w-2/12 px-5">
                {dayjs(value?.date).format("MMM YYYY")}
              </td>
              <td className="w-2/12">{value?.value}</td>
              <td>{value?.comment}</td>
              {canEdit && (
                <td className="w-1/12">
                  <EditMore fieldKey={field.key} fieldId={field.id} />
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

ValueHistoryTable.defaultProps = {
  startDate: undefined,
  endDate: undefined,
};

export default ValueHistoryTable;
