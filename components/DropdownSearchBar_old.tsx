import React, { useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Player, PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// const people: string[] = [];
const people = [
  "Wade Cooper",
  "Arlene Mccoy",
  "Devon Webb",
  "Tom Cook",
  "Tanya Fox",
  "Hellen Schmidt",
  "Caroline Schultz",
  "Mason Heaney",
  "Claudie Smitham",
  "Emil Schaefer",
];

// async function getPlayers(): Promise<Player[]> {
//   try {
//     const response = await fetch("/api/admin/users/search/", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify({ pageNumber: 0 }),
//     });
//     if (!response.ok) {
//       throw await response.json();
//     }
//     const data = await response.json();
//     return data.users;
//   } catch (err) {
//     throw new Error("Error fetching players list");
//   }
// }

const DropdownSearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  useEffect(() => {
    const getPlayers = async (): Promise<void> => {
      try {
        if (query === "") {
          return;
        }
        const apiLink = `http://localhost:3000/api/admin/users/search/${query}`;
        const response = await fetch(apiLink);
        const data = await response.json();
        setSelectedPlayers(data.users);
      } catch (err) {
        throw new Error(err.message);
      }
    };
    getPlayers();
  });

  // async function updatePlayers(name: string): Promise<void> {
  //   try {
  //     const response = await fetch("/api/admin/users/search/", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       credentials: "include",
  //       body: JSON.stringify({
  //         phrase: name,
  //       }),
  //     });
  //     if (!response.ok) {
  //       throw await response.json();
  //     }
  //     const data = await response.json();
  //     // setPlayers(await data.users);
  //   } catch (err) {
  //     throw new Error(err.message);
  //   }
  // }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setQuery(e.currentTarget.value);
    // console.log(e.currentTarget.value);
  };

  return (
    <div className="flex ">
      <div className="w-full max-w-xs pt-12">
        <Listbox>
          {({ open }) => (
            <>
              <div className="relative">
                <span className="w-full rounded-md shadow-sm">
                  <Listbox.Button className="relative w-full rounded-md border">
                    <input
                      type="text"
                      placeholder="Search for a player member"
                      value={query}
                      name="name"
                      onClick={() => console.log("clicked")}
                      // onChange={(event) => setQuery(event.target.value)}
                      onChange={(e) => handleChange(e)}
                      className="relative w-full rounded-md border border-gray-300 text-gray-600 bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                    />
                  </Listbox.Button>
                </span>

                <Transition
                  show={open}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  className="absolute mt-1 w-full rounded-md bg-white shadow-lg"
                >
                  <Listbox.Options
                    static
                    className="max-h-60 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5"
                  >
                    {selectedPlayers.map((player) => (
                      <Listbox.Option
                        key={
                          player.user_id
                          // await prisma.user.findOne({
                          //   where: { id: player.user_id },
                          // })
                        }
                        value="test"
                      >
                        {({ selected, active }) => (
                          <div
                            className={`${
                              active
                                ? "text-white bg-blue-600"
                                : "text-gray-900"
                            } cursor-default select-none relative py-2 pl-8 pr-4`}
                          >
                            <span
                              className={`${
                                selected ? "font-semibold" : "font-normal"
                              } block truncate`}
                            >
                              {player}
                            </span>
                            {selected && (
                              <span
                                className={`${
                                  active ? "text-white" : "text-blue-600"
                                } absolute inset-y-0 left-0 flex items-center pl-1.5`}
                              >
                                <svg
                                  className="h-5 w-5"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                            )}
                          </div>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </>
          )}
        </Listbox>
      </div>
    </div>
  );
};

export default DropdownSearchBar;
