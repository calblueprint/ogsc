import { useState, useEffect } from "react";
import Link from "next/link";

interface Player {
  name: string;
  team: string;
  id: string;
  image: string;
}

type SearchProps = {
  phrase: string;
};

const PlayerDashboardItem: React.FunctionComponent<Player> = ({
  name,
  team,
  id,
  image,
}) => {
  const link = `/player/${id}`;
  return (
    <Link href={link}>
      <div role="button">
        <div className="grid grid-cols-3 gap-12 justify-items-start m-5">
          <div className="flex flex-row">
            <div className="w-10 h-10 mr-4 bg-placeholder rounded-full">
              <img src={image} alt="" />{" "}
              {/* Not being used right now because seed data doesn't have images */}
            </div>
            <p className="font-display self-center">{name}</p>
          </div>
          <p className="self-center font-normal">#{id}</p>
          <p className="self-center font-normal">{team || "Fifa"}</p>
        </div>
        <hr className="border-unselected border-opacity-50" />
      </div>
    </Link>
  );
};

const PlayerDashboard: React.FunctionComponent<SearchProps> = ({
  phrase,
}: SearchProps) => {
  const [players, setPlayers] = useState<Player[]>();

  useEffect(() => {
    const getPlayers = async (): Promise<void> => {
      try {
        const apiLink = `http://localhost:3000/api/admin/users/search/${phrase}`;
        const response = await fetch(apiLink);
        const data = await response.json();
        setPlayers(data.users);
      } catch (err) {
        throw new Error(err.message);
      }
    };
    getPlayers();
  }, [phrase]);
  return (
    <div>
      <div>
        <div className="grid grid-cols-3 gap-12 justify-items-start m-5 font-display text-unselected">
          <p>Name</p>
          <p>Player #</p>
          <p>Team</p>
        </div>
      </div>
      <hr className="border-unselected border-opacity-50 m-4" />
      {players?.slice(0, 7).map((player) => (
        <PlayerDashboardItem
          name={player.name}
          team={player.team}
          image={player.image}
          id={player.id}
        />
      ))}
    </div>
  );
};

export default PlayerDashboard;
