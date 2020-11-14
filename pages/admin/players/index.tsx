import { useState } from "react";
import Link from "next/link";
import DashboardLayout from "../../../components/DashboardLayout";
import PlayerDashboard from "../../../components/PlayersDashboard";
import Button from "../../../components/Button";

const AdminView: React.FunctionComponent = () => {
  const [phrase, setPhrase] = useState<string>(" ");

  return (
    <DashboardLayout>
      <div className="flex mt-20 flex-wrap space-y-6 flex-col mx-16">
        <div className="header flex justify-between">
          <p className="pt-4 text-2xl font-display font-medium">All Players</p>
          <Link href="/admin/players/playerForm">
            <Button
              className="font-display text-sm px-6 bg-blue-muted text-blue rounded-lg h-10"
              iconType="plus"
            >
              Create new profile
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-8">
          <div className="col-span-3">
            <hr className="border-unselected border-opacity-50" />
            <PlayerDashboard phrase={phrase} />
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
