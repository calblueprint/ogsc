import React from "react";
import { StateMachineProvider, createStore } from "little-state-machine";
import UserSignUpPageOne from "./signUp1";

const UserSignUpPage: React.FC = () => {
  return <StateMachineProvider>{UserSignUpPageOne({})}</StateMachineProvider>;
};

export default UserSignUpPage;
