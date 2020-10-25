import { User } from "@prisma/client";
import { useRouter } from "next/router";
import Link from "next/link";
import React from "react";

type Props = {
  user: User | null;
};

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
        className={`block text-gray-600 mb-8 font-medium ${
          router.pathname === href ? "text-gray-900" : ""
        }`}
      >
        {children}
      </a>
    </Link>
  );
};

const Sidebar: React.FC<Props> = ({ user }: Props) => {
  return (
    <div className="fixed flex flex-col justify-between w-50 h-screen border-r border-gray-500">
      <div className="px-12 py-24">
        <div className="w-full flex justify-center mb-16">
          <div className="w-20 h-20 bg-gray-500 rounded-full" />
        </div>
        <SidebarLink href="/">Participants</SidebarLink>
        <SidebarLink href="/f">All Users</SidebarLink>
        <SidebarLink href="/f">Invite Users</SidebarLink>
        <SidebarLink href="/f">Calendar</SidebarLink>
        <SidebarLink href="/f">Notes</SidebarLink>
      </div>
      <div className="mb-12 px-6">
        <div className="flex items-center">
          <div className="w-10 h-10 mr-4 bg-gray-500 rounded-full" />
          <div>
            <p>{user?.name}</p>
            <p className="text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
