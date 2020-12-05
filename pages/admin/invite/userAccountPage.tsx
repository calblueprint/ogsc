import DashboardLayout from "components/DashboardLayout";
// import Combobox from "components/Combobox";
import React, { useState } from "react";
// import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { DeleteUserDTO } from "pages/api/admin/users/delete";
import Combobox from "components/Combobox";
import { User } from "@prisma/client";
import Button from "../../../components/Button";

const userAccountPage: React.FunctionComponent<UserRequest> = ({
  // firstName,
  // lastName,
  // email,
  // phoneNumber,
  // Role,
  id,
  onDelete,
}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedPlayers, setSelectedPlayers] = useState<User[]>([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  // const [roleChosen] = useState("");
  const deleteUser = async (): Promise<void> => {
    try {
      const response = await fetch("/api/admin/users/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id,
        } as DeleteUserDTO),
      });
      if (!response.ok) {
        throw await response.json();
      }
      onDelete();
    } catch (err) {
      throw new Error(err.message);
    }
  };
  return (
    <DashboardLayout>
      <div className="flex-col mx-16 mt-14">
        <p className="text-4xl font-semibold mb-10">
          Invitation Request for Mr. Soccer{" "}
        </p>
        <p className="text-3xl font-semibold mb-10">Basic Information </p>
        <p className="text-1xl font-semibold mb-10">First Name</p>
        <p className="text-1xl font-semibold mb-10">Last Name</p>
        <p className="text-1xl font-semibold mb-10">Email Address</p>
        <p className="text-1xl font-semibold mb-10">Phone number</p>
        <p className="text-1xl font-semibold mb-10">Role</p>
        <p className="text-2xl font-semibold mb-10">Attached Note</p>

        <div>
          <p className="text-2xl font-semibold"> Role Information </p>
          <p className="text-1xl font-semibold">Linked Players</p>
          <p>
            Donors will have access to extended profiles of players they are
            sponsoring, including Engagement Scores, Academics, and Physical
            Health information.
          </p>
          <p className="mb-20">
            <Combobox
              selectedPlayers={selectedPlayers}
              setSelectedPlayers={setSelectedPlayers}
              // role={roleChosen}
            />
          </p>
        </div>
        <div className="flex space-x-4 mb-10">
          <div>
            <Button
              className="bg-red-200 hover:bg-red-200 text-danger font-bold py-2 px-4 rounded"
              onClick={deleteUser}
            >
              Decline
            </Button>
          </div>
          <div className="ml-4 ">
            <div>
              <Button
                className="bg-green-200 hover:bg-green-200 text-success font-bold py-2 px-4 rounded"
                // onClick={}
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
        <div className="mb-10">
          <Button
            className="bg-white hover:bg-white text-blue font-bold py-2 px-4 rounded border-solid border-4 border-blue"
            onClick={() => {
              router.push("./");
            }}
          >
            Back
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface UserRequest {
    name: string;
    email: string;
    phoneNumber: string;
    id: number;
    onDelete: () => void;
    onAccept: () => void;
  }
};
export default userAccountPage;
