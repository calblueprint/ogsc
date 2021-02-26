import { DefaultRole } from "interfaces/user";
// import { DefaultRole } from "interfaces";
// import Link from "next/link";
import React from "react";

const PendingInvitesTable: React.FunctionComponent<PendingInvites> = ({
  // eslint-disable-next-line no-empty-pattern
  image,
}) => {
  return (
    <div>
      <div className="text-3xl font-display font-medium mb-10">
        <div className="mx-0 mt-0">
          <p className="mx-0 mt-10">Your Pending Invites</p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-5 justify-items-start m-5 font-display text-unselected">
        <p>Name</p>
        <p>Email</p>
        <p>Phone</p>
        <p>Date Created/ Modified</p>
        <hr className="border-unselected border-opacity-50" />
      </div>
      <hr className="border-unselected border-opacity-50" />
      <div className="hover:bg-placeholder grid grid-cols-3">
        <div className="col-span-2">
          {/* <Link href={`invite/userAccountPage/${id}`}> */}
          <div className="grid grid-cols-4 gap-32 justify-items-start m-5 font-display items-center py-3">
            <div className="flex flex-row">
              <div className="w-10 h-10 mr-4 rounded-full">
                <img src={image || "/placeholder-profile.png"} alt="" />
              </div>
              <div className="w-40">
                <p className="font-semibold">Cristiano Ronaldo</p>
                {/* <p>{defaultRole.type}</p> */}
              </div>
            </div>
            <div>
              <p className="self-center font-normal">email@gmail.com</p>
            </div>
            <div>
              <p className="self-center font-normal">408-887-7887</p>
            </div>
            <div>
              <p className="self-center font-normal">Created 10/31/2020</p>
            </div>
          </div>
          {/* </Link> */}
        </div>
      </div>
      <img src="" alt="" />
      {/* {users?.map((user) => (
        <PendingInvitesTable
          name={user.name}
          email={user.email}
          phoneNumber={user.phoneNumber}
          image={user.image}
          defaultRole={user.defaultRole}
          id={user.id}
          dateCreated={user.dateCreated}
        />
      ))} */}
    </div>
  );
};
interface PendingInvites {
  name: string;
  email: string;
  phoneNumber: string;
  dateCreated: Date;
  image: string | null;
  id: number;
  defaultRole: DefaultRole;
}
export default PendingInvitesTable;
