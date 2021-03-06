import type { PlayerProfileFormValues } from "../pages/admin/players/playerForm";

export default function updateActionPlayer(
  state: {
    playerData: PlayerProfileFormValues;
  },
  payload: PlayerProfileFormValues
): { playerData: PlayerProfileFormValues } {
  return {
    ...state,
    playerData: {
      ...state.playerData,
      ...payload,
    },
  };
}
