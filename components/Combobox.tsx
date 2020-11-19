import React, { useEffect, useRef, useState } from "react";
import { useCombobox } from "downshift";
import { User } from "@prisma/client";
import debounce from "lodash.debounce";
import Button from "./Button";
import Card from "./Card";

const getInputPlayers = async (
  inputValue: string | undefined,
  selectedPlayers: User[]
): Promise<User[]> => {
  try {
    const apiLink = `http://localhost:3000/api/admin/users/search/${inputValue}`;
    const response = await fetch(apiLink);
    const data = await response.json();
    return (
      data.users
        // .map((player: User) => player.name)
        .filter(function removeSelected(player: User) {
          return !selectedPlayers.includes(player);
        })
    );
  } catch (err) {
    throw new Error(err.message);
  }
};

const Combobox: React.FC = () => {
  const [inputPlayers, setInputPlayers] = useState<User[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<User[]>([]);
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
    selectedItem,
    selectItem,
  } = useCombobox({
    isOpen: focused,
    items: inputPlayers,
    onInputValueChange: debounce(async ({ inputValue }) => {
      setInputPlayers(await getInputPlayers(inputValue, selectedPlayers));
    }, 300),
  });

  // TODO: write a removeFromArray function for delete functionality

  useEffect(() => {
    async function fetchData(): Promise<void> {
      if (focused) {
        input.current?.focus();
        setInputPlayers(await getInputPlayers(" ", selectedPlayers));
      } else {
        input.current?.blur();
        setQuery("");
      }
    }
    fetchData();
  }, [focused, selectedPlayers]);

  useEffect(() => {
    if (selectedItem) {
      setSelectedPlayers(() => [...selectedPlayers, selectedItem]);
      setFocused(false);
      setQuery("");
      selectItem(null);
    }
  }, [selectItem, selectedItem, selectedPlayers]);

  return (
    <div className="container  w-4/5 mt-3">
      <div className="relative">
        {/* <pre className="text-xs">
          selected: {JSON.stringify(selectedPlayers)}
        </pre> */}
        <Card text="hello" onDelete={() => console.log("deleting")} />

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
              className={`w-1/3 text-base form-input leading-10 ${
                !focused ? "hidden" : ""
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
