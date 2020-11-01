import { useEffect, useState } from "react";
import DeclineButton from "components/declineButton";
import AcceptButton from "components/acceptButton";

const UserRequestDashboardItem: React.FunctionComponent<User> = ({
  name,
  email,
  phoneNumber,
}) => {
  return (
    <div className="d-flex flex-row">
      <div className="flex flex-row justify-between text-sm text-center">
        <div className="d-flex flex-column">{name}</div>
        <div className="d-flex flex-column">{email}</div>
        <div className="d-flex flex-column">{phoneNumber}</div>
        <div className="flex flex-column">
          <DeclineButton />
        </div>
        <div className="d-flex flex-column">
          <AcceptButton />
        </div>
      </div>
      <hr className="border-unselected border-opacity-50" />
    </div>
  );
};
interface User {
  name: string;
  email: string;
  image: string;
  phoneNumber: string;
}

const UserDashboard: React.FunctionComponent = () => {
  const [users, setUsers] = useState<User[]>();

  const getUsers = async (pageNumber: number): Promise<void> => {
    try {
      const response = await fetch("http://localhost:3000/api/admin/users", {
        method: "GET",
        query: pageNumber,
        headers: { "content-type": "application/json" },
        redirect: "follow",
      });
      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      throw new Error(err.message);
    }
  };
  const pages = 1;
  useEffect(() => {
    getUsers(pages);
  }, [pages]);
  return (
    <div>
      <div className="flex flex-row justify-between">
        <p>Name</p>
        <div className="flex flex-column">Email</div>
        <p>Phone</p>
      </div>
      <hr className="border-unselected border-opacity-50" />
      {/* {UserDashboardItem({})} */}
      <img src="" alt="" />
      {users?.map((user) => (
        <UserRequestDashboardItem
          name={user.name}
          email={user.email}
          image={user.image}
          phoneNumber={user.phoneNumber}
        />
      ))}
    </div>
  );
};

const AdminNavbar: React.FunctionComponent = () => {
  const [title, setTitle] = useState("All Users");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const Button = (category: string): unknown => {
    return (
      <button
        type="button"
        className={
          title === category
            ? "bg-button py-3 px-8 rounded-full font-bold tracking-wide"
            : "py-3 px-8 rounded-full text-unselected tracking-wide"
        }
        onClick={() => {
          setTitle(category);
        }}
      >
        {category}
      </button>
    );
  };
};

const AdminView: React.FunctionComponent = () => (
  <div className="flex mt-20 flex-wrap space-y-6 flex-col mx-16">
    <div className="header flex">
      <div className="player-info grid grid-rows-1">
        <p className="pt-6 text-3xl font-display font-medium">User Requests</p>
      </div>
    </div>
    {AdminNavbar({})}
    <hr className="border-unselected border-opacity-50" />
    {UserDashboard({})}
  </div>
);
export default AdminView;
