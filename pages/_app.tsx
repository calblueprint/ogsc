import { UserRoleType } from "@prisma/client";
import { AuthenticatedSessionInfo, SessionInfo } from "interfaces";
import { createStore, StateMachineProvider } from "little-state-machine";
import { useSession } from "next-auth/client";
import type { AppProps } from "next/app";
import { useRouter, Router } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import "../styles/globals.css";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export const AuthContext = React.createContext<AuthenticatedSessionInfo | null>(
  null
);

function chooseDefaultRoleType(user: SessionInfo["user"]): UserRoleType {
  if (!user) {
    throw new Error("User is not authenticated");
  }
  // Default to donor-type role if one has not been assigned already
  return user.defaultRole?.type || UserRoleType.Donor;
}

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const [session, loadingSession] = useSession();
  const router = useRouter();
  Router.events.on("routeChangeStart", () => NProgress.start());
  Router.events.on("routeChangeComplete", () => NProgress.done());
  Router.events.on("routeChangeError", () => NProgress.done());
  const [user, setUser] = useState<SessionInfo["user"] | null>(null);
  const accessingAuthenticatedRoute =
    router.asPath.match(
      new RegExp(
        `^/(${Object.values(UserRoleType)
          .map((role: UserRoleType) => role.toLowerCase())
          .join("|")})`
      )
    ) !== null;
  const sessionInfo: SessionInfo = useMemo(
    () =>
      user ? { user, sessionType: chooseDefaultRoleType(user) } : { user },
    [user]
  );
  const store = createStore({
    userData: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      role: null,
      adminNote: "",
    },
    playerData: {
      id: null,
      PlayerNumber: null,
      age: null,
      BioAboutMe: null,
      BioHobbies: null,
      BioFavoriteSubject: null,
      BioMostDifficultSubject: null,
      BioSiblings: null,
      BioParents: null,
      AcademicEngagementScore: [],
      AdvisingScore: [],
      AthleticScore: [],
      GPA: [],
      DisciplinaryActions: [],
      SchoolAbsences: [],
      AdvisingAbsences: [],
      AthleticAbsences: [],
      BMI: null,
      PacerTest: null,
      MileTime: null,
      Situps: null,
      Pushups: null,
      HealthAndWellness: null,
      Highlights: null,
    },
    playerForm: {
      choice: "",
      player: null,
    },
    acceptUserData: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    },
  });

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
    return (
      <StateMachineProvider>
        <Component {...pageProps} />
      </StateMachineProvider>
    );
  }
  if (!sessionInfo?.user) {
    // TODO: Add shimmer loading skeleton
    return null;
  }
  return (
    <StateMachineProvider store={store}>
      <AuthContext.Provider
        value={
          // TODO: When sessionType switching is supported, this should be a stateful value
          sessionInfo
        }
      >
        <Component {...pageProps} />
      </AuthContext.Provider>
    </StateMachineProvider>
  );
};

export default MyApp;
