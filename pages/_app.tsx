import { SessionInfo, UserRole } from "interfaces";
import { useSession } from "next-auth/client";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import "../styles/globals.css";

export const AuthContext = React.createContext<SessionInfo>({ user: null });

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
        router.push("/api/auth/signin");
      }
    }
    if (!loadingSession && !session) {
      router.push("/api/auth/signin");
    } else {
      getUser();
    }
  }, [loadingSession, router, session]);

  return (
    <AuthContext.Provider
      value={
        // TODO: When sessionType switching is supported, this should be a stateful value
        user ? { user, sessionType: chooseDefaultRoleType(user) } : { user }
      }
    >
      <Component {...pageProps} />
    </AuthContext.Provider>
  );
};

export default MyApp;
