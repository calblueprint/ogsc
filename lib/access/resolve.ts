import { IPlayer, IUser } from "interfaces/user";
import { AccessValue } from "./types";

export default function resolveAccessValue(
  accessValue: AccessValue,
  intent: "read" | "write",
  player: IPlayer,
  user: IUser,
  data?: Record<string, unknown>
): boolean {
  switch (typeof accessValue) {
    case "boolean":
      return accessValue;
    case "function":
      return accessValue(player, user, data);
    case "object": {
      const resolvingValue = accessValue[intent];
      if (resolvingValue !== undefined) {
        return resolveAccessValue(resolvingValue, intent, player, user, data);
      }
      return false;
    }
    default:
      return false;
  }
}
