import {
  IProfileField,
  NumericProfileFields,
  UncreatedProfileField,
} from "interfaces/user";
import dayjs from "lib/day";
import React from "react";
import { deserializeProfileFieldValue } from "utils/buildUserProfile";
import EditMore from "./EditMore";

type Props = {
  values: (
    | IProfileField<NumericProfileFields>
    | UncreatedProfileField<NumericProfileFields>
  )[];
  startDate?: Date | null;
  endDate?: Date | null;
};

const ValueHistoryTable: React.FC<Props> = ({
  values,
  startDate,
  endDate,
}: Props) => (
  <table className="w-full mt-4">
    <thead>
      <tr className="h-10 text-left text-unselected tr-border">
        <th className="w-3/12 pl-5 font-semibold">Date</th>
        <th className="w-2/12 font-semibold">Value</th>
        <th className="w-5/12 font-semibold">Description</th>
        <th className="w-1/12 font-semibold">Actions</th>
      </tr>
    </thead>
    <tbody>
      {values
        .sort((a, b) => {
          const aValue = deserializeProfileFieldValue(a);
          const bValue = deserializeProfileFieldValue(b);
          return (bValue?.date.unix() ?? 0) - (aValue?.date.unix() ?? 0);
        })
        .map((field) => {
          const value = deserializeProfileFieldValue(field);
          if (startDate && endDate && value) {
            if (
              dayjs(value.date).isAfter(endDate) ||
              dayjs(value.date).isBefore(startDate)
            ) {
              return null;
            }
          }

          return (
            <tr key={field.id} className="h-16 tr-border">
              <td className="w-3/12 px-5">
                {dayjs(value?.date).format("MMM YYYY")}
              </td>
              <td className="w-2/12">{value?.value}</td>
              <td>{value?.comment}</td>
              <td className="w-1/12">
                <EditMore fieldKey={field.key} fieldId={field.id} />
              </td>
            </tr>
          );
        })}
    </tbody>
  </table>
);

ValueHistoryTable.defaultProps = {
  startDate: undefined,
  endDate: undefined,
};

export default ValueHistoryTable;
