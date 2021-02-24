import { useEffect, useState } from "react";
import Button from "components/Button";
import { DeleteUserDTO } from "pages/api/admin/users/delete";
import Link from "next/link";
import { UpdateUserDTO } from "pages/api/admin/users/update";
import { DefaultRole } from "interfaces/user";

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
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          emailVerified: new Date(),
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
      {/* <hr className="border-unselected border-opacity-50" /> */}
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
              className="bg-danger-muted hover:bg-danger-muted text-danger font-bold py-2 px-8 rounded-md"
              onClick={deleteUser}
            >
              Decline
            </Button>
          </div>
          <div className="ml-6">
            <Button
              className="bg-success-muted hover:bg-success-muted text-success font-bold py-2 px-8 rounded-md"
              onClick={acceptUser}
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
  onDelete: () => void;
  onAccept: () => void;
}

const UserDashboard: React.FunctionComponent = () => {
  const [users, setUsers] = useState<UserRequest[]>();

  const getUsers = async (): Promise<void> => {
    try {
      const response = await fetch("/api/admin/users/?unverified=true", {
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
