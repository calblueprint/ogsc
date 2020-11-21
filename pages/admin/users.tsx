import DashboardLayout from "components/DashboardLayout";
import UserDashboard from "components/UserDashboard";
import { useState } from "react";

interface adminNavBarProps {
  title: string;
  setTitle: (title: string) => void;
}

const AdminNavbar: React.FunctionComponent<adminNavBarProps> = ({
  title,
  setTitle,
}) => {
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
const AdminView: React.FunctionComponent = () => {
  const [title, setTitle] = useState("All Roles");

  return (
    <DashboardLayout>
      <div className="flex mt-24 flex-wrap flex-col mx-16">
        <div className="header flex">
          <p className="text-2xl font-semibold">Members</p>
        </div>
        <AdminNavbar title={title} setTitle={setTitle} />
        <hr className="border-unselected border-opacity-50" />
        <UserDashboard userRole={title} />
      </div>
    </DashboardLayout>
  );
};

export default AdminView;
