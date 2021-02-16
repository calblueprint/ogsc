import Link from "next/link";
import useSessionInfo from "utils/useSessionInfo";
import PageNav from "components/PageNav";
import { IPlayer } from "interfaces";
import usePagination from "./pagination";

interface ReadManyPlayersDTO {
  users: IPlayer[];
  total: number;
}

type SearchProps = {
  phrase: string;
};

const PlayerDashboardItem: React.FunctionComponent<IPlayer> = ({
  name,
  profile,
  id,
  image,
}) => {
  const session = useSessionInfo();
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
          <p className="self-center font-normal">
            {/* TODO: Replace with TeamName once added to profile */}
            {profile?.PlayerNumber?.current}
          </p>
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
        <PlayerDashboardItem {...player} />
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
