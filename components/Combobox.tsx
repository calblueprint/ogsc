import React, { useEffect, useRef, useState } from "react";
import { useCombobox } from "downshift";
import { User } from "@prisma/client";
import Button from "./Button";

// const TEST_DATA = ["apple", "banana", "orange"];

/*
PROBLEMS: 
1) availablePlayers is empty at onInputValueChange
2) useeffect hook error idgi
3) query?
*/

const Combobox: React.FC = () => {
  let availablePlayers: string[] = []; // players that havent been chosen yet
  const [inputPlayers, setInputPlayers] = useState<string[]>(availablePlayers); // players that are shown at the dropdown
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]); // players that have been chosen so far
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const input = useRef<HTMLInputElement | null>(null);
  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    selectedItem, // entry that has been selected
    selectItem, // to reset selectedItem
  } = useCombobox({
    isOpen: focused,
    items: inputPlayers,
    onInputValueChange: ({ inputValue }) => {
      console.log(inputValue);
      console.log(availablePlayers.length);
      setInputPlayers(
        availablePlayers.filter((item) =>
          item.toLowerCase().startsWith(inputValue?.toLowerCase() || "")
        )
      );
    },
  });

  // TODO: write a removeFromArray function for updating players shown after selecting + delete functionality

  // const useMountEffect = (): void => {
  useEffect(() => {
    if (!focused) {
      const getAllPlayers = async (): Promise<void> => {
        try {
          const apiLink = `http://localhost:3000/api/admin/users/search`;
          const response = await fetch(apiLink);
          const data = await response.json();
          availablePlayers = data.users.map((player: User) => player.name);
          for (let i = 0; i < availablePlayers.length; i += 1) {
            console.log(availablePlayers[i]);
          }
          setInputPlayers(availablePlayers);
        } catch (err) {
          throw new Error(err.message);
        }
      };
      getAllPlayers();
    }
  }, [focused]);
  // };
  // useMountEffect();

  useEffect(() => {
    if (focused) {
      input.current?.focus();
    } else {
      input.current?.blur();
    }
  }, [focused]);

  useEffect(() => {
    if (selectedItem) {
      setSelectedPlayers(() => [...selectedPlayers, selectedItem]);
      // TODO: delete selected from availablePlayers
      setFocused(false);
      setQuery("");
      selectItem("");
    }
  }, [selectItem, selectedItem, selectedPlayers]);

  return (
    <div className="container  w-4/5 mt-3">
      <div className="relative">
        <pre className="text-xs">
          selected: {JSON.stringify(selectedPlayers)}
        </pre>

        <div>
          <div {...getComboboxProps()}>
            <Button
              iconType="plus"
              className={` ${focused ? "hidden" : ""}`}
              onClick={() => setFocused(true)}
            >
              Add players
            </Button>
            <input
              placeholder="Search for a player member"
              {...getInputProps({
                ref: input,
                value: query,
                onBlur: () => setFocused(false),
                onFocus: () => setFocused(true),
                onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                  setQuery(event.target.value),
              })}
              className={`w-1/4 text-base form-input leading-10 ${
                !focused ? "hidden" : ""
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
                    highlightedIndex === index
                      ? "bg-blue-600 text-white border-blue-600"
                      : ""
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
