import type { UserSignUpFormValues } from "../pages/users/signUp";

export default function updateActionSignUp(
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
