import DashboardLayout from "components/DashboardLayout";
// import Combobox from "components/Combobox";
import React from "react";
// import { User } from "@prisma/client";
import Button from "../../../components/Button";

const userAccountPage: React.FunctionComponent = () => {
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
          <p className="text-1xl font-semibold">Linked Players</p>
          <p className="mb-10">
            Donors will have access to extended profiles of players they are
            sponsoring, including Engagement Scores, Academics, and Physical
            Health information.
          </p>
          {/* <Combobox
            selectedPlayers={selectedPlayers}
            setSelectedPlayers={setSelectedPlayers}
          /> */}
        </div>
        <div className="flex space-x-4 mb-10">
          <div>
            <Button
              className="bg-red-200 hover:bg-red-200 text-danger font-bold py-2 px-4 rounded"
              // onClick={}
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
            // onClick={}
          >
            Back
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};
export default userAccountPage;
