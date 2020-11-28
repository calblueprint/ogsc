import type { ExistingUserType } from "../pages/admin/players/playerForm";

export default function updateActionForm(
  state: {
    playerForm: ExistingUserType;
  },
  payload: ExistingUserType
): { playerForm: ExistingUserType } {
  return {
    ...state,
    playerForm: {
      ...state.playerForm,
      ...payload,
    },
  };
}
