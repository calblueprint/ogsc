import { useEffect, useState } from "react";
import Button from "components/Button";
import { DeleteUserDTO } from "pages/api/admin/users/delete";
import { User } from "@prisma/client";

import { UpdateUserDTO } from "pages/api/admin/users/update";
// const prisma = new PrismaClient();
// import DeclineButton from "components/declineButton";
// import AcceptButton from "components/acceptButton";

const UserRequestDashboardItem: React.FunctionComponent<UserRequest> = ({
  name,
  email,
  phoneNumber,
  id,
  onDelete,
  onAccept,
}) => {
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
    } catch (err) {
      throw new Error(err.message);
    }
  };
  const acceptUser = async (): Promise<void> => {
    try {
      const response = await fetch("/api/admin/users/update", {
        method: "UPDATE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          emailVerified: true,
        } as UpdateUserDTO),
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
      <div className="grid grid-cols-4 gap-10 justify-items-start m-5">
        <div className="flex flex-row">
          <div className="w-10 h-10 mr-4 bg-placeholder rounded-full" />
          <div className="w-32">
            <p className="font-display self-center">{name}</p>
            <p>User Role</p>
          </div>
        </div>
        <div>
          <p className="self-center font-normal">{email}</p>
        </div>
        <div>
          <p className="self-center font-normal">{phoneNumber}</p>
        </div>
        <div>
          <div className="flex space-x-4">
            <div>
              <Button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={deleteUser}
              >
                Decline
              </Button>
            </div>
            <div className="ml-4 ">
              <div>
                <Button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={acceptUser}
                >
                  Accept
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="border-unselected border-opacity-50" />
    </div>
  );
};
interface UserRequest {
  name: string;
  email: string;
  phoneNumber: string;
  id: number;
  onDelete: () => void;
  onAccept: () => void;
}

const UserDashboard: React.FunctionComponent = () => {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const [users, setUsers] = useState<UserRequest[]>();

  const getUsers = async (): Promise<void> => {
    try {
      const response = await fetch("http://localhost:3000/api/admin/users", {
        method: "GET",
        headers: { "content-type": "application/json" },
        redirect: "follow",
      });
      const data = await response.json();
      // data.users.filter((player: User) => player.emailVerified);
      setUsers(data.users.filter((player: User) => !player.emailVerified));
    } catch (err) {
      throw new Error(err.message);
    }
  };
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div>
      <div className="grid grid-cols-4 gap-12 justify-items-start m-5 font-display text-unselected">
        <p>Name</p>
        <p>Email</p>
        <p>Phone</p>
      </div>
      <hr className="border-unselected border-opacity-50" />
      <img src="" alt="" />
      {users?.map((user) => (
        <UserRequestDashboardItem
          name={user.name}
          email={user.email}
          phoneNumber={user.phoneNumber}
          id={user.id}
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
        <p className="mx-0 mt-0">Invitation Requests</p>
      </div>
    </div>
    <hr className="border-unselected border-opacity-50" />
    {UserDashboard({})}
  </div>
);
export default userRequestsTable;
