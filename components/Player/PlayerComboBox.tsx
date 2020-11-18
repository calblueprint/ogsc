import React, { useEffect, useRef, useState } from "react";
import { useCombobox } from "downshift";
import { User } from "@prisma/client";
import debounce from "lodash.debounce";

const getInputPlayers = async (
  inputValue: string | undefined
): Promise<string[]> => {
  try {
    const apiLink = `http://localhost:3000/api/admin/users/search/${inputValue}`;
    const response = await fetch(apiLink);
    const data = await response.json();
    return data.users.map((player: User) => player.name);
  } catch (err) {
    throw new Error(err.message);
  }
};

const Combobox: React.FC = () => {
  const [inputPlayers, setInputPlayers] = useState<string[]>([]);
  const [dropState, setDropState] = useState<boolean>(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string>();
  // const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement | null>(null);
  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
    // selectItem,
  } = useCombobox({
    isOpen: dropState,
    items: inputPlayers,
    onInputValueChange: debounce(async ({ inputValue }) => {
      setInputPlayers(await getInputPlayers(inputValue));
    }, 300),
  });

  // TODO: write a removeFromArray function for delete functionality

  useEffect(() => {
    async function fetchData(): Promise<void> {
      input.current?.focus();
      setInputPlayers(await getInputPlayers("  "));
    }
    fetchData();
  }, [selectedPlayer]);

  useEffect(() => {
    if (selectedItem) {
      setSelectedPlayer(selectedItem);
    }
  }, [selectedItem, selectedPlayer]);

  return (
    <div className="container  w-4/5 mt-3">
      <div className="relative">
        <pre className="text-xs">
          selected: {JSON.stringify(selectedPlayer)}
        </pre>

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
              className={`w-2/5 text-base form-input leading-10 border border-border rounded-lg ${
                selectedItem ? "hidden" : ""
              }`}
            />
          </div>
          <ul
            {...getMenuProps()}
            className={`absolute w-1/4 bg-white border border-b-0 rounded-sm mt-2 ${
              !isOpen ? "hidden" : ""
            }`}
          >
            {isOpen &&
              inputPlayers.map((item: string, index: number) => (
                <li
                  className={`${
                    highlightedIndex === index ? "bg-lightBlue" : ""
                  } px-3 py-2 border-b`}
                  key={`${item}`}
                  {...getItemProps({
                    item,
                    index,
                    onMouseDown: (event: React.MouseEvent) =>
                      event.preventDefault(),
                  })}
                >
                  {item}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Combobox;
