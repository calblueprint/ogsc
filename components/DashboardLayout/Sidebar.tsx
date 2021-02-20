import { useRouter } from "next/router";
import Link from "next/link";
import React, { useState } from "react";
import { UserRoleLabel, UserRoleType } from "interfaces";
import useSessionInfo from "utils/useSessionInfo";
import Icon from "components/Icon";

type SidebarLinkProps = {
  href: string;
  children: string;
};

const SidebarLink: React.FC<SidebarLinkProps> = ({
  href,
  children,
}: SidebarLinkProps) => {
  const router = useRouter();
  const highlighted = router.asPath.startsWith(href);

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

const SidebarsByRole: Record<UserRoleType, React.ReactNode> = {
  Admin: (
    <>
      <SidebarLink href="/admin/players">Players</SidebarLink>
      <SidebarLink href="/admin/users">Members</SidebarLink>
      <SidebarLink href="/admin/invite">Invites</SidebarLink>
      {/* <SidebarLink href="/admin/calendar">Calendar</SidebarLink> */}
      {/* <SidebarLink href="/admin/notes">Notes</SidebarLink> */}
    </>
  ),
  Mentor: (
    <>
      <SidebarLink href="/mentor/players">Players</SidebarLink>
      {/* <SidebarLink href="/mentor/calendar">Calendar</SidebarLink> */}
      {/* <SidebarLink href="/mentor/notes">Notes</SidebarLink> */}
    </>
  ),
  Parent: <></>,
  Player: (
    <>
      <SidebarLink href="/player/profile">Profile</SidebarLink>
      {/* <SidebarLink href="/player/calendar">Calendar</SidebarLink> */}
      {/* <SidebarLink href="/player/notes">Notes</SidebarLink> */}
    </>
  ),
  Donor: (
    <>
      <SidebarLink href="/donor/players">Players</SidebarLink>
      {/* <SidebarLink href="/donor/calendar">Calendar</SidebarLink> */}
      {/* <SidebarLink href="/donor/notes">Notes</SidebarLink> */}
    </>
  ),
};

const Sidebar: React.FC = () => {
  const session = useSessionInfo();
  const [showHoverMenu, setShowHoverMenu] = useState(false);

  return (
    <div className="fixed top-0 flex flex-col justify-between w-56 h-screen bg-button bg-opacity-75">
      <div className="px-12 py-24">
        <div className="w-full flex justify-center mb-16">
          <img src="/logo.png" alt="Oakland Genesis Soccer Club logo" />
        </div>
        {SidebarsByRole[session.sessionType]}
      </div>
      <div className="mb-12 px-6">
        <div>
          <div className="flex items-center">
            <div className="w-10 h-10 mr-4 bg-placeholder rounded-full" />
            <div>
              <p className="font-semibold">{session.user?.name}</p>
              <p className="text-unselected">
                {UserRoleLabel[session.sessionType]}
              </p>
            </div>
            <div
              className="absolute h-24"
              style={{ width: showHoverMenu ? "22rem" : "22rem" }}
              onMouseEnter={() => {
                setShowHoverMenu(true);
              }}
              onMouseLeave={() => {
                setShowHoverMenu(false);
              }}
            >
              {showHoverMenu && (
                <div className="absolute ml-56 w-32 h-24 rounded-md shadow-lg bg-white border">
                  <div className="h-14 pt-3 pb-3 hover:bg-hover hover:font-semibold cursor-pointer">
                    <Link href={`/admin/user/${session.user?.id}`}>
                      <div>
                        <Icon type="person" className="inline ml-4" />
                        <p className="inline ml-2 text-sm">Profile</p>
                      </div>
                    </Link>
                  </div>
                  <div className="h-14 pt-3 pb-3 hover:bg-hover hover:font-semibold cursor-pointer">
                    <Icon type="logout" className="inline ml-4" />
                    <p className="inline ml-2 text-sm">Log Out</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
