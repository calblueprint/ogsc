import { Absence, ProfileFieldKey } from "@prisma/client";
import { IProfileField } from "interfaces/user";

/**
 * A type guard for checking whether or not a field is an Absence object.
 * This function can be safely removed when absences are migrated to profile fields themselves.
 */
function isAbsence(
  item: IProfileField<ProfileFieldKey> | Absence
): item is Absence {
  return "reason" in item;
}

export default isAbsence;
