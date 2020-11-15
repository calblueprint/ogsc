import Button from "components/Button";
import DashboardLayout from "components/DashboardLayout";
import Modal from "components/Modal";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import UserRequestsTable from "../../../components/userRequest";

const AdminInvitePage: React.FC = () => {
  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="mx-16 mt-24">
        <h1 className="text-3xl font-semibold mb-10">Invites</h1>
        <Link href="/admin/invite/new">
          <Button iconType="plus">Invite a new user</Button>
        </Link>
        <div className="mt-10">
          <UserRequestsTable />
        </div>
      </div>
      <Modal open={Boolean(router.query.success)}>
        <h1 className="text-dark text-3xl font-medium mb-2">Invite Sent!</h1>
        <p className="text-dark mb-10">
          Your invitee will have ? days to accept their invite.
        </p>
        <div className="flex justify-end">
          <Button
            className="button-primary px-10 py-3"
            onClick={() => {
              router.replace("/admin/invite");
            }}
          >
            Done
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default AdminInvitePage;
