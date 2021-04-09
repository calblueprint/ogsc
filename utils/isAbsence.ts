import { Absence } from "@prisma/client";

/**
 * A type guard for checking whether or not a field is an Absence object.
 * This function can be safely removed when absences are migrated to profile fields themselves.
 */
function isAbsence(item: unknown): item is Absence {
  return (
    typeof item === "object" &&
    item != null &&
    "reason" in item &&
    "type" in item
  );
}

export default isAbsence;
