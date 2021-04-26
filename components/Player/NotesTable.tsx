import { Notes, UserRoleType } from "@prisma/client";
import Icon from "components/Icon";
import Button from "components/Button";
import AddNote from "components/Player/AddNote";
import { Menu, Transition } from "@headlessui/react";
import React, { useEffect, useCallback, useState } from "react";
import { IUser } from "interfaces";
import useSessionInfo from "utils/useSessionInfo";
import { useRouter } from "next/router";
import toast from "lib/toast";

const EditDeleteMenu: React.FunctionComponent<{
  note: Notes;
}> = ({ note }) => {
  const [edit, setEdit] = useState(false);
  const [currNote, setCurrNote] = useState<Notes>(note);
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const editNote = () => {
    setCurrNote(note);
    setEdit(true);
  };
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const toasty = () => toast.success("Note deleted!");
  const refreshProfile = useCallback(() => {
    router.replace(router.asPath);
  }, [router]);
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async function deleteNote(): Promise<void> {
    const response = await fetch(`/api/notes/delete?id=${note.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw await response.json();
    }
    refreshProfile();
    toasty();
  }
  return (
    <>
      <Menu>
        {({ open }) => (
          <>
            <Menu.Button className="relative focus:outline-none flex align-center justify-center">
              <Icon type="more" className="h-5 ml-4 fill-current" />
            </Menu.Button>
            <Transition
              show={open}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Menu.Items
                className="absolute z-10 border-medium-gray shadow-lg bg-white rounded-md pt-12 focus:outline-none flex flex-col text-unselected font-semibold text-sm w-32"
                style={{ borderWidth: 1, transform: "translateY(-32px)" }}
                static
              >
                <Icon type="more" className="h-5 ml-4 -mt-10 fill-current" />
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      className={`flex items-center w-full px-4 py-2 font-medium ${
                        active ? "bg-button text-dark" : ""
                      }`}
                      onClick={editNote}
                    >
                      <Icon type="edit" className="h-4 mr-3 fill-current" />
                      <p className="justify-self-start">Edit</p>
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      className={`flex items-center w-full px-4 py-2 rounded-b-md font-medium ${
                        active ? "bg-button text-dark" : ""
                      }`}
                      onClick={deleteNote}
                    >
                      <Icon type="delete" className="h-4 mr-3 stroke-current" />
                      <p className="justify-self-start">Delete</p>
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
      <AddNote
        addOrEdit="Edit"
        authorId={currNote.authorId}
        note={currNote}
        modalOpen={edit}
        closeModal={() => setEdit(false)}
        toastMessage="Note updated!"
        refresh={() => refreshProfile()}
      />
    </>
  );
};

const Note: React.FunctionComponent<{
  note: Notes;
  userId: number;
  isAdmin: boolean;
}> = ({ note, userId, isAdmin }) => {
  const [author, setAuthor] = useState<IUser>();
  useEffect(() => {
    const getUser = async (): Promise<void> => {
      const response = await fetch(`/api/admin/users/${note.authorId}`, {
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
    <div className=" grid grid-rows-3 text-sm max-h-56 border-opacity-50 border-b">
      <div className="row-span-3 w-16 h-4 text-xs text-center rounded-full font-semibold text-unselected bg-button mt-10">
        {note.type}
      </div>
      <div className="row-span-2 inline-flex pt-4">
        <div className="w-10 h-10 mr-4 bg-placeholder rounded-full">
          <img src="/placeholder-profile.png" alt="" />
        </div>
        <div>
          <p className="font-semibold">{author?.name}</p>
          <p>
            {note.created_at.toLocaleString("default", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
      <p className="self-center row-span-1 mb-10 text-sm pt-3 mb-10">
        {note.content}
      </p>
      {(note.authorId === userId || isAdmin) && <EditDeleteMenu note={note} />}
    </div>
  );
};

type Props = React.PropsWithChildren<{
  playerNotes: Notes[] | undefined;
}>;

const NotesTable: React.FC<Props> = ({ playerNotes }) => {
  const session = useSessionInfo();
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const refreshProfile = useCallback(() => {
    router.replace(router.asPath);
  }, [router]);
  return (
    <div>
      <div className="flex flex-row mt-8">
        <div className="text-gray-600 w-4/6">
          <input
            className="border-2 border-gray-300 bg-white h-10 px-96 pr-16 rounded-full text-sm focus:outline-none"
            type="search"
            name="search"
            placeholder="Search notes"
            // onChange={(event) => setPhrase(event.target.value)}
          />
        </div>
        <Button
          className="font-display text-sm px-6 bg-blue-muted text-blue rounded-full h-10 mr-5"
          iconType="plus"
          onClick={() => setModalOpen(true)}
        >
          Add Note
        </Button>
        <AddNote
          addOrEdit="Add"
          authorId={session.user.id}
          modalOpen={modalOpen}
          closeModal={() => setModalOpen(false)}
          toastMessage="New note created!"
          refresh={() => refreshProfile()}
        />
        <Button
          className="font-display text-sm px-6 bg-button text-dark rounded-full h-10 mr-5"
          iconType="sort"
        >
          Sort
        </Button>
        <Button
          className="font-display text-sm px-6 bg-button text-dark rounded-full h-10 mr-5"
          iconType="filter"
        >
          Filter
        </Button>
      </div>
      <img src="" alt="" />
      {playerNotes?.map((note: Notes) => (
        <Note
          note={note}
          userId={session.user.id}
          isAdmin={session.sessionType === UserRoleType.Admin}
        />
      ))}
    </div>
  );
};

export default NotesTable;
