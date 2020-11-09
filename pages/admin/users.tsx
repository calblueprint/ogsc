import DashboardLayout from "components/DashboardLayout";
import UserDashboard from "components/UserDashboard";
import { useState } from "react";

const AdminNavbar: React.FunctionComponent = () => {
  const [title, setTitle] = useState("Members");

  return (
    <div>
      <div className="flex flex-row justify-between text-sm text-center mt-8 mb-5">
        {["All Roles", "Admin", "Players", "Mentors", "Donors", "Parents"].map(
          (category: string) => (
            <button
              key={category}
              type="button"
              className={`navigation-tab
          ${title === category ? "navigation-tab-highlighted" : ""}`}
              onClick={() => {
                setTitle(category);
              }}
            >
              {category}
            </button>
          )
        )}
      </div>
      {/* TODO: Need to add dashboard components corresponding to each tab here */}
    </div>
  );
};

// TODO: Responsive Spacing
const AdminView: React.FunctionComponent = () => (
  <DashboardLayout>
    <div className="flex mt-24 flex-wrap flex-col mx-16">
      <div className="header flex">
        <p className="text-2xl font-semibold">Members</p>
      </div>
      <AdminNavbar />
      <hr className="border-unselected border-opacity-50" />
      <UserDashboard />
    </div>
  </DashboardLayout>
);

export default AdminView;
