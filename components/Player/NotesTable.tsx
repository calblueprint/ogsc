import { Notes } from "@prisma/client";

type Props = React.PropsWithChildren<{
  userId: number | undefined;
  notes: Notes[] | undefined;
}>;
const NotesTable: React.FC<Props> = ({ userId, notes }) => {
  console.log(notes);
  return <div>{userId}</div>;
};

export default NotesTable;
