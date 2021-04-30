import { UserRoleType } from "@prisma/client";
import React, { useEffect, useRef, useState } from "react";
import { useCombobox } from "downshift";
import debounce from "lodash.debounce";
import { IUser, UserRoleLabel } from "interfaces";
import Button from "./Button";
import Card from "./Card";

const getInputPlayers = async (
  inputValue: string | undefined,
  selectedPlayers: IUser[],
  onlyWithoutProfiles = false
): Promise<IUser[]> => {
  try {
    const apiLink = `/api/players/search?phrase=${inputValue}&relatedPlayerIds=${null}${
      onlyWithoutProfiles ? "&onlyWithoutProfiles=1" : ""
    }`;
    const response = await fetch(apiLink);
    const data = await response.json();
    return data.users.filter(
      (player: IUser) => !selectedPlayers.some(({ id }) => id === player.id)
    );
  } catch (err) {
    throw new Error(err.message);
  }
};

type Props = React.PropsWithChildren<{
  selectedPlayers: IUser[];
  role?: string;
  setSelectedPlayers: React.Dispatch<React.SetStateAction<IUser[]>>;
  promptOff?: boolean;
  singleSelect?: boolean;
  onlyWithoutProfiles?: boolean;
  callback?: () => void;
}>;

const Combobox: React.FC<Props> = ({
  selectedPlayers,
  setSelectedPlayers,
  role,
  promptOff,
  singleSelect,
  onlyWithoutProfiles,
  callback,
}: Props) => {
  const [inputPlayers, setInputPlayers] = useState<IUser[]>([]);
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
    reset,
  } = useCombobox({
    isOpen: focused,
    items: inputPlayers,
    onInputValueChange: debounce(async ({ inputValue }) => {
      if (callback) callback();
      setInputPlayers(
        await getInputPlayers(inputValue, selectedPlayers, onlyWithoutProfiles)
      );
    }, 300),
  });

  useEffect(() => {
    async function fetchData(): Promise<void> {
      if (focused) {
        input.current?.focus();
        setInputPlayers(
          await getInputPlayers(" ", selectedPlayers, onlyWithoutProfiles)
        );
      } else {
        input.current?.blur();
        setQuery("");
      }
    }
    fetchData();
  }, [focused, onlyWithoutProfiles, selectedPlayers]);

  useEffect(() => {
    if (selectedItem) {
      setSelectedPlayers(() => [...selectedPlayers, selectedItem]);
      setFocused(false);
      setQuery("");
      reset();
    }
  }, [reset, selectedItem, selectedPlayers, setSelectedPlayers]);

  const onDelete = (user: IUser): void => {
    if (callback) callback();
    setSelectedPlayers(
      selectedPlayers.filter(
        (selectedPlayer: IUser) => selectedPlayer.id !== user.id
      )
    );
  };

  return (
    <div>
      <div className="container w-full mt-3">
        <div className="relative">
          {!promptOff && (
            <p className={`text-xs font-normal mt-3 mb-3 `}>
              {(() => {
                switch (role) {
                  case UserRoleLabel[UserRoleType.Mentor]:
                    return "Mentors will have access to the full profile of players they are mentoring, including Engagement Scores, Academics, Attendance, and Physical Health information.";
                  case UserRoleLabel[UserRoleType.Parent]:
                    return "Parents will have access to the full profile of their children, including Engagement Scores, Academics, Attendance, and Physical Health information.";
                  case UserRoleLabel[UserRoleType.Donor]:
                    return "Donors will have access to extended profiles of players they’re sponsoring, including Engagement Scores, Academics, and Physical Health information.";
                  default:
                    return "error";
                }
              })()}
            </p>
          )}
          <div className="max-w-sm">
            {selectedPlayers.map((user) => (
              <Card
                key={user.id}
                text={user.name}
                onDelete={() => onDelete(user)}
                maxSize
              />
            ))}
          </div>
          <div className="max-w-lg relative">
            <div {...getComboboxProps()}>
              {(!singleSelect || selectedPlayers.length === 0) && (
                <>
                  <Button
                    iconType="plus"
                    className={` ${focused ? "hidden" : ""}`}
                    onClick={() => setFocused(true)}
                  >
                    Add player{!singleSelect ? "s" : ""}
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
                    className={`w-full text-base form-input leading-10 px-4 border-2 border-medium-gray rounded-md rounded-b-none focus:outline-none ${
                      !focused ? "hidden" : ""
                    }`}
                  />
                </>
              )}
            </div>
            <ul
              {...getMenuProps()}
              className={`absolute z-10 w-full bg-white border-medium-gray border-2 rounded-md rounded-t-none border-t-0 overflow-scroll mt-2 ${
                !isOpen ? "hidden" : ""
              }`}
              style={{ top: "calc(100% - 8px)", maxHeight: "16rem" }}
            >
              {inputPlayers.length > 0 ? (
                inputPlayers.map((item: IUser, index: number) => (
                  <li
                    className={`${
                      highlightedIndex === index ? "bg-blue-muted" : ""
                    } px-3 py-2 border-medium-gray font-medium ${
                      index > 0 && "border-t"
                    }`}
                    key={item.id}
                    {...getItemProps({
                      item,
                      index,
                      onMouseDown: (event: React.MouseEvent) =>
                        event.preventDefault(),
                    })}
                  >
                    {item.name}
                  </li>
                ))
              ) : (
                <p className="text-center text-medium-gray text-sm my-4 opacity-75">
                  No players found
                </p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Combobox;
