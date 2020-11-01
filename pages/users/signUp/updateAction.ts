import type { UserSignUpFormValues } from ".";

export default function updateAction(
  state: { userData: UserSignUpFormValues },
  payload: UserSignUpFormValues
): { userData: UserSignUpFormValues } {
  return {
    ...state,
    userData: {
      ...state.userData,
      ...payload,
    },
  };
}
