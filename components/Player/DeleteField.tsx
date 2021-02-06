import Button from "components/Button";
import { useState } from "react";
import { DeleteFieldDTO } from "pages/api/admin/users/player/delete";
import { useRouter } from "next/router";

type Props = React.PropsWithChildren<{
  setOption: React.Dispatch<React.SetStateAction<string>>;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setType: React.Dispatch<
    React.SetStateAction<"updated" | "added" | "deleted" | undefined>
  >;
  setDate: React.Dispatch<React.SetStateAction<string>>;
  id: number;
  userId: number;
  fieldType: string;
  date: string;
}>;

const DeleteField: React.FC<Props> = ({
  setOption,
  setSuccess,
  setDate,
  setType,
  fieldType,
  id,
  userId,
  date,
}: Props) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const link =
    fieldType === "absence"
      ? "/api/admin/users/player/deleteAbsences"
      : "/api/admin/users/player/delete";

  async function ScoreSubmit(event?: React.BaseSyntheticEvent): Promise<void> {
    event?.preventDefault();
    try {
      const response = await fetch(link, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id,
          userId,
        } as DeleteFieldDTO),
      });
      if (!response.ok) {
        throw await response.json();
      }
      setDate(date);
      setType("deleted");
      setSuccess(true);
      setOption("");
      router.replace(router.asPath);
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <div>
      <p>
        Are you sure you want to delete this{" "}
        {fieldType === "Score" ? "Engagement Score" : ""}{" "}
        {fieldType === "gpa" ? "GPA" : ""}{" "}
        {fieldType === "absence" ? "Absence" : ""} for {date} ?
      </p>
      <div className="flex flex-row gap-6 mt-10">
        <Button className="py-2 px-16 text-sm" onClick={() => ScoreSubmit()}>
          Yes
        </Button>
        <Button
          className="border border-blue bg-white py-2 px-12 text-sm border-opacity-100"
          onClick={() => setOption("")}
        >
          Cancel
        </Button>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
};
export default DeleteField;
