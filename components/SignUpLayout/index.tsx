import React from "react";

type Props = {
  children: React.ReactNode;
};

const SignUpLayout: React.FC<Props> = ({ children }: Props) => {
  return (
    <div>
      <div className="fixed top-0 flex flex-col justify-between w-64 h-screen bg-blue-muted" />
      <div className="w-1/6 ml-64 pl-20 pt-5 flex justify-center">
        <img src="/logo.png" alt="Oakland Genesis Soccer Club logo" />
      </div>
      <div className="ml-64 pl-20">{children}</div>
    </div>
  );
};

export default SignUpLayout;
