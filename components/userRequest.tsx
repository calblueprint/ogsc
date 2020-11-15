import { useEffect, useState } from "react";
import Button from "components/Button";
// import DeclineButton from "components/declineButton";
// import AcceptButton from "components/acceptButton";

const UserRequestDashboardItem: React.FunctionComponent<UserRequest> = ({
  name,
  email,
  phoneNumber,
}) => {
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
              <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Decline
              </Button>
            </div>
            <div className="ml-4 ">
              <div>
                <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
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