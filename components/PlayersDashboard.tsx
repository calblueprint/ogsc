import Link from "next/link";
import useSessionInfo from "utils/useSessionInfo";
import PageNav from "components/PageNav";
import { IPlayer, UserRoleLabel } from "interfaces";
import Icon from "components/Icon";
import { useState } from "react";
import usePagination from "./pagination";

interface ReadManyPlayersDTO {
  users: IPlayer[];
  total: number;
}

type SearchProps = {
  phrase: string;
};

const PlayerDashboardItem: React.FunctionComponent<
  IPlayer & { relatedPlayerIds: number[] }
> = ({ name, profile, id, image, relatedPlayerIds }) => {
  const session = useSessionInfo();
  const [showHoverPlayer, setShowHoverPlayer] = useState(false);

  const link = `/${session.sessionType.toLowerCase()}/players/${id}`;
  return (
    <Link href={link}>
      <div role="button" className=" hover:bg-hover">
        <hr className="border-unselected border-opacity-50" />
        <div className="grid grid-cols-3 gap-12 justify-items-start m-5">
          <div className="flex flex-row">
            <div className="w-10 h-10 mr-4 bg-placeholder rounded-full">
              <img src={image || "/placeholder-profile.png"} alt="" />
              {/* Not being used right now because seed data doesn't have images */}
            </div>
            <p className="font-semibold self-center">{name}</p>
          </div>
          <p className="self-center font-normal">
            #{profile?.PlayerNumber?.current}
          </p>
          <div className="flex flex-row">
            <p className="self-center font-normal mr-56">
              {/* TODO: Replace with TeamName once added to profile */}
              {profile?.PlayerNumber?.current}
            </p>
            {(UserRoleLabel[session.sessionType] === "Donor" ||
              UserRoleLabel[session.sessionType] === "Mentor" ||
              UserRoleLabel[session.sessionType] === "Parent") &&
            relatedPlayerIds.includes(id) ? (
              <div className="h-12 w-12 self-center">
                <div
                  className="h-12 w-12 absolute"
                  onMouseEnter={() => {
                    setShowHoverPlayer(true);
                  }}
                  onMouseLeave={() => {
                    setShowHoverPlayer(false);
                  }}
                >
                  {showHoverPlayer && (
                    <Icon type="yourPlayer" className="absolute -ml-6 -mt-10" />
                  )}
                </div>
                <Icon type="goldStar" className="ml-5 mt-4 w-4 h-4" />
              </div>
            ) : (
              []
            )}
          </div>
        </div>
        <hr className="border-unselected border-opacity-0" />
      </div>
    </Link>
  );
};

const PlayerDashboard: React.FunctionComponent<SearchProps> = ({
  phrase,
}: SearchProps) => {
  const [
    visibleData,
    numUIPages,
    currUIPage,
    setUIPage,
  ] = usePagination<IPlayer>([phrase], async (pageNumber: number) => {
    const response = await fetch(
      `/api/players/search?pageNumber=${pageNumber}&phrase=${phrase}&role=Player`,
      {
        method: "GET",
        headers: { "content-type": "application/json" },
        redirect: "follow",
      }
    );
    const data = (await response.json()) as ReadManyPlayersDTO;
    return {
      data: data.users,
      count: data.total,
    };
  });

  const session = useSessionInfo();
  const relatedPlayerIds = (session.user.roles || [])
    .map((role) => role.relatedPlayerId)
    .filter(
      (relatedPlayerId): relatedPlayerId is number => relatedPlayerId !== null
    );

  return (
    <div>
      <div>
        <div className="grid grid-cols-3 gap-12 justify-items-start m-5 font-semibold text-unselected">
          <p>Name</p>
          <p>Player #</p>
          <p>Team</p>
        </div>
      </div>
      <hr className="border-unselected border-opacity-0" />
      {visibleData.map((player) => (
        <PlayerDashboardItem {...player} relatedPlayerIds={relatedPlayerIds} />
      ))}
      <PageNav
        currentPage={currUIPage + 1}
        numPages={numUIPages}
        onPrevPage={() => {
          setUIPage(currUIPage - 1);
        }}
        onNextPage={() => {
          setUIPage(currUIPage + 1);
        }}
        prevDisabled={currUIPage <= 0}
        nextDisabled={currUIPage >= numUIPages - 1}
      />
    </div>
  );
};

export default PlayerDashboard;
