import Button from "components/Button";
import DashboardLayout from "components/DashboardLayout";
import Link from "next/link";
import React from "react";

const AdminInvitePage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="mx-16 mt-24">
        <h1 className="text-3xl font-display font-medium mb-10">
          Invite Users
        </h1>
        <Link href="/admin/invite/new">
          <Button iconType="plus">Create a new user</Button>
        </Link>
      </div>
    </DashboardLayout>
  );
};

export default AdminInvitePage;
