import Link from "next/link";
import React, { useEffect, useState } from "react";
import { DefaultRole } from "interfaces/user";

interface PendingInvites {
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  image: string | null;
  id: number;
  defaultRole: DefaultRole;
}

const PendingInvitesItem: React.FunctionComponent<PendingInvites> = ({
  name,
  email,
  phoneNumber,
  createdAt,
  updatedAt,
  image,
  id,
  defaultRole,
}) => {
  return (
    <div className="hover:bg-placeholder">
      <hr className="border-unselected border-opacity-50" />
      <div className="col-span-2">
        <Link href={`invite/${id}`}>
          <div className="grid grid-cols-4 gap-5 justify-items-start m-5 font-display items-center py-3 text-sm">
            <div className="flex flex-row">
              <div className="w-10 h-10 mr-4 rounded-full">
                <img src={image || "/placeholder-profile.png"} alt="" />
              </div>
              <div className="w-40">
                <p className="font-semibold">{name}</p>
                <p>{defaultRole.type}</p>
              </div>
            </div>
            <div>
              <p className="self-center font-normal">{email}</p>
            </div>
            <div>
              <p className="self-center font-normal ml-3">{phoneNumber}</p>
            </div>
            <div className="ml-5">
              {createdAt
                .substring(0, 19)
                .localeCompare(updatedAt.substring(0, 19)) === 0 ? (
                <p className="self-center font-normal">
                  Created {new Date(createdAt).toLocaleDateString()}
                </p>
              ) : (
                <p className="self-center font-normal">
                  Modified {new Date(updatedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </Link>
      </div>
      <img src="" alt="" />
    </div>
  );
};

const PendingInvitesTable: React.FunctionComponent = () => {
  const [users, setUsers] = useState<PendingInvites[]>();

  const getUsers = async (): Promise<void> => {
    try {
      const response = await fetch("/api/admin/users/?user_unaccepted=true", {
        method: "GET",
        headers: { "content-type": "application/json" },
        redirect: "follow",
      });
      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      throw new Error(err.message);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div>
      <div className="text-3xl font-display font-medium mb-10">
        <div className="mx-0 mt-0">
          <p className="text-xl font-semibold mx-0 mt-20">
            Your Pending Invites
          </p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-5 justify-items-start mt-5 ml-5 font-semibold text-unselected text-sm">
        <p>Name</p>
        <p>Email</p>
        <p>Phone</p>
        <p>Date Created/Modified</p>
        <hr className="border-unselected border-opacity-50" />
      </div>
      {users?.length ? (
        users?.map((user) => (
          <PendingInvitesItem
            name={user.name}
            email={user.email}
            phoneNumber={user.phoneNumber}
            image={user.image}
            id={user.id}
            createdAt={user.createdAt}
            updatedAt={user.updatedAt}
            defaultRole={user.defaultRole}
          />
        ))
      ) : (
        <div className="m-5 text-sm text-unselected">
          No pending invites at the moment!
        </div>
      )}
    </div>
  );
};

export default PendingInvitesTable;
