import { Absence, AbsenceReason, AbsenceType } from "@prisma/client";
import DateTimeInput from "components/DateTimeInput";
import { Dayjs } from "dayjs";
import { IAbsence } from "interfaces/user";

export type AbsenceInputProps = {
  absence: Partial<IAbsence> | undefined;
  onChange: (change: Partial<Absence>) => void;
};

const AbsenceInput: React.FC<AbsenceInputProps> = ({
  absence: _absence,
  onChange,
}: AbsenceInputProps) => {
  const absence = _absence?.draft ?? _absence;
  return (
    <div>
      <p className="text-sm font-semibold mb-2">Absence Type</p>
      <select
        value={absence?.type}
        className="select"
        onChange={({ target: { value } }) =>
          onChange({ type: value as AbsenceType })
        }
      >
        <option disabled selected value={undefined}>
          {" "}
        </option>
        {Object.values(AbsenceType).map((type: AbsenceType) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      <p className="text-sm font-semibold mb-2 mt-8">Month/Year</p>
      <DateTimeInput
        onChange={(date: Dayjs) => onChange({ date: date.toDate() })}
        value={absence?.date}
      />
      <p className="text-sm font-semibold mb-2 mt-8">Excused/Unexcused</p>
      <select
        value={absence?.reason}
        className="select"
        onChange={({ target: { value } }) =>
          onChange({ reason: value as AbsenceReason })
        }
      >
        <option disabled selected value={undefined}>
          {" "}
        </option>
        {Object.values(AbsenceReason).map((reason: AbsenceReason) => (
          <option key={reason} value={reason}>
            {reason}
          </option>
        ))}
      </select>
      <p className="text-sm font-semibold mb-2 mt-8">Description</p>
      <input
        type="text"
        className="input text-sm w-full font-light"
        value={absence?.description}
        onChange={({ target: { value } }) => onChange({ description: value })}
      />
    </div>
  );
};

export default AbsenceInput;
