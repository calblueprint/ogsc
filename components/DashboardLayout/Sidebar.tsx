import { useRouter } from "next/router";
import Link from "next/link";
import React from "react";
import { UserRole, UserRoleLabel } from "interfaces";
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

const SidebarsByRole: Record<UserRole, React.ReactNode> = {
  admin: (
    <>
      <SidebarLink href="/admin/players">Players</SidebarLink>
      <SidebarLink href="/admin/users">Members</SidebarLink>
      <SidebarLink href="/admin/invite">Invites</SidebarLink>
      {/* <SidebarLink href="/admin/calendar">Calendar</SidebarLink> */}
      {/* <SidebarLink href="/admin/notes">Notes</SidebarLink> */}
    </>
  ),
  mentor: (
    <>
      <SidebarLink href="/mentor/players">Players</SidebarLink>
      {/* <SidebarLink href="/mentor/calendar">Calendar</SidebarLink> */}
      {/* <SidebarLink href="/mentor/notes">Notes</SidebarLink> */}
    </>
  ),
  parent: <></>,
  player: (
    <>
      <SidebarLink href="/player/profile">Profile</SidebarLink>
      {/* <SidebarLink href="/player/calendar">Calendar</SidebarLink> */}
      {/* <SidebarLink href="/player/notes">Notes</SidebarLink> */}
    </>
  ),
  donor: (
    <>
      <SidebarLink href="/donor/players">Players</SidebarLink>
      {/* <SidebarLink href="/donor/calendar">Calendar</SidebarLink> */}
      {/* <SidebarLink href="/donor/notes">Notes</SidebarLink> */}
    </>
  ),
};

const Sidebar: React.FC = () => {
  const session = useSessionInfo();
  return (
    <div className="fixed top-0 flex flex-col justify-between w-56 h-screen bg-button bg-opacity-75">
      <div className="px-12 py-24">
        <div className="w-full flex justify-center mb-16">
          <img src="/logo.png" alt="Oakland Genesis Soccer Club logo" />
        </div>
        {SidebarsByRole[session.sessionType]}
      </div>
      <div className="mb-12 px-6">
        <div className="flex items-center">
          <div className="w-10 h-10 mr-4 bg-placeholder rounded-full" />
          <div>
            <p className="font-semibold">{session.user?.name}</p>
            <p className="text-unselected">
              {UserRoleLabel[session.sessionType]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
