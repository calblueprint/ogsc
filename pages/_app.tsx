import {
  AuthenticatedSessionInfo,
  SessionInfo,
  UserRole,
  UserRoleConstants,
} from "interfaces";
import { useSession } from "next-auth/client";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import "../styles/globals.css";

export const AuthContext = React.createContext<AuthenticatedSessionInfo | null>(
  null
);

function chooseDefaultRoleType(user: SessionInfo["user"]): UserRole {
  if (!user) {
    throw new Error("User is not authenticated");
  }
  if (user?.isAdmin) {
    return "admin";
  }
  if (user?.viewerPermissions.length > 0) {
    return "mentor";
  }
  if (user?.player) {
    return "player";
  }
  return "donor";
}

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const [session, loadingSession] = useSession();
  const router = useRouter();
  const [user, setUser] = useState<SessionInfo["user"] | null>(null);
  const accessingAuthenticatedRoute = router.pathname.match(
    new RegExp(`^/(${UserRoleConstants.join("|")})`)
  );
  const sessionInfo: SessionInfo = useMemo(
    () =>
      user ? { user, sessionType: chooseDefaultRoleType(user) } : { user },
    [user]
  );

  useEffect(() => {
    async function getUser(): Promise<void> {
      try {
        const response = await fetch("/api/users/me");
        if (!response.ok) {
          throw new Error(await response.json());
        }
        const loadedUser = await response.json();
        setUser(loadedUser);
      } catch (err) {
        // TODO: Add some error logging
      }
    }
    if (session) {
      getUser();
    } else if (!loadingSession && accessingAuthenticatedRoute) {
      router.push("/api/auth/signin");
    }
  }, [accessingAuthenticatedRoute, loadingSession, router, session]);

  if (!accessingAuthenticatedRoute) {
    return <Component {...pageProps} />;
  }
  if (!sessionInfo.user) {
    // TODO: Add shimmer loading skeleton
    return null;
  }
  return (
    <AuthContext.Provider
      value={
        // TODO: When sessionType switching is supported, this should be a stateful value
        sessionInfo
      }
    >
      <Component {...pageProps} />
    </AuthContext.Provider>
  );
};

export default MyApp;
