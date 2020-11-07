import { User } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { Dropdown } from "semantic-ui-react";

const SearchDropdown: React.FC = () => {
  const [query, setQuery] = useState("");
  const [queriedPlayers, setQueriedPlayers] = useState<
    { key: string; text: string; value: number }[]
  >([]);
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);

  useEffect(() => {
    const getAllPlayers = async (): Promise<void> => {
      try {
        if (query === "") {
          const apiLink = `http://localhost:3000/api/admin/users/search`;
          const response = await fetch(apiLink);
          const data = await response.json();
          setQueriedPlayers(
            data.users.map((player: User) => ({
              key: player.name,
              text: player.name,
              value: player.id,
            }))
          );
        }
      } catch (err) {
        throw new Error(err.message);
      }
    };
    getAllPlayers();
  });

  return (
    <div>
      <Dropdown
        fluid
        button
        multiple
        className="icon"
        labeled
        icon="search"
        options={queriedPlayers}
        search
        text="Search for a player member"
      />
    </div>
  );
};

export default SearchDropdown;
