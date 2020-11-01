import DashboardLayout from "components/DashboardLayout";
import UserDashboard from "components/UserDashboard";
import { useState } from "react";

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
