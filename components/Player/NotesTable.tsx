import { Notes } from "@prisma/client";
import Button from "components/Button";
import { ReadManyNotesDTO } from "pages/api/notes/readMany";
import React, { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import Icon from "components/Icon";

interface Category {
  color: string;
  enabled: boolean;
}

const CATEGORIES = {
  General: "blue-muted",
  Soccer: "purple-muted",
  Academics: "pink-muted",
  Mentorship: "gold-muted",
};

const Note: React.FunctionComponent<{ note: Notes }> = ({
  // eslint-disable-next-line camelcase
  note: { created_at, content, authorId, type },
}) => {
  return (
    <div className=" grid grid-rows-3 grid-cols-3 text-sm max-h-56 border-opacity-50 border-b">
      <text
        className={`row-span-3 col-start-1 h-4 text-xs w-1/6 text-center rounded-full font-medium text-dark bg-${
          CATEGORIES[
            (type.charAt(0).toUpperCase() +
              type.slice(1)) as keyof typeof CATEGORIES
          ]
        } mt-10`}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </text>
      <div className="row-span-2 inline-flex pt-4 col-start-1">
        <div className="w-10 h-10 mr-4 bg-placeholder rounded-full">
          <img src="/placeholder-profile.png" alt="" />
        </div>
        <div>
          <p className="font-semibold">{authorId}</p>
          <p>
            {created_at.toLocaleString("default", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
      <p className="self-center row-span-1 text-sm pt-3 mb-10 col-start-1">
        {content}
      </p>
    </div>
  );
};

type Props = React.PropsWithChildren<{
  userId: number | undefined;
  defaultNotes: Notes[];
}>;

const NotesTable: React.FC<Props> = ({ userId, defaultNotes }) => {
  const [phrase, setPhrase] = useState<string>(" ");
  const [notes, setNotes] = useState<Notes[]>(defaultNotes);

  useEffect(() => {
    const getNotes = async (): Promise<Notes[]> => {
      const response = await fetch(
        `/api/notes/readMany?id=${userId}&search=${phrase}`,
        {
          method: "GET",
          headers: { "content-type": "application/json" },
          redirect: "follow",
        }
      );
      const data = (await response.json()) as ReadManyNotesDTO;
      return data.notes.map<Notes>((note) => {
        return {
          ...note,
          created_at: new Date(note.created_at),
        };
      });
    };
    async function fetchData(): Promise<void> {
      setNotes(await getNotes());
    }
    fetchData();
  }, [phrase, userId]);

  const [categoryToggles, setCategoryToggles] = useState<
    Record<string, Category>
  >(
    Object.keys(CATEGORIES).reduce<Record<string, Category>>(
      (obj, categoryName) => {
        return {
          ...obj,
          [categoryName]: {
            color: CATEGORIES[categoryName as keyof typeof CATEGORIES],
            enabled: true,
          },
        };
      },
      {}
    )
  );

  const toggleCategory = (categoryName: string): void => {
    setCategoryToggles({
      ...categoryToggles,
      [categoryName]: {
        ...categoryToggles[categoryName],
        enabled: !categoryToggles[categoryName].enabled,
      },
    });
  };

  const [selectedOption, setSelectedOption] = useState<
    "Oldest First" | "Newest First"
  >("Newest First");

  const sortAscending = (allNotes: Notes[]): Notes[] =>
    allNotes.sort(
      (note1: Notes, note2: Notes) =>
        note1.created_at.getTime() - note2.created_at.getTime()
    );
  const sortFn =
    selectedOption === "Oldest First"
      ? sortAscending
      : (allNotes: Notes[]): Notes[] => sortAscending(allNotes).reverse();

  return (
    <div>
      <div className="flex flex-row mt-8">
        <div className="text-gray-600 w-4/6 pr-12">
          <Icon type="search" className="absolute ml-4 mt-3" />
          <input
            className="pl-12 border-2 border-gray-300 bg-white h-10 rounded-full text-sm focus:outline-none w-full pr-4"
            type="search"
            name="search"
            placeholder="Search notes"
            onChange={(event) => setPhrase(event.target.value)}
          />
        </div>
        <Button
          className="font-display text-sm px-6 bg-blue-muted text-blue rounded-full h-10 mr-5"
          iconType="plus"
        >
          Add Note
        </Button>
        <>
          <Menu>
            {({ open }) => (
              <>
                <Menu.Button
                  className={`button button-normal text-sm rounded-full focus:outline-none mr-4 ${
                    open
                      ? "bg-dark text-white"
                      : "bg-button text-dark hover:opacity-75"
                  }`}
                >
                  <Icon
                    type={open ? "sortWhite" : "sort"}
                    className="h-4 mr-5"
                  />
                  <p>Sort</p>
                </Menu.Button>
                <Transition show={open}>
                  <Menu.Items
                    className="absolute right-0 mr-56 mt-24 border-medium-gray shadow-lg bg-white rounded-md focus:outline-none flex flex-col text-unselected font-semibold text-sm w-36"
                    style={{ borderWidth: 1, transform: "translateY(-32px)" }}
                    static
                  >
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button"
                          className={`flex items-center w-full px-4 py-2 font-medium ${
                            active || selectedOption === "Oldest First"
                              ? "bg-button text-dark"
                              : ""
                          }`}
                          onClick={() => {
                            setSelectedOption("Oldest First");
                          }}
                        >
                          <p className="justify-self-start">Oldest First</p>
                          {selectedOption === "Oldest First" ? (
                            <Icon type="selected" className="h-4 mr-1 ml-4" />
                          ) : (
                            []
                          )}
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button"
                          className={`flex items-center w-full px-4 py-2 rounded-b-md font-medium ${
                            active || selectedOption === "Newest First"
                              ? "bg-button text-dark"
                              : ""
                          }`}
                          onClick={() => {
                            setSelectedOption("Newest First");
                          }}
                        >
                          <p className="justify-self-start">Newest First</p>
                          {selectedOption === "Newest First" ? (
                            <Icon type="selected" className="h-4 mr-1 ml-4" />
                          ) : (
                            []
                          )}
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>

          <>
            <Menu>
              {({ open }) => (
                <>
                  <Menu.Button
                    className={`button button-normal text-sm rounded-full focus:outline-none ${
                      open
                        ? "bg-dark text-white"
                        : "bg-button text-dark hover:opacity-75"
                    }`}
                  >
                    <Icon
                      type={open ? "filterWhite" : "filter"}
                      className="h-4 mr-5"
                    />
                    <p>Filter</p>
                  </Menu.Button>
                  <Transition
                    show={open}
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items
                      className="absolute right-0 mr-32 mt-24 border-medium-gray shadow-lg bg-white rounded-md pt-12 focus:outline-none flex flex-col text-unselected font-semibold text-sm w-36"
                      style={{ borderWidth: 1, transform: "translateY(-32px)" }}
                      static
                    >
                      <p className="h-5 ml-4 -mt-10 fill-current text-dark-gray text-xs">
                        Category
                      </p>
                      {Object.keys(categoryToggles).map((categoryName) => (
                        <button
                          type="button"
                          className="flex items-center w-full px-4 py-2 font-medium focus:outline-none hover:bg-button hover:text-dark"
                          onClick={() => {
                            toggleCategory(categoryName);
                          }}
                        >
                          <Icon
                            type="selected"
                            className={`h-4 mr-3 ${
                              categoryToggles[categoryName].enabled
                                ? ""
                                : "opacity-0"
                            }`}
                          />
                          <p
                            className={`justify-self-start text-xs text-center rounded-full font-medium text-dark bg-${categoryToggles[categoryName].color} px-2`}
                          >
                            {categoryName}
                          </p>
                        </button>
                      ))}
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>
          </>
        </>
      </div>
      <img src="" alt="" />
      {sortFn(notes)
        .filter(
          (note: Notes) =>
            categoryToggles[
              note.type.charAt(0).toUpperCase() + note.type.slice(1)
            ].enabled
        )
        .map((note: Notes) => (
          <Note note={note} />
        ))}
    </div>
  );
};

export default NotesTable;
