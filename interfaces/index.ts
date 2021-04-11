import { User, UserRoleType } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { IPlayer, IUser } from "./user";

export * from "./user";

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

export type AuthenticatedSessionInfo = {
  user: IUser | IPlayer;
  sessionType: UserRoleType;
};
export type SessionInfo =
  | AuthenticatedSessionInfo
  | {
      user: null;
    };
