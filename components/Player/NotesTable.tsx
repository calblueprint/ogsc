import { Notes } from "@prisma/client";
import Button from "components/Button";
import { ReadManyNotesDTO } from "pages/api/notes/readMany";
import React, { Fragment, useEffect, useCallback, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import Icon from "components/Icon";
import AddNote from "components/Player/AddNote";
import { IUser } from "interfaces";
import useSessionInfo from "utils/useSessionInfo";
import { useRouter } from "next/router";
import EditDeleteMenu from "components/Player/EditDeleteMenu";
import useCanEditField from "utils/useCanEditField";
import PageNav from "components/PageNav";
import { UI_PAGE_SIZE } from "../../constants";

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

const Note: React.FunctionComponent<{
  note: Notes;
}> = ({ note }) => {
  const [author, setAuthor] = useState<IUser>();
  const canEdit = useCanEditField("note", undefined, {
    creatorId: note.authorId,
  });
  useEffect(() => {
    const getUser = async (): Promise<void> => {
      const response = await fetch(`/api/users/${note.authorId}`, {
        method: "GET",
        headers: { "content-type": "application/json" },
        redirect: "follow",
      });
      const data = await response.json();
      setAuthor(data.user);
    };
    getUser();
  }, [note.authorId]);
  return (
    <div className="grid grid-rows-3 grid-cols-3 text-sm max-h-56 border-opacity-50 border-b">
      <text
        className={`row-span-3 col-start-1 h-4 text-xs w-3/12 text-center rounded-full font-medium text-dark bg-${
          CATEGORIES[
            (note.type.charAt(0).toUpperCase() +
              note.type.slice(1)) as keyof typeof CATEGORIES
          ]
        } mt-10`}
      >
        {note.type.charAt(0).toUpperCase() + note.type.slice(1)}
      </text>
      <div className="row-span-2 inline-flex pt-4 col-start-1">
        <div className="w-10 h-10 mr-4 bg-placeholder rounded-full">
          <img src="/placeholder-profile.png" alt="" />
        </div>
        <div>
          <p className="font-semibold">{author?.name}</p>
          <p>
            {note.created_at.toLocaleString("default", {
              hour12: true,
              hour: "2-digit",
              minute: "2-digit",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        {canEdit && (
          <div className="absolute right-0 mr-16 px-2">
            <EditDeleteMenu note={note} />
          </div>
        )}
      </div>
      <p className="self-center row-span-1 col-span-3 text-sm pt-3 mt-2 mb-10 col-start-1 max-h-1/3 overflow-y-scroll">
        {note.content}
      </p>
    </div>
  );
};

type Props = React.PropsWithChildren<{
  userId: number | undefined;
  playerNotes: Notes[] | undefined;
}>;

const NotesTable: React.FC<Props> = ({ userId, playerNotes }) => {
  const [phrase, setPhrase] = useState<string>(" ");
  const [notes, setNotes] = useState<Notes[] | undefined>(playerNotes);

  const session = useSessionInfo();
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const refreshProfile = useCallback(() => {
    router.replace(router.asPath);
  }, [router]);

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
      const allNotes = await getNotes();
      setNotes(allNotes);
    }
    fetchData();
  }, [userId, phrase, router]);

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

  // Pagination
  const [currUIPage, setUIPage] = useState(0);
  const [filteredNotes, setFilteredNotes] = useState<Notes[]>([]);
  const [numUIPages, setNumUIPages] = useState(0);

  useEffect(() => {
    const sortFn =
      selectedOption === "Oldest First"
        ? sortAscending
        : (allNotes: Notes[]): Notes[] => sortAscending(allNotes).reverse();

    const result = sortFn(notes || []).filter(
      (note: Notes) =>
        categoryToggles[note.type.charAt(0).toUpperCase() + note.type.slice(1)]
          .enabled
    );
    setFilteredNotes(result);
    setNumUIPages(Math.ceil(result.length / UI_PAGE_SIZE));
    setUIPage(0);
  }, [categoryToggles, notes, selectedOption]);

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
          className="font-display text-sm bg-blue-muted text-blue rounded-full h-10 mr-5"
          iconType="plus"
          onClick={() => setModalOpen(true)}
        >
          Note
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
                    className="absolute right-0 mr-48 mt-24 border-medium-gray shadow-lg bg-white rounded-md focus:outline-none flex flex-col text-unselected font-semibold text-sm w-36"
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
                      className="absolute right-0 mr-16 mt-24 border-medium-gray shadow-lg bg-white rounded-md pt-12 focus:outline-none flex flex-col text-unselected font-semibold text-sm w-36"
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
      {filteredNotes
        .slice(currUIPage * UI_PAGE_SIZE, (currUIPage + 1) * UI_PAGE_SIZE)
        .map((note: Notes) => (
          <Note note={note} />
        ))}
      <AddNote
        addOrEdit="Add"
        authorId={session.user.id}
        modalOpen={modalOpen}
        closeModal={() => setModalOpen(false)}
        toastMessage="Note created!"
        refresh={() => refreshProfile()}
      />
      <img src="" alt="" />
      <PageNav
        currentPage={currUIPage + 1}
        numPages={numUIPages}
        onPrevPage={() => {
          setUIPage(currUIPage - 1);
        }}
        onNextPage={() => {
          setUIPage(currUIPage + 1);
        }}
        prevDisabled={currUIPage <= 0}
        nextDisabled={currUIPage >= numUIPages - 1}
      />
    </div>
  );
};

export { Note, NotesTable };
