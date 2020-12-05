import { IPlayer, IUser } from "interfaces/user";
import { AccessValue } from "./types";

export default function resolveAccessValue(
  accessValue: AccessValue,
  intent: "read" | "write",
  player: IPlayer,
  user: IUser
): boolean {
  switch (typeof accessValue) {
    case "boolean":
      return accessValue;
    case "function":
      return accessValue(player, user);
    case "object": {
      const resolvingValue = accessValue[intent];
      if (resolvingValue !== undefined) {
        return resolveAccessValue(resolvingValue, intent, player, user);
      }
      return false;
    }
    default:
      return false;
  }
}
