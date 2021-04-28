import Button from "components/Button";
import Modal from "components/Modal";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { NoteType, Notes } from "@prisma/client";
import toast from "lib/toast";

type Props = React.PropsWithChildren<{
  authorId: number | undefined;
  addOrEdit: string;
  note?: Notes;
  modalOpen: boolean;
  closeModal: () => void;
  toastMessage: string;
  refresh: () => void;
}>;
const AddNote: React.FC<Props> = ({
  authorId,
  addOrEdit,
  note,
  modalOpen,
  closeModal,
  toastMessage,
  refresh,
}: Props) => {
  const router = useRouter();
  const [description, setDescription] = useState(note ? note.content : "");
  const [noteType, setNoteType] = useState(note ? note.type : NoteType.general);
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const resetModal = () => {
    closeModal();
    if (addOrEdit === "Add") {
      setDescription("");
      setNoteType(NoteType.general);
    }
  };
  useEffect(() => {
    setDescription(note?.content || "");
    setNoteType(note?.type || NoteType.general);
  }, [note?.content, note?.type]);
  async function onSubmit(): Promise<void> {
    const response = await fetch(`/api/notes/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: description,
        type: noteType,
        authorId,
        playerId: Number(router.query.id),
        noteId: note?.id,
      }),
    });
    if (!response.ok) {
      throw await response.json();
    } else {
      refresh();
      resetModal();
    }
  }
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const toasty = () => toast.success(toastMessage);
  return (
    <>
      <Modal open={modalOpen} className="w-1/2" onClose={closeModal}>
        <h1 className="text-2xl font-semibold">
          {addOrEdit === "Add" ? "Create" : addOrEdit} Note
        </h1>
        <hr className="my-2" />
        <p className="text-sm font-semibold mb-2 mt-8">Description</p>
        <textarea
          className="input text-sm w-full font-light"
          name="Text1"
          cols={40}
          rows={5}
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
          }}
        />
        <p className="text-sm pt-5 font-semibold mb-2">Category</p>
        <select
          value={noteType}
          className="select"
          onChange={(event) => {
            setNoteType(event.target.value as NoteType);
          }}
        >
          {Object.values(NoteType).map((type: NoteType) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <hr className="my-10" />
        <div className="flex flex-row my-5 gap-4 justify-start pb-4">
          <Button
            className="bg-blue-muted text-sm px-5 py-2 text-blue tracking-wide rounded-md"
            iconType="plus"
            onClick={() => {
              onSubmit();
              closeModal();
              toasty();
            }}
          >
            {addOrEdit} Note
          </Button>
          <Button
            type="button"
            className="border border-blue text-blue bg-white text-sm px-10 py-2 rounded-md tracking-wide"
            onClick={resetModal}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default AddNote;
