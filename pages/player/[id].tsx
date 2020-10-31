import { useState, useEffect } from "react";
import { Player } from "@prisma/client";
import DashboardLayout from "components/DashboardLayout";
import PlayerNavBar from "pages/player/PlayerNavBar";
import { useRouter } from "next/router";

interface playerProp {
  playerProp: Player | undefined;
}

const GetID = (): string | string[] | undefined => {
  const router = useRouter();
  const { id } = router.query;
  return id;
};

const PlayerProfile: React.FunctionComponent = () => {
  const [player, setPlayer] = useState<Player>();
  const ID = GetID();
  useEffect(() => {
    async function getPlayer(): Promise<void> {
      try {
        const response = await fetch(
          `http://localhost:3000/api/players/read/${ID}`,
          {
            method: "GET",
            headers: { "content-type": "application/json" },
          }
        );
        const player1: Player = await response.json();
        setPlayer(player1);
      } catch (err) {
        throw new Error(err.message);
      }
    }

    getPlayer();
  }, [ID]);
  const playerPerson: playerProp = {
    playerProp: player,
  };

  return (
    <DashboardLayout>
      <div className="flex mt-20 flex-wrap space-y-6 flex-col mx-16">
        <div className="header flex">
          <div className="picture flex mr-10">
            <img
              src="/reference to pic"
              alt="..."
              className="shadow rounded-full max-w-full align-middle border-none w-24 h-24"
            />
          </div>
          <div className="player-info grid grid-rows-2">
            <p className="pt-6 text-xl font-display font-medium">Player Name</p>
            <p className="pt-2 text-sm font-display font-medium">
              #{player?.user_id}
            </p>
          </div>
        </div>
        {PlayerNavBar(playerPerson)}
      </div>
    </DashboardLayout>
  );
};

export default PlayerProfile;
