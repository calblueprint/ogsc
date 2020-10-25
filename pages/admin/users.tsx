import DashboardLayout from "components/DashboardLayout";
import { useState } from "react";

const AdminNavbar: React.FunctionComponent = () => {
  const [title, setTitle] = useState("All Users");
  const Button = (category: string): unknown => {
    return (
      <button
        type="button"
        className={
          title === category
            ? "bg-gray-200 py-3 px-8 rounded-full font-bold tracking-wide"
            : "py-3 px-8 rounded-full text-gray-500 tracking-wide"
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
        <div className="player-info grid grid-rows-1">
          <p className="pt-6 text-3xl font-display font-medium">All Users</p>
        </div>
      </div>
      {AdminNavbar({})}
      <hr />
    </div>
  </DashboardLayout>
);

export default AdminView;
