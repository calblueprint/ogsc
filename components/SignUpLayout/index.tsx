import React from "react";
import SignUpSidebar from "./SignUpSidebar";

type Props = {
  children: React.ReactNode;
};

const SignUpLayout: React.FC<Props> = ({ children }: Props) => {
  return (
    <div>
      <SignUpSidebar />
      <div className="ml-64 pl-20">{children}</div>
    </div>
  );
};

export default SignUpLayout;
