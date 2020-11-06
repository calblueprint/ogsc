import { useEffect, useState } from "react";
import DeclineButton from "components/declineButton";
import AcceptButton from "components/acceptButton";

const UserRequestDashboardItem: React.FunctionComponent<UserRequest> = ({
  name,
  email,
}) => {
  return (
    <div>
      <div className="flex flex-row justify-between text-sm h-16 items-center">
        <div className="flex flex-row justify-between">
          <div className="w-10 h-10 mr-4 bg-placeholder rounded-full" />
          <div className="w-32">
            <p className="font-display">{name}</p>
            <p>User Role</p>
          </div>
        </div>
        <div className="w-56">
          <p>{email}</p>
        </div>
        <div className="flex flex-row justify-between">
          <DeclineButton />
          <div className="ml-10">
            <AcceptButton />
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
}

const UserDashboard: React.FunctionComponent = () => {
  const [users, setUsers] = useState<UserRequest[]>();

  const getUsers = async (): Promise<void> => {
    try {
      const response = await fetch("http://localhost:3000/api/admin/users", {
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
  });
  return (
    <div>
      <div className="flex flex-row justify-between text-sm text-center text-unselected tracking-wide">
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
        />
      ))}
    </div>
  );
};

const AdminView: React.FunctionComponent = () => (
  <div className="flex mt-20 flex-wrap space-y-6 flex-col mx-16">
    <div className="header flex">
      <div className="player-info grid grid-rows-1">
        <p className="pt-6 text-3xl font-display font-medium">
          Invitation Requests
        </p>
      </div>
    </div>
    <hr className="border-unselected border-opacity-50" />
    {UserDashboard({})}
  </div>
);
export default AdminView;
