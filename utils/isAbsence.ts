import { Absence, AbsenceReason, AbsenceType } from "@prisma/client";
import Joi from "lib/validate";

/**
 * A type guard for checking whether or not a field is an Absence object.
 * This function can be safely removed when absences are migrated to profile fields themselves.
 */
function isAbsence(item: unknown): item is Absence {
  return (
    Joi.object<Absence>({
      date: Joi.date().required(),
      description: Joi.string().required(),
      reason: Joi.string()
        .valid(...Object.values(AbsenceReason))
        .required(),
      type: Joi.string()
        .valid(...Object.values(AbsenceType))
        .required(),
    })
      .unknown(true)
      .validate(item).error === undefined
  );
}

export default isAbsence;
