import { Notes } from "@prisma/client";
import Button from "components/Button";
import { ReadManyNotesDTO } from "pages/api/notes/readMany";
import React, { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import Icon from "components/Icon";

const Note: React.FunctionComponent<{ note: Notes }> = ({
  // eslint-disable-next-line camelcase
  note: { created_at, content, authorId, type },
}) => {
  return (
    <div className=" grid grid-rows-3 text-sm max-h-56 border-opacity-50 border-b">
      <text className="row-span-3 w-16 h-4 text-xs text-center rounded-full font-semibold text-unselected bg-button mt-10">
        {type}
      </text>
      <div className="row-span-2 inline-flex pt-4">
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
      <p className="self-center row-span-1 mb-10 text-sm pt-3 mb-10">
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
      return data.notes;
    };
    async function fetchData(): Promise<void> {
      setNotes(await getNotes());
    }
    fetchData();
  }, [phrase, userId]);

  const CATEGORIES = ["General", "Soccer", "Academics", "Mentorship"];
  const [categoryToggles, setCategoryToggles] = useState<
    Record<string, boolean>
  >(
    CATEGORIES.reduce<Record<string, boolean>>((obj, category) => {
      return {
        ...obj,
        [category]: true,
      };
    }, {})
  );

  const toggleCategory = (category: string): void => {
    setCategoryToggles({
      ...categoryToggles,
      [category]: !categoryToggles[category],
    });
  };

  return (
    <div>
      <div className="flex flex-row mt-8">
        <div className="text-gray-600 w-4/6">
          <input
            className="border-2 border-gray-300 bg-white h-10 px-96 pr-16 rounded-full text-sm focus:outline-none"
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
        <Button
          className="font-display text-sm px-6 bg-button text-dark rounded-full h-10 mr-5"
          iconType="sort"
        >
          Sort
        </Button>
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
                    <p className="h-5 ml-4 -mt-10 fill-current">Category</p>
                    {Object.keys(categoryToggles).map((category) => (
                      <button
                        type="button"
                        className="flex items-center w-full px-4 py-2 font-medium focus:outline-none hover:bg-button hover:text-dark"
                        onClick={() => {
                          toggleCategory(category);
                        }}
                      >
                        <Icon
                          type="selected"
                          className={`h-4 mr-3 ${
                            categoryToggles[category] ? "" : "opacity-0"
                          }`}
                        />
                        <p className="justify-self-start text-xs text-center rounded-full font-medium text-dark bg-pink-muted px-2">
                          {category}
                        </p>
                      </button>
                    ))}
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
        </>
      </div>
      <img src="" alt="" />
      {notes
        .filter(
          (note: Notes) =>
            categoryToggles[
              note.type.charAt(0).toUpperCase() + note.type.slice(1)
            ]
        )
        .map((note: Notes) => (
          <Note note={note} />
        ))}
    </div>
  );
};

export default NotesTable;
