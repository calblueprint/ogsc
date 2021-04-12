import { UserRoleType, UserStatus } from "@prisma/client";
import DashboardLayout from "components/DashboardLayout";
import UserDashboard from "components/UserDashboard";
// import { UserRoleLabel } from "interfaces/user";
import { useState } from "react";
// import useSessionInfo from "utils/useSessionInfo";

interface adminNavBarProps {
  title: string | null;
  setTitle: (title: UserRoleType | UserStatus | null) => void;
}
interface Dictionary<T> {
  [key: string]: T;
}
/**
 * Pluralized forms of UserRoleType and UserStatus.
 */
const FilterLabels: Dictionary<string> = {
  [UserRoleType.Admin]: "Admins",
  [UserRoleType.Player]: "Players",
  [UserRoleType.Mentor]: "Mentors",
  [UserRoleType.Parent]: "Parents",
  [UserRoleType.Donor]: "Donors",
};

const AdminNavbar: React.FunctionComponent<adminNavBarProps> = ({
  title,
  setTitle,
}) => {
  // const session = useSessionInfo();
  // if (UserRoleLabel[session.sessionType] === "Admin") {
  FilterLabels[UserStatus.Inactive] = "Inactive";
  // }
  return (
    <div>
      <div className="flex flex-row justify-between text-sm text-center mt-8 mb-5">
        <button
          type="button"
          className={`navigation-tab ${
            title === null ? "navigation-tab-highlighted" : ""
          }`}
          onClick={() => setTitle(null)}
        >
          All Users
        </button>
        {Object.keys(FilterLabels).map((role: string) => (
          <button
            key={role}
            type="button"
            className={`navigation-tab ${
              title === role ? "navigation-tab-highlighted" : ""
            }`}
            onClick={() => {
              setTitle(role as UserStatus | UserRoleType);
            }}
          >
            {FilterLabels[role as UserStatus | UserRoleType]}
          </button>
        ))}
      </div>
    </div>
  );
};

// TODO: Responsive Spacing
const AdminView: React.FunctionComponent = () => {
  const [title, setTitle] = useState<UserRoleType | UserStatus | null>(null);
  const [phrase, setPhrase] = useState<string>(" ");

  return (
    <DashboardLayout>
      <div className="flex mt-20 flex-wrap space-y-6 flex-col mx-16">
        <div className="header flex">
          <p className="text-2xl font-semibold">Members</p>
        </div>
        <div className="grid grid-cols-4 gap-8">
          <div className="col-span-3">
            <AdminNavbar title={title} setTitle={setTitle} />
            <hr className="border-unselected border-opacity-50" />
            <UserDashboard filterValue={title} phrase={phrase} />
          </div>
          <div className="mt-1">
            <div className="pt-2 relative mx-auto text-gray-600 col-span-1">
              <input
                className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-full text-sm focus:outline-none"
                type="search"
                name="search"
                placeholder="Search"
                onChange={(event) => setPhrase(event.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminView;
