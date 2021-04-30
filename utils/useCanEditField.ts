import { AbsenceType, ProfileFieldKey, UserRoleType } from "@prisma/client";
import ProfileContext from "components/Player/ProfileContext";
import {
  AttendanceAccessDefinitionsByRole,
  ProfileAccessDefinitionsByRole,
  NotesAccessDefinitionsByRole,
} from "lib/access/definitions";
import resolveAccessValue from "lib/access/resolve";
import { useContext } from "react";
import useSessionInfo from "./useSessionInfo";

const useCanEditField = (
  key: ProfileFieldKey | "absence" | "note",
  absenceType?: AbsenceType,
  data?: Record<string, unknown>
): boolean => {
  const { user } = useSessionInfo();
  const {
    state: { player },
  } = useContext(ProfileContext);

  if (!player) {
    return false;
  }

  let canEdit = false;
  if (user.defaultRole.type === UserRoleType.Admin) {
    canEdit = true;
  } else if (key === "absence") {
    canEdit = resolveAccessValue(
      AttendanceAccessDefinitionsByRole[user.defaultRole.type][
        absenceType ?? AbsenceType.Academic
      ] ?? false,
      "write",
      player,
      user,
      data
    );
  } else if (key === "note") {
    canEdit = resolveAccessValue(
      NotesAccessDefinitionsByRole[user.defaultRole.type],
      "write",
      player,
      user,
      data
    );
  } else {
    canEdit = resolveAccessValue(
      ProfileAccessDefinitionsByRole[user.defaultRole.type][key] ?? false,
      "write",
      player,
      user,
      data
    );
  }
  return canEdit;
};

export default useCanEditField;
