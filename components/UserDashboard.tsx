import { useState, useEffect } from "react";

interface User {
  name: string;
  email: string;
  image: string;
  phoneNumber: string;
}

const UserDashboardItem: React.FunctionComponent<User> = ({
  name,
  email,
  image,
  phoneNumber,
}) => {
  return (
    <div>
      <div className="flex flex-row justify-between text-sm h-16 items-center">
        <div className="flex flex-row justify-between">
          <div className="w-10 h-10 mr-4 bg-placeholder rounded-full">
            <img src={image} alt="" />{" "}
            {/* Not being used right now because seed data doesn't have images */}
          </div>
          <div className="w-32">
            <p className="font-display">{name}</p>
            <p>User Role</p>
          </div>
        </div>
        <div className="w-56">
          <p>{email}</p>
        </div>
        <p>{phoneNumber}</p>
      </div>
      <hr className="border-unselected border-opacity-50" />
    </div>
  );
};

const UserDashboard: React.FunctionComponent = () => {
  const [users, setUsers] = useState<User[]>();

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
  }, []);
  return (
    <div>
      <div className="flex flex-row justify-between text-sm text-center text-unselected tracking-wide">
        <p>Name</p>
        <p>Email</p>
        <p>Phone</p>
      </div>
      <hr className="border-unselected border-opacity-50" />
      <img src="" alt="" />
      {users?.slice(0, 7).map((user) => (
        <UserDashboardItem
          name={user.name}
          email={user.email}
          image={user.image}
          phoneNumber={user.phoneNumber}
        />
      ))}
    </div>
  );
};

export default UserDashboard;
