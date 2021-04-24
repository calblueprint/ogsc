/// <reference types="react" />
import colors from "constants/colors";
// eslint-disable-next-line import/no-named-default
import { default as originalHotToast } from "react-hot-toast";

type Rendarable = JSX.Element | string | number | null;

const toast = (
  type: "error" | "success" | "loading",
  message: Rendarable
): string => {
  return originalHotToast[type](message, {
    duration: 2000,
    iconTheme: { primary: colors.dark, secondary: colors.button },
    style: {
      background: colors.dark,
      color: colors.button,
      margin: "50px",
    },
  });
};

export default {
  success: (message: Rendarable): string => toast("success", message),
  error: (message: Rendarable): string => toast("error", message),
  loading: (message: Rendarable): string => toast("loading", message),
};
