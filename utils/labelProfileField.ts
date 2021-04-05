import { Absence, ProfileFieldKey } from "@prisma/client";
import { IProfileField, ProfileFieldLabels } from "interfaces";
import isAbsence from "./isAbsence";

function labelProfileField(
  keyOrField: IProfileField | Absence | ProfileFieldKey | string
): string {
  let key: string;
  if (typeof keyOrField === "object") {
    if (isAbsence(keyOrField)) {
      key = "Absence";
    } else {
      key = keyOrField.key;
    }
  } else {
    key = keyOrField;
  }

  if (key in ProfileFieldLabels) {
    return ProfileFieldLabels[key as keyof typeof ProfileFieldLabels];
  }
  return key;
}

export default labelProfileField;
