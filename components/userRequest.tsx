import { Dialog } from "@headlessui/react";
import { UserStatus } from "@prisma/client";
import React, { useEffect, useState } from "react";
import Button from "components/Button";
import { DeleteUserDTO } from "pages/api/admin/users/delete";
import Link from "next/link";
import { UpdateUserDTO } from "pages/api/admin/users/update";
import { DefaultRole } from "interfaces/user";
import toast from "lib/toast";
import Modal from "./Modal";

const UserRequestDashboardItem: React.FunctionComponent<UserRequest> = ({
  name,
  email,
  phoneNumber,
  id,
  image,
  defaultRole,
  onDelete,
  onAccept,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const toasty = () => toast.success("Account request accepted!");
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
      onDelete();
      setIsDeleting(false);
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
        body: JSON.stringify({ status: UserStatus.Active } as UpdateUserDTO),
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
    <div>
      <Modal
        className="mb-2"
        open={isDeleting}
        onClose={() => setIsDeleting(false)}
      >
        <Dialog.Title className="font-semibold">
          Decline account request?
        </Dialog.Title>
        <p className="mb-6">
          Are you sure you want to decline {name}&apos;s account request?
        </p>
        <div className="mb-2 flex">
          <Button
            className="button-primary px-10 py-2 mr-5"
            onClick={() => {
              deleteUser();
            }}
          >
            Delete
          </Button>
          <Button
            className="button-hollow px-10 py-2"
            onClick={() => {
              setIsDeleting(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </Modal>
      <hr className="border-unselected border-opacity-50" />
      <div className="hover:bg-placeholder grid grid-cols-3">
        <div className="col-span-2">
          <Link href={`invite/userAccountPage/${id}`}>
            <div className="grid grid-cols-3 gap-32 justify-items-start m-5 font-display items-center py-3">
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
                <p className="self-center font-normal">{phoneNumber}</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="flex space-x-8 self-center ml-12">
          <div>
            <Button
              className="bg-danger-muted hover:bg-danger-muted text-danger font-bold py-2 px-8 rounded"
              data-toggle="modal"
              onClick={() => setIsDeleting(true)}
            >
              Decline
            </Button>
          </div>
          <div className="ml-6">
            <Button
              className="bg-success-muted hover:bg-success-muted text-success font-bold py-2 px-8 rounded-md"
              onClick={() => {
                acceptUser();
                toasty();
              }}
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
interface UserRequest {
  name: string;
  email: string;
  phoneNumber: string;
  defaultRole: DefaultRole;
  image: string | null;
  id: number;
  isDeleting: boolean;
  onDelete: () => void;
  onAccept: () => void;
}

const UserDashboard: React.FunctionComponent = () => {
  const [users, setUsers] = useState<UserRequest[]>();

  const getUsers = async (): Promise<void> => {
    try {
      const response = await fetch("/api/admin/users/?admin_unapproved=true", {
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
      <div className="grid grid-cols-4 gap-3 justify-items-start my-5 font-display text-unselected ml-5">
        <p>Name</p>
        <p>Email</p>
        <p>Phone</p>
      </div>
      <img src="" alt="" />
      {users?.map((user) => (
        <UserRequestDashboardItem
          name={user.name}
          email={user.email}
          phoneNumber={user.phoneNumber}
          image={user.image}
          defaultRole={user.defaultRole}
          id={user.id}
          isDeleting={user.isDeleting}
          onDelete={getUsers}
          onAccept={getUsers}
        />
      ))}
    </div>
  );
};

const userRequestsTable: React.FunctionComponent = () => (
  <div className="mx-0 mt-0">
    <div className="text-3xl font-display font-medium mb-10">
      <div className="mx-0 mt-0">
        <p className="text-2xl font-semibold mx-0 mt-0">Invitation Requests</p>
      </div>
    </div>
    {UserDashboard({})}
  </div>
);
export default userRequestsTable;
