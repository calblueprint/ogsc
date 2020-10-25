import { useRouter } from "next/router";
import Link from "next/link";
import React, { useContext } from "react";
import { AuthContext } from "pages/_app";

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
          router.pathname !== href ? "text-unselected" : ""
        }`}
      >
        {children}
      </a>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const user = useContext(AuthContext);
  return (
    <div className="fixed top-0 flex flex-col justify-between w-56 h-screen border-r border-unselected border-opacity-50">
      <div className="px-12 py-24">
        <div className="w-full flex justify-center mb-16">
          <div className="w-20 h-20 bg-placeholder rounded-full" />
        </div>
        <SidebarLink href="/admin/participants">Participants</SidebarLink>
        <SidebarLink href="/admin/users">All Users</SidebarLink>
        <SidebarLink href="/admin/invite">Invite Users</SidebarLink>
        <SidebarLink href="/admin/calendar">Calendar</SidebarLink>
        <SidebarLink href="/admin/notes">Notes</SidebarLink>
      </div>
      <div className="mb-12 px-6">
        <div className="flex items-center">
          <div className="w-10 h-10 mr-4 bg-placeholder rounded-full" />
          <div>
            <p className="font-medium">{user?.name}</p>
            <p className="text-unselected">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
