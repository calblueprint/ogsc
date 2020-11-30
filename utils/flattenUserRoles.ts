import { Role } from "@prisma/client";
import { DefaultRole, SanitizedUser, UserRoleType } from "interfaces";

export default function flattenUserRoles<
  T extends SanitizedUser & {
    roles: Role[];
  }
>(user: T): T & { defaultRole: DefaultRole } {
  return {
    ...user,
    defaultRole: {
      type: user.roles[0]?.type || UserRoleType.Donor,
      relatedPlayerIds: user.roles.reduce(
        (ids: number[], role: Role) =>
          role.relatedPlayerId ? [...ids, role.relatedPlayerId] : ids,
        []
      ),
    },
  };
}
