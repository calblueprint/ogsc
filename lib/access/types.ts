import { ProfileFieldKey } from "@prisma/client";
import { IPlayer, IUser } from "interfaces";

type AccessValueBase = boolean | ((player: IPlayer, user: IUser) => boolean);
export type AccessValue =
  | AccessValueBase
  | { read?: AccessValueBase; write?: AccessValueBase };

/**
 * A ProfileAccessDefinition specifies how a particular user should be able to interact with a
 * player profile. Each access definition can specify a set of true/false values or functions
 * to determine which ProfileFieldKeys a user has access to.
 *
 * @example
 * const BioReadOnlyAccess: ProfileAccessDefinition = {
 *  [ProfileFieldKey.BioAoutMe]: { read: true },
 *  [ProfileFieldKey.BioFavoriteSubject]: { read: true },
 *  // ...
 * }
 */
export type ProfileAccessDefinition = Partial<
  Record<ProfileFieldKey, AccessValue>
>;
