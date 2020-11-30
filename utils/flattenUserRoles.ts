import { Role } from "@prisma/client";
import { DefaultRole, SanitizedUser } from "interfaces";

export default function flattenUserRoles<
  T extends SanitizedUser & {
    roles: Role[];
  }
>(user: T): T & { defaultRole?: DefaultRole } {
  if (user.roles.length === 0) {
    return user;
  }
  return {
    ...user,
    defaultRole: {
      type: user.roles[0].type,
      relatedPlayerIds: user.roles.reduce(
        (ids: number[], role: Role) =>
          role.relatedPlayerId ? [...ids, role.relatedPlayerId] : ids,
        []
      ),
    },
  };
}
