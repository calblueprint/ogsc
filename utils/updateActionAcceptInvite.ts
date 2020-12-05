import type { UserAcceptInviteFormValues } from "../pages/users/acceptInvite";

export default function updateActionAcceptInvite(
  state: { acceptUserData: UserAcceptInviteFormValues },
  payload: UserAcceptInviteFormValues
): { acceptUserData: UserAcceptInviteFormValues } {
  return {
    ...state,
    acceptUserData: {
      ...state.acceptUserData,
      ...payload,
    },
  };
}
