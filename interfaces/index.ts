import { Player, User, ViewingPermission } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export type SanitizedUser = Omit<User, "hashedPassword">;

export type AuthenticatedNextApiHandler<T = unknown> = (
  req: NextApiRequest,
  res: NextApiResponse<T>,
  user: User
) => void | Promise<void>;

export interface ValidatedNextApiRequest<T> extends NextApiRequest {
  body: T;
}

/**
 * T = Validated body type, R = Optional response object type
 */
export type ValidatedNextApiHandler<T, R = unknown> = (
  req: ValidatedNextApiRequest<T>,
  res: NextApiResponse<R>,
  ...args: unknown[]
) => void | Promise<void>;

export const UserRoleConstants = <const>[
  "admin",
  "mentor",
  "parent",
  "player",
  "donor",
];
export type UserRole = typeof UserRoleConstants[number];
export const UserRoleLabel: Record<UserRole, string> = {
  admin: "Admin",
  mentor: "Mentor",
  parent: "Parent",
  player: "Player",
  donor: "Donor",
};

export type AuthenticatedSessionInfo = {
  user: SanitizedUser & {
    player: Player;
    viewerPermissions: ViewingPermission[];
  };
  sessionType: UserRole;
};
export type SessionInfo =
  | AuthenticatedSessionInfo
  | {
      user: null;
    };
