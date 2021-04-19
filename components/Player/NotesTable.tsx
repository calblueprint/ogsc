import { Notes } from "@prisma/client";

type Props = React.PropsWithChildren<{
  userId: number | undefined;
  notes: Notes[] | undefined;
}>;
const NotesTable: React.FC<Props> = ({ notes }) => {
  return (
    <tbody>
      {notes?.map((note: Notes) => (
        <tr className="h-16 tr-border">
          {note.created_at.toLocaleString("default", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
          {note.content}
        </tr>
      ))}
    </tbody>
  );
};

export default NotesTable;
