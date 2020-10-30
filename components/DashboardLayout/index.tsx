import React from "react";
import Sidebar from "./Sidebar";

type Props = {
  children: React.ReactNode;
};

const DashboardLayout: React.FC<Props> = ({ children }: Props) => {
  return (
    <div className="text-dark">
      <Sidebar />
      <div className="ml-56">{children}</div>
    </div>
  );
};

export default DashboardLayout;
