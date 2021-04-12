import { UserRoleType } from "@prisma/client";
import React, { useEffect, useRef, useState } from "react";
import { useCombobox } from "downshift";
import debounce from "lodash.debounce";
import { IUser, UserRoleLabel } from "interfaces";
import Button from "./Button";
import Card from "./Card";

const getInputPlayers = async (
  inputValue: string | undefined,
  selectedPlayers: IUser[]
): Promise<IUser[]> => {
  try {
    const apiLink = `/api/players/search?phrase=${inputValue}&relatedPlayerIds=${null}`;
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
}>;

const Combobox: React.FC<Props> = ({
  selectedPlayers,
  setSelectedPlayers,
  role,
  promptOff,
  singleSelect,
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
      setInputPlayers(await getInputPlayers(inputValue, selectedPlayers));
    }, 300),
  });

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
      reset();
    }
  }, [reset, selectedItem, selectedPlayers, setSelectedPlayers]);

  const onDelete = (user: IUser): void => {
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
          {selectedPlayers.map((user) => (
            <Card
              text={user.name}
              onDelete={() => onDelete(user)}
              maxSize={promptOff}
            />
          ))}

          <div>
            <div {...getComboboxProps()}>
              {!singleSelect ||
                (selectedPlayers.length === 0 && (
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
                        onChange: (
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => setQuery(event.target.value),
                      })}
                      className={`w-full text-base form-input leading-10 border border-border rounded-lg ${
                        !focused ? "hidden" : ""
                      }`}
                    />
                  </>
                ))}
            </div>
            <ul
              {...getMenuProps()}
              className={`absolute w-full bg-white border border-b-0 rounded-sm mt-2 ${
                !isOpen ? "hidden" : ""
              }`}
            >
              {isOpen &&
                inputPlayers.map((item: IUser, index: number) => (
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
    </div>
  );
};

export default Combobox;
