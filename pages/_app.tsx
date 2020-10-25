import { User } from "@prisma/client";
import { useSession } from "next-auth/client";
import type { AppProps } from "next/app";
import React, { useEffect, useState } from "react";
import "../styles/globals.css";

export const AuthContext = React.createContext<User | null>(null);

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const [session, loadingSession] = useSession();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function getUser(): Promise<void> {
      const response = await fetch("/api/users/me");
      const loadedUser = await response.json();
      setUser(loadedUser);
    }
    if (!loadingSession && !session) {
      // Perform a redirect to login
    } else {
      getUser();
    }
  }, [loadingSession, session]);

  return (
    <AuthContext.Provider value={user}>
      <Component {...pageProps} />
    </AuthContext.Provider>
  );
};

export default MyApp;
