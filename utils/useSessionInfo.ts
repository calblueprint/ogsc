import { AuthenticatedSessionInfo } from "interfaces";
import { AuthContext } from "pages/_app";
import { useContext } from "react";

export default function useSessionInfo(): AuthenticatedSessionInfo {
  const session = useContext(AuthContext);
  return session as AuthenticatedSessionInfo;
}
