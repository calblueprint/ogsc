import { useState } from "react";
import Link from "next/link";
import { UserRoleLabel } from "interfaces/user";
import useSessionInfo from "utils/useSessionInfo";
import { UserRoleType } from "@prisma/client";
import DashboardLayout from "../../../components/DashboardLayout";
import PlayerDashboard from "../../../components/PlayersDashboard";
import Button from "../../../components/Button";

type NavbarProps = {
  filter: boolean;
  setFilter: (tab: boolean) => void;
  numRelatedPlayers: number;
  userType: string;
};

const Navbar: React.FunctionComponent<NavbarProps> = ({
  filter,
  setFilter,
  numRelatedPlayers,
  userType,
}) => {
  return (
    <div>
      <div className="flex flex-row text-sm text-center mt-8 mb-5">
        <button
          type="button"
          className={`navigation-tab  mr-4 ${
            filter === false ? "navigation-tab-highlighted" : ""
          }`}
          onClick={() => setFilter(false)}
        >
          All Players
        </button>

        {userType === "Admin" || userType === "Player" ? (
          []
        ) : (
          <button
            key="Your Players"
            type="button"
            className={`navigation-tab ${
              filter === true ? "navigation-tab-highlighted" : ""
            }`}
            onClick={() => {
              setFilter(true);
            }}
          >
            Your Players ({numRelatedPlayers})
          </button>
        )}
      </div>
    </div>
  );
};

const PlayersListPage: React.FunctionComponent = () => {
  const [phrase, setPhrase] = useState<string>("");
  const [filter, setFilter] = useState<boolean>(false);
  const session = useSessionInfo();
  const relatedPlayerIds = (session.user.roles || [])
    .map((role) => role.relatedPlayerId)
    .filter(
      (relatedPlayerId): relatedPlayerId is number => relatedPlayerId !== null
    );

  return (
    <DashboardLayout>
      <div className="flex mt-20 flex-wrap space-y-6 flex-col mx-16">
        <div className="header flex justify-between">
          <p className="pt-4 text-2xl font-display font-medium">All Players</p>
          {UserRoleLabel[session.sessionType] === "Admin" ? (
            <Link href="/admin/players/playerForm">
              <Button
                className="font-display text-sm px-6 bg-blue-muted text-blue rounded-lg h-10"
                iconType="plus"
              >
                Create new profile
              </Button>
            </Link>
          ) : (
            []
          )}
        </div>
        <div className="grid grid-cols-4 gap-8">
          <div className="col-span-3">
            <Navbar
              filter={filter}
              setFilter={setFilter}
              numRelatedPlayers={relatedPlayerIds.length}
              userType={UserRoleLabel[session.sessionType] as UserRoleType}
            />
            <hr className="border-unselected border-opacity-50" />
            <PlayerDashboard
              isFilterOn={filter}
              phrase={phrase}
              relatedPlayerIds={relatedPlayerIds}
            />
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

export function getServerSideProps(): Record<string, unknown> {
  return {};
}

export default PlayersListPage;
