import React from "react";
import Button from "../../../components/Button";

const userAccountPage: React.FunctionComponent = () => (
  <div className="flex-col">
    <p>Invitation Request for Mr. Soccer </p>
    <p>First Name</p>
    <p>Last Name</p>
    <p>email</p>
    <p>phone number</p>
    <p>role</p>
    <div className="flex space-x-4">
      <div>
        <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Decline
        </Button>
      </div>
      <div>
        <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Accept
        </Button>
      </div>
    </div>
  </div>
);
export default userAccountPage;
