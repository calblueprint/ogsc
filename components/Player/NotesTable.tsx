import { Notes, UserRoleType } from "@prisma/client";
import Button from "components/Button";
import AddNote from "components/Player/AddNote";
import React, { useEffect, useCallback, useState } from "react";
import { IUser } from "interfaces";
import useSessionInfo from "utils/useSessionInfo";
import { useRouter } from "next/router";
import EditDeleteMenu from "components/Player/EditDeleteMenu";

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
  const split = note.content.split("\n");
  return (
    <div className="grid grid-rows-3 text-sm">
      <div className="row-span-3 w-16 h-4 text-xs text-center rounded-full font-semibold text-unselected bg-button">
        {note.type}
      </div>
      <div className="row-span-2 inline-flex pt-4 justify-between pb-3">
        <div className="inline-flex">
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
        </div>
        {(note.authorId === userId || isAdmin) && (
          <div className="px-2">
            <EditDeleteMenu note={note} />
          </div>
        )}
      </div>
      <div className="max-h-1/3 overflow-y-scroll bg-hover rounded-lg bg-opacity-50">
        {Object.values(split).map((line: string) => (
          <p className="self-center row-span-1 p-2 text-sm break-normal">
            {line}
          </p>
        ))}
      </div>
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
          className="font-display text-sm bg-blue-muted text-blue rounded-full h-10 mr-5"
          iconType="plus"
          onClick={() => setModalOpen(true)}
        >
          Note
        </Button>
        <AddNote
          addOrEdit="Add"
          authorId={session.user.id}
          modalOpen={modalOpen}
          closeModal={() => setModalOpen(false)}
          toastMessage="Note created!"
          refresh={() => refreshProfile()}
        />
        <Button
          className="font-display text-sm bg-button text-dark rounded-full h-10 mr-5"
          iconType="sort"
        >
          Sort
        </Button>
        <Button
          className="font-display text-sm bg-button text-dark rounded-full h-10 mr-5"
          iconType="filter"
        >
          Filter
        </Button>
      </div>
      <img src="" alt="" />
      {playerNotes?.map((note: Notes) => (
        <div className="mt-5 pb-5 border-opacity-50 border-b">
          <Note
            note={note}
            userId={session.user.id}
            isAdmin={session.sessionType === UserRoleType.Admin}
          />
        </div>
      ))}
    </div>
  );
};

export { Note, NotesTable };
