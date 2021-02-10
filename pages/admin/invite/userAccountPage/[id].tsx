import DashboardLayout from "components/DashboardLayout";
// import Combobox from "components/Combobox";
import React, { useState, useEffect } from "react";
// import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { DeleteUserDTO } from "pages/api/admin/users/delete";
import Combobox from "components/Combobox";
import { User } from "@prisma/client";
import Button from "components/Button";
// import { NextPageContext } from "next";
import { UpdateUserDTO } from "pages/api/admin/users/update";
import { UserRoleType, IUser } from "interfaces";
// import buildUserProfile from "utils/buildUserProfile";
// import flattenUserRoles from "utils/flattenUserRoles";
// import sanitizeUser from "utils/sanitizeUser";

// interface
// type Props = {
//   user?: IUser;
// };
// export async function getServerSideProps(
//   context: NextPageContext
// ): Promise<{ props: Props }> {
//   const prisma = new PrismaClient();
//   const id = context.query.id as string;
//   const user = await prisma.user.findOne({
//     where: { id: Number(id) },
//     include: {
//       absences: true,
//       profileFields: true,
//       roles: true,
//     },
//   });
//   if (user == null) {
//     return { props: {} };
//   }
//   return {
//     props: {
//       users: buildUserProfile(flattenUserRoles(sanitizeUser(user))),
//     },
//   };
// }
// eslint-disable-next-line react-hooks/rules-of-hooks
const UserAccountPage: React.FunctionComponent<UserRequest> = ({
  onDelete,
  onAccept,
}) => {
  const router = useRouter();
  const [selectedPlayers, setSelectedPlayers] = useState<User[]>([]);
  // const [user, setUser] = useState<User[]>([]);
  // const [roleChosen] = useState("");
  const [user, setUser] = useState<IUser>();
  // const [isEditing, setIsEditing] = useState(false);
  // const router = useRouter();
  const { id } = router.query;
  // const createDate = new Date().toDateString;

  useEffect(() => {
    const getUser = async (): Promise<void> => {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "GET",
        headers: { "content-type": "application/json" },
        redirect: "follow",
      });
      const data = await response.json();
      setUser(data.user);
    };
    getUser();
  }, [id]);

  const showCombobox = (): string => {
    return ([
      UserRoleType.Mentor,
      UserRoleType.Parent,
      UserRoleType.Donor,
    ] as UserRoleType[]).includes(user?.defaultRole.type as UserRoleType)
      ? ""
      : "hidden";
  };
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

  const acceptUser = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          emailVerified: new Date(),
        } as UpdateUserDTO),
      });
      if (!response.ok) {
        throw await response.json();
      }
      onAccept();
    } catch (err) {
      throw new Error(err.message);
    }
  };
  // const created = new Date();
  return (
    <DashboardLayout>
      <div className="flex-col mx-16 mt-14">
        <p className="text-4xl font-semibold">
          Invitation Request for {user?.name}{" "}
        </p>
        <p className="mb-10">Created {user?.createdAt}</p>
        <p className="text-3xl font-semibold mb-10">Basic Information </p>
        <p className="text-1xl font-semibold">First Name</p>
        <p className="mb-10">{user?.name}</p>
        <p className="text-1xl font-semibold">Last Name</p>
        <p className="mb-10">{user?.name}</p>
        <p className="text-1xl font-semibold">Email Address</p>
        <p className="mb-10">{user?.email}</p>
        <p className="text-1xl font-semibold">Phone number</p>
        <p className="mb-10">{user?.phoneNumber}</p>
        <p className="text-1xl font-semibold">Role</p>
        <p className="mb-10">{user?.defaultRole.type}</p>
        <p className="text-2xl font-semibold mb-10">Attached Note</p>

        <div className={showCombobox()}>
          <p className="text-2xl font-semibold"> Role Information </p>
          <p className="text-1xl font-semibold">Linked Players</p>
          <p className="mb-20">
            {user && (
              <Combobox
                selectedPlayers={selectedPlayers}
                setSelectedPlayers={setSelectedPlayers}
                role={user.defaultRole.type}
              />
            )}
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
                onClick={acceptUser}
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
              router.push("../");
            }}
          >
            Back to invites
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
};
// UserProfile.defaultProps = {
//   users: undefined,
// }
interface UserRequest {
  name: string;
  email: string;
  phoneNumber: string;
  Role: string;
  id: number;
  onDelete: () => void;
  onAccept: () => void;
}
export default UserAccountPage;
