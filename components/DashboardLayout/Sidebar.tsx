import { useRouter } from "next/router";
import Link from "next/link";
import React from "react";
import { UserRole, UserRoleLabel } from "interfaces";
import useSessionInfo from "utils/useSessionInfo";

type SidebarLinkProps = {
  href: string;
  children: string;
};

const SidebarLink: React.FC<SidebarLinkProps> = ({
  href,
  children,
}: SidebarLinkProps) => {
  const router = useRouter();
  return (
    <Link href={href} passHref>
      <a
        className={`block mb-8 font-medium ${
          !router.pathname.startsWith(href) ? "text-unselected" : ""
        }`}
      >
        {children}
      </a>
    </Link>
  );
};

const SidebarsByRole: Record<UserRole, React.ReactNode> = {
  admin: (
    <>
      <SidebarLink href="/admin/participants">Participants</SidebarLink>
      <SidebarLink href="/admin/users">All Users</SidebarLink>
      <SidebarLink href="/admin/invite">Invite Users</SidebarLink>
      <SidebarLink href="/admin/calendar">Calendar</SidebarLink>
      <SidebarLink href="/admin/notes">Notes</SidebarLink>
    </>
  ),
  mentor: (
    <>
      <SidebarLink href="/mentor/participants">Participants</SidebarLink>
      <SidebarLink href="/mentor/calendar">Calendar</SidebarLink>
      <SidebarLink href="/mentor/notes">Notes</SidebarLink>
    </>
  ),
  parent: <></>,
  player: (
    <>
      <SidebarLink href="/player/profile">Profile</SidebarLink>
      <SidebarLink href="/player/calendar">Calendar</SidebarLink>
      <SidebarLink href="/player/notes">Notes</SidebarLink>
    </>
  ),
  donor: (
    <>
      <SidebarLink href="/donor/participants">Participants</SidebarLink>
      <SidebarLink href="/donor/calendar">Calendar</SidebarLink>
      <SidebarLink href="/donor/notes">Notes</SidebarLink>
    </>
  ),
};

const Sidebar: React.FC = () => {
  const session = useSessionInfo();
  return (
    <div className="fixed top-0 flex flex-col justify-between w-56 h-screen border-r border-unselected border-opacity-50">
      <div className="px-12 py-24">
        <div className="w-full flex justify-center mb-16">
          <div className="w-20 h-20 bg-placeholder rounded-full" />
        </div>
        {SidebarsByRole[session.sessionType]}
      </div>
      <div className="mb-12 px-6">
        <div className="flex items-center">
          <div className="w-10 h-10 mr-4 bg-placeholder rounded-full" />
          <div>
            <p className="font-medium">{session.user?.name}</p>
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
