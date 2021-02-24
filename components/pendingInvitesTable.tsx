// import { DefaultRole } from "interfaces";
// import Link from "next/link";
import React from "react";

const PendingInvitesTable: React.FunctionComponent = () => {
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
        <p>Date Created/Modified</p>
        <hr className="border-unselected border-opacity-50" />
        {/* <img src="" alt="" /> */}
        {/* <hr className="border-unselected border-opacity-0" /> */}
        <div className="hover:bg-placeholder grid grid-cols-6">
          <div className="col-span-4">
            {/* <Link href="invite/userAccountPage/">
              <div className="grid grid-cols-3 gap-40 justify-items-start m-5 font-display items-center py-3">
                <div className="flex flex-row">
                  <div className="w-10 h-10 mr-4 rounded-full"> */}
            {/* <img src={image || "/placeholder-profile.png"} alt="" /> */}
            {/* </div>
                  <div className="w-32">
                    <p className="font-semibold">Cristiano Ronaldo</p>
                  </div>
                </div>
                <div>
                  <p className="self-center font-normal">cr7@gmail.com</p>
                </div> */}
            {/* <div>
                  <p className="self-center font-normal">123-456-7890</p>
                </div>
                <div>
                  <p className="self-center font-normal">Created 10/31/2020</p>
                </div>
              </div> */}
            {/* </Link> */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
// interface PendingInvites {
//   name: string;
//   email: string;
//   phoneNumber: string;
//   defaultRole: DefaultRole;
//   image: string | null;
//   id: number;
// }
export default PendingInvitesTable;
