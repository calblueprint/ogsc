import {
  IProfileField,
  ProfileFieldKeysOfProfileValueType,
  TimeSeriesProfileFieldValues,
} from "interfaces";
import { deserializeProfileFieldValue } from "./buildUserProfile";

type Keys = ProfileFieldKeysOfProfileValueType<TimeSeriesProfileFieldValues>;

export default (a: IProfileField<Keys>, b: IProfileField<Keys>): number => {
  const aValue = deserializeProfileFieldValue(a);
  const bValue = deserializeProfileFieldValue(b);
  return (bValue?.date.unix() ?? 0) - (aValue?.date.unix() ?? 0);
};
