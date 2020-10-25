import { User } from "@prisma/client";
import { useSession } from "next-auth/client";
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

type Props = {
  children: React.ReactChildren;
};

export const AuthContext = React.createContext<User | null>(null);

const DashboardLayout: React.FC<Props> = ({ children }: Props) => {
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
      <Sidebar user={user} />
      <div className="ml-48">{children}</div>
    </AuthContext.Provider>
  );
};

export default DashboardLayout;
