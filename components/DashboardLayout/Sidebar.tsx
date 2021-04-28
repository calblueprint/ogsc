import { UserRoleType } from "@prisma/client";
import { useRouter } from "next/router";
import Link from "next/link";
import React from "react";
import { AuthenticatedSessionInfo, UserRoleLabel } from "interfaces";
import useSessionInfo from "utils/useSessionInfo";
import Icon from "components/Icon";
import { signOut } from "next-auth/client";
import { Menu, Transition } from "@headlessui/react";

type SidebarLinkProps = {
  href: string;
  children: string;
};

const SidebarLink: React.FC<SidebarLinkProps> = ({
  href,
  children,
}: SidebarLinkProps) => {
  const router = useRouter();
  const highlighted = router.asPath === href;

  return (
    <>
      <Link href={href} passHref>
        <a
          className={`flex items-center mb-8 font-medium ${
            highlighted ? "font-semibold text-blue" : "text-unselected"
          }`}
        >
          {highlighted && (
            <Icon
              className="w-3 h-3 stroke-current -ml-6 mr-3 transform -rotate-90"
              type="chevron"
            />
          )}
          {children}
        </a>
      </Link>
    </>
  );
};

const SidebarByRole = (
  role: UserRoleType,
  session: AuthenticatedSessionInfo
): React.ReactNode => {
  switch (role) {
    case "Admin":
      return (
        <>
          <SidebarLink href="/admin/players">Players</SidebarLink>
          <SidebarLink href="/admin/users">Members</SidebarLink>
          <SidebarLink href="/admin/invite">Invites</SidebarLink>
          {/* <SidebarLink href="/admin/calendar">Calendar</SidebarLink> */}
          {/* <SidebarLink href="/admin/notes">Notes</SidebarLink> */}
        </>
      );
    case "Mentor":
      return (
        <>
          <SidebarLink href="/mentor/players">Players</SidebarLink>
          {/* <SidebarLink href="/mentor/calendar">Calendar</SidebarLink> */}
          {/* <SidebarLink href="/mentor/notes">Notes</SidebarLink> */}
        </>
      );
    case "Parent":
      return (
        <>
          <SidebarLink href="/parent/players">Players</SidebarLink>
        </>
      );
    case "Player":
      return (
        <>
          <SidebarLink href="/player/players">Players</SidebarLink>
          <SidebarLink href={`/player/players/${session.user.id}`}>
            Profile
          </SidebarLink>

          {/* <SidebarLink href="/player/calendar">Calendar</SidebarLink> */}
          {/* <SidebarLink href="/player/notes">Notes</SidebarLink> */}
        </>
      );
    case "Donor":
      return (
        <>
          <SidebarLink href="/donor/players">Players</SidebarLink>
          {/* <SidebarLink href="/donor/calendar">Calendar</SidebarLink> */}
          {/* <SidebarLink href="/donor/notes">Notes</SidebarLink> */}
        </>
      );
    default:
      return null;
  }
};

const Sidebar: React.FC = () => {
  const session = useSessionInfo();
  const router = useRouter();

  return (
    <div className="fixed top-0 flex flex-col justify-between w-56 h-screen bg-button bg-opacity-75">
      <div className="px-12 pb-16 pt-12">
        <div className="w-full flex justify-center mb-16">
          <img src="/logo.png" alt="Oakland Genesis Soccer Club logo" />
        </div>
        {SidebarByRole(session.sessionType, session)}
      </div>
      <div className="mb-12 px-3">
        <div>
          <>
            <Menu>
              {({ open }) => (
                <>
                  <Menu.Button className="relative focus:outline-none flex align-center justify-center">
                    <div className="flex items-center hover:bg-gray-300 hover:bg-opacity-75 rounded-full px-5 py-2">
                      <div className="w-12 h-12 mr-3 rounded-full">
                        <img src="/placeholder-profile.png" alt="profile" />
                      </div>
                      <div>
                        <p className="font-semibold">{session.user?.name}</p>
                        <p className="text-unselected">
                          {UserRoleLabel[session.sessionType]}
                        </p>
                      </div>
                    </div>
                  </Menu.Button>
                  <Transition
                    show={open}
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <div className="absolute pl-56 -mt-16">
                      <Menu.Items
                        className="absolute z-10 border-medium-gray shadow-lg bg-white rounded-md focus:outline-none flex flex-col text-unselected font-semibold text-sm w-32"
                        style={{
                          borderWidth: 1,
                          transform: "translateY(-32px)",
                        }}
                        static
                      >
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              type="button"
                              className={`flex items-center w-full p-2 font-medium ${
                                active ? "bg-button text-dark" : ""
                              }`}
                              onClick={() => {
                                router.push(
                                  `/${UserRoleLabel[
                                    session.sessionType
                                  ].toLowerCase()}/${session.user?.id}`
                                );
                              }}
                            >
                              <div className="my-2">
                                <Icon type="person" className="inline ml-4" />
                                <p className="inline ml-2 text-sm">Profile</p>
                              </div>
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              type="button"
                              className={`flex items-center w-full px-3 py-4 rounded-b-md font-medium ${
                                active ? "bg-button text-dark" : ""
                              }`}
                              onClick={() =>
                                signOut({
                                  callbackUrl: `window.location.origin`,
                                })
                              }
                            >
                              <Icon
                                type="logoutToggle"
                                className="inline ml-4"
                              />
                              <p className="inline ml-2 text-sm">Log Out</p>
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </div>
                  </Transition>
                </>
              )}
            </Menu>
          </>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
