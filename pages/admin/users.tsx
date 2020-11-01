import DashboardLayout from "components/DashboardLayout";
import { useEffect, useState } from "react";

const UI_PAGE_SIZE = 7;
const BACKEND_PAGE_SIZE = 21;

const getBackendPageNumber = (uiPage: number): number[] => {
  const pageNum = Math.floor((uiPage * UI_PAGE_SIZE) / BACKEND_PAGE_SIZE);
  const startIndex = UI_PAGE_SIZE * (uiPage % 3);
  return [pageNum, startIndex];
};

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
  const [index, setIndex] = useState(0);

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
  const uiPage = 0;
  useEffect(() => {
    const [backendPage, startIndex] = getBackendPageNumber(uiPage);
    getUsers(backendPage);
    setIndex(startIndex);
  }, [uiPage]);
  return (
    <div>
      <div className="flex flex-row justify-between text-sm text-center text-unselected tracking-wide">
        <p>Name</p>
        <p>Email</p>
        <p>Phone</p>
      </div>
      <hr className="border-unselected border-opacity-50" />
      <img src="" alt="" />
      {users?.slice(index, index + UI_PAGE_SIZE).map((user) => (
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

const AdminNavbar: React.FunctionComponent = () => {
  const [title, setTitle] = useState("All Users");
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
  return (
    <div>
      <div className="flex flex-row justify-between text-sm text-center">
        {Button("All Roles")}
        {Button("Admin")}
        {Button("Players")}
        {Button("Mentors")}
        {Button("Donors")}
        {Button("Parents")}
      </div>
      {/* TODO: Need to add dashboard components corresponding to each tab here */}
    </div>
  );
};

const AdminView: React.FunctionComponent = () => (
  <DashboardLayout>
    <div className="flex mt-20 flex-wrap space-y-6 flex-col mx-16">
      <div className="header flex">
        <p className="pt-4 text-2xl font-display font-medium">All Users</p>
      </div>
      {AdminNavbar({})}
      <hr className="border-unselected border-opacity-50" />
      {UserDashboard({})}
    </div>
  </DashboardLayout>
);

export default AdminView;
