import type { UserSignUpFormValues } from "./signUp1";

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
