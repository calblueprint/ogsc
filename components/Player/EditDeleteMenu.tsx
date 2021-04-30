import { Notes } from "@prisma/client";
import Icon from "components/Icon";
import AddNote from "components/Player/AddNote";
import { Menu, Transition } from "@headlessui/react";
import React, { useCallback, useState } from "react";
import { useRouter } from "next/router";
import toast from "lib/toast";
import Modal from "components/Modal";
import { Note } from "components/Player/NotesTable";
import Button from "components/Button";

const EditDeleteMenu: React.FunctionComponent<{
  note: Notes;
}> = ({ note }) => {
  const [edit, setEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
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
                className="absolute z-10 border-medium-gray shadow-lg bg-white rounded-md pt-12 focus:outline-none flex flex-col text-unselected font-semibold text-sm w-28"
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
                      onClick={() => {
                        setDeleteModal(true);
                      }}
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
      <Modal
        open={deleteModal}
        className="w-1/2"
        onClose={() => setDeleteModal(false)}
      >
        <h1 className="text-2xl font-semibold">Delete Note</h1>
        <p className="text-sm mb-4 mt-2">
          Are you sure you want to delete this message? This action cannot be
          undone.
        </p>
        <div className="p-3 border rounded-lg">
          <Note note={note} />
        </div>
        <hr className="my-6" />
        <div className="flex flex-row my-5 gap-4 justify-start pb-4">
          <Button
            className="bg-danger-muted text-sm px-5 py-2 text-danger tracking-wide rounded-md"
            onClick={() => {
              deleteNote();
              setDeleteModal(false);
            }}
          >
            Delete Note
          </Button>
          <Button
            type="button"
            className="border border-blue text-blue bg-white text-sm px-10 py-2 rounded-md tracking-wide"
            onClick={() => {
              setDeleteModal(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default EditDeleteMenu;
