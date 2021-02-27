import DashboardLayout from "components/DashboardLayout";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { DeleteUserDTO } from "pages/api/admin/users/delete";
import Combobox from "components/Combobox";
import { User } from "@prisma/client";
import Button from "components/Button";
import { UpdateUserDTO } from "pages/api/admin/users/update";
import { UserRoleType, IUser, UserStatus } from "interfaces";

const UserAccountPage: React.FunctionComponent<UserRequest> = ({
  onAccept,
}) => {
  const router = useRouter();
  const [selectedPlayers, setSelectedPlayers] = useState<User[]>([]);
  const [user, setUser] = useState<IUser>();
  const id = Number(router.query.id);
  useEffect(() => {
    const getUser = async (): Promise<void> => {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "GET",
        headers: { "content-type": "application/json" },
        redirect: "follow",
      });
      const data = await response.json();
      setUser(data.user);
    };
    getUser();
  }, [id]);

  const showCombobox = (): string => {
    return ([
      UserRoleType.Mentor,
      UserRoleType.Parent,
      UserRoleType.Donor,
    ] as UserRoleType[]).includes(user?.defaultRole.type as UserRoleType)
      ? ""
      : "hidden";
  };
  const deleteUser = async (): Promise<void> => {
    try {
      const response = await fetch("/api/admin/users/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id,
        } as DeleteUserDTO),
      });
      if (!response.ok) {
        throw await response.json();
      }
      router.push("../");
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const acceptUser = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(({
          status: UserStatus.Active,
        } as unknown) as UpdateUserDTO),
      });
      if (!response.ok) {
        throw await response.json();
      }
      onAccept();
    } catch (err) {
      throw new Error(err.message);
    }
  };
  return (
    <DashboardLayout>
      <div className="flex-col mx-16 mt-14">
        <div className="mt-5 mb-10">
          <Button
            iconType="back"
            className="bg-white hover:bg-white text-blue font-bold py-2 px-4 rounded border-blue"
            onClick={() => {
              router.push("../");
            }}
          >
            Back to invites
          </Button>
        </div>
        <p className="text-4xl font-semibold">
          Invitation Request for {user?.name}{" "}
        </p>
        <p className="mb-10">Created {user?.createdAt}</p>
        <p className="text-3xl font-semibold mb-10">Basic Information </p>
        <p className="text-1xl">Name</p>
        <p className="mb-10 font-semibold">{user?.name}</p>
        <p className="text-1xl">Email Address</p>
        <p className="mb-10 font-semibold">{user?.email}</p>
        <p className="text-1xl">Phone number</p>
        <p className="mb-10 font-semibold">{user?.phoneNumber}</p>
        <p className="text-1xl">Role</p>
        <p className="mb-10 font-semibold">{user?.defaultRole.type}</p>
        <p className="text-2xl font-semibold mb-10">Attached Note</p>

        <div className={showCombobox()}>
          <p className="text-2xl font-semibold"> Role Information </p>
          <p className="text-1xl font-semibold">Linked Players</p>
          <p className="mb-20">
            {user && (
              <Combobox
                selectedPlayers={selectedPlayers}
                setSelectedPlayers={setSelectedPlayers}
                role={user.defaultRole.type}
              />
            )}
          </p>
        </div>
        <div className="mb-10">
          <hr className="border-unselected border-opacity-50" />
        </div>
        <div className="flex space-x-8 self-center mb-16">
          <div>
            <Button
              className="bg-danger-muted hover:bg-danger-muted text-danger font-bold py-2 px-8 rounded"
              onClick={deleteUser}
            >
              Decline
            </Button>
          </div>
          <div className="ml-4 ">
            <div>
              <Button
                className="bg-success-muted hover:bg-success-muted text-success font-bold py-2 px-8 rounded"
                onClick={acceptUser}
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
interface UserRequest {
  name: string;
  email: string;
  phoneNumber: string;
  Role: string;
  id: number;
  onDelete: () => void;
  onAccept: () => void;
}
export default UserAccountPage;
