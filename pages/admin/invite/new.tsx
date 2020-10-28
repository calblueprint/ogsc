import Button from "components/Button";
import DashboardLayout from "components/DashboardLayout";
import FormField from "components/FormField";
import { UserRole, UserRoleConstants, UserRoleLabel } from "interfaces";
import Link from "next/link";
import React from "react";

const AdminNewInvitePage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="mx-16 mt-24">
        <h1 className="text-3xl font-display font-medium mb-2">
          Add a new user
        </h1>
        <p>Pending page description</p>
        <form className="mt-10">
          <fieldset>
            <legend className="text-lg font-medium mb-8">User Overview</legend>
            <FormField label="First Name" name="firstName">
              <input
                type="text"
                className="input input-full"
                name="firstName"
                placeholder="e.g., Cristiano"
              />
            </FormField>
            <FormField label="Last Name" name="lastName">
              <input
                type="text"
                className="input input-full"
                name="lastName"
                placeholder="e.g., Ronaldo"
              />
            </FormField>
            <FormField label="Email Address" name="email">
              <input
                type="text"
                className="input input-full"
                name="email"
                placeholder="e.g., soccer@fifa.com"
              />
            </FormField>
            <FormField label="Phone Number" name="phoneNumber">
              <input
                type="text"
                className="input"
                name="phoneNumber"
                placeholder="e.g., 123-456-7890"
              />
            </FormField>
            <FormField label="Role" name="role">
              {UserRoleConstants.map((role: UserRole) => (
                <label className="block font-normal" htmlFor={role}>
                  <input
                    className="mr-3"
                    type="radio"
                    name="role"
                    id={role}
                    value={role}
                  />
                  {UserRoleLabel[role]}
                </label>
              ))}
            </FormField>
          </fieldset>
          <hr />
          <div className="my-10 flex">
            <Button className="button-primary px-10 py-2 mr-5">
              Send Invite
            </Button>
            <Link href="/admin/invite">
              <Button className="button-hollow px-10 py-2">Cancel</Button>
            </Link>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AdminNewInvitePage;
