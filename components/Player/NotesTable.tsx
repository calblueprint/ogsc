import { Notes } from "@prisma/client";
import Button from "components/Button";
import React from "react";

const Note: React.FunctionComponent<{ note: Notes }> = ({
  // note: { id, author, created_at, content, type },   <- add this in later!
  // eslint-disable-next-line camelcase
  note: { created_at, content },
}) => {
  return (
    <div className=" grid grid-rows-3 text-sm max-h-56 border-opacity-50 border-b">
      <text className="row-span-3 w-16 h-4 text-xs text-center rounded-full font-semibold text-unselected bg-button mt-10">
        Tag
      </text>
      <div className="row-span-2 inline-flex pt-4">
        <div className="w-10 h-10 mr-4 bg-placeholder rounded-full">
          <img src="/placeholder-profile.png" alt="" />
        </div>
        <div>
          <p className="font-semibold">Name</p>
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
  notes: Notes[] | undefined;
}>;

const NotesTable: React.FC<Props> = ({ notes }) => {
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
        >
          Add Note
        </Button>
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
      {notes?.map((note: Notes) => (
        <Note note={note} />
      ))}
    </div>
  );
};

export default NotesTable;
