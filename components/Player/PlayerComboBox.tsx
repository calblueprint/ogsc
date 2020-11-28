import React, { useEffect, useRef, useState } from "react";
import { useCombobox } from "downshift";
import { User } from "@prisma/client";
import debounce from "lodash.debounce";
import Card from "components/Card";
import PlayerFormField from "components/PlayerFormField";

const getInputPlayers = async (
  inputValue: string | undefined
): Promise<User[]> => {
  try {
    const apiLink = `/api/admin/users/search/${inputValue}`;
    const response = await fetch(apiLink);
    const data = await response.json();
    return data.users.map((player: User) => player);
  } catch (err) {
    throw new Error(err.message);
  }
};
type Props = React.PropsWithChildren<{
  selectedPlayer: User | null;
  setSelectedPlayer: React.Dispatch<React.SetStateAction<User | null>>;
  setPlayerID: React.Dispatch<React.SetStateAction<number>>;
}>;

const Combobox: React.FC<Props> = ({
  selectedPlayer,
  setSelectedPlayer,
  setPlayerID,
}: Props) => {
  const [inputPlayers, setInputPlayers] = useState<User[]>([]);
  const [dropState, setDropState] = useState<boolean>(false);
  const input = useRef<HTMLInputElement | null>(null);
  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
    reset,
  } = useCombobox({
    isOpen: dropState,
    items: inputPlayers,
    onInputValueChange: debounce(async ({ inputValue }) => {
      setInputPlayers(await getInputPlayers(inputValue));
    }, 300),
  });

  function clearSelectedPlayer(): void {
    setSelectedPlayer(null);
    reset();
  }

  const preFilledForm = (
    <div>
      {selectedPlayer && (
        <div>
          <Card
            text={selectedPlayer?.name}
            onDelete={() => clearSelectedPlayer()}
          />
          <PlayerFormField label="First Name" name="firstName">
            <input
              type="text"
              className="input text-sm"
              name="firstName"
              placeholder={selectedPlayer?.name?.split(" ")[0]}
              defaultValue={selectedPlayer?.name?.split(" ")[0]}
            />
          </PlayerFormField>
          <PlayerFormField label="Last Name" name="lastName">
            <input
              type="text"
              className="input text-sm"
              name="lastName"
              placeholder={selectedPlayer?.name?.split(" ")[1]}
              defaultValue={selectedPlayer?.name?.split(" ")[1]}
            />
          </PlayerFormField>
          <PlayerFormField label="Email Address" name="email">
            <input
              type="text"
              className="input text-sm"
              name="email"
              placeholder={selectedPlayer?.email}
              defaultValue={selectedPlayer?.email}
            />
          </PlayerFormField>
          <PlayerFormField label="Phone Number" name="phoneNumber">
            <input
              type="text"
              className="input text-sm"
              name="phoneNumber"
              placeholder={
                selectedPlayer?.phoneNumber
                  ? selectedPlayer?.phoneNumber
                  : "N/A"
              }
              defaultValue={
                selectedPlayer?.phoneNumber
                  ? selectedPlayer?.phoneNumber
                  : undefined
              }
            />
          </PlayerFormField>
          {setPlayerID(selectedPlayer?.id)}
        </div>
      )}
    </div>
  );

  useEffect(() => {
    async function fetchData(): Promise<void> {
      input.current?.focus();
      setInputPlayers(await getInputPlayers("  "));
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedItem) {
      setSelectedPlayer(selectedItem);
      setPlayerID(selectedItem.id);
    }
  }, [selectedItem, setSelectedPlayer, setPlayerID]);

  return (
    <div className="container  w-4/5 mt-3">
      <div className="relative">
        {selectedPlayer && selectedPlayer !== null ? preFilledForm : null}
        <div>
          <div {...getComboboxProps()}>
            <input
              placeholder="Search for a player member"
              {...getInputProps({
                ref: input,
                onBlur: () => setDropState(false),
                onChange: () => {
                  setDropState(true);
                },
              })}
              className={`w-1/3 text-base form-input leading-10 border border-border rounded-lg ${
                selectedPlayer ? "hidden" : ""
              }`}
            />
          </div>
          <ul
            {...getMenuProps()}
            className={`absolute w-1/3 bg-white border border-b-0 rounded-sm mt-2 ${
              !isOpen ? "hidden" : ""
            }`}
          >
            {isOpen &&
              inputPlayers.map((item: User, index: number) => (
                <li
                  className={`${
                    highlightedIndex === index ? "bg-lightBlue" : ""
                  } px-3 py-2 border-b`}
                  key={`${item.name}`}
                  {...getItemProps({
                    item,
                    index,
                    onMouseDown: (event: React.MouseEvent) =>
                      event.preventDefault(),
                  })}
                >
                  {item.name}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Combobox;
