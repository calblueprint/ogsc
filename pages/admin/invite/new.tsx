import { joiResolver } from "@hookform/resolvers/joi";
import { User } from "@prisma/client";
import Button from "components/Button";
import DashboardLayout from "components/DashboardLayout";
import FormField from "components/FormField";
import { UserRole, UserRoleConstants, UserRoleLabel } from "interfaces";
import Joi from "joi";
import Link from "next/link";
import { useRouter } from "next/router";
import { AdminCreateUserDTO } from "pages/api/admin/users/create";
import SearchBar from "components/DropdownSearchBar";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

type AdminInviteFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  linkedPlayers?: User[];
};

const AdminInviteFormSchema = Joi.object<AdminInviteFormValues>({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required(),
  phoneNumber: Joi.string().optional(),
  role: Joi.string()
    .valid(...UserRoleConstants)
    .required(),
  linkedPlayers: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().required(),
        name: Joi.string().optional(),
        email: Joi.string().required(),
        emailVerified: Joi.date().required(),
        image: Joi.string().optional(),
        createdAt: Joi.date().required(),
        updatedAt: Joi.date().required(),
        hashedPassword: Joi.string().required(),
        isAdmin: Joi.boolean().required(),
        phoneNumber: Joi.string().required(),
      })
    )
    .optional(),
});

const AdminNewInvitePage: React.FC = () => {
  const router = useRouter();

  // TODO: Add loading state to form submission
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { errors, register, handleSubmit } = useForm<AdminInviteFormValues>({
    resolver: joiResolver(AdminInviteFormSchema),
  });

  async function onSubmit(
    values: AdminInviteFormValues,
    event?: React.BaseSyntheticEvent
  ): Promise<void> {
    event?.preventDefault();
    if (submitting) {
      return;
    }
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: values.email,
          name: `${values.firstName} ${values.lastName}`,
          phoneNumber: values.phoneNumber,
        } as AdminCreateUserDTO),
      });
      if (!response.ok) {
        throw await response.json();
      }
      router.push("/admin/invite?success=true", "/admin/invite");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-16 mt-24">
        <h1 className="text-3xl font-display font-medium mb-2">
          Add a new user
        </h1>
        <p>Pending page description</p>
        <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <legend className="text-lg font-medium mb-8">User Overview</legend>
            <FormField
              label="First Name"
              name="firstName"
              error={errors.firstName?.message}
            >
              <input
                type="text"
                className="input input-full"
                name="firstName"
                placeholder="e.g., Cristiano"
                ref={register}
              />
            </FormField>
            <FormField
              label="Last Name"
              name="lastName"
              error={errors.lastName?.message}
            >
              <input
                type="text"
                className="input input-full"
                name="lastName"
                placeholder="e.g., Ronaldo"
                ref={register}
              />
            </FormField>
            <FormField
              label="Email Address"
              name="email"
              error={errors.email?.message}
            >
              <input
                type="text"
                className="input input-full"
                name="email"
                placeholder="e.g., soccer@fifa.com"
                ref={register}
              />
            </FormField>
            <FormField
              label="Phone Number"
              name="phoneNumber"
              error={errors.phoneNumber?.message}
            >
              <input
                type="text"
                className="input"
                name="phoneNumber"
                placeholder="e.g., 123-456-7890"
                ref={register}
              />
            </FormField>
            <FormField label="Role" name="role" error={errors.role?.message}>
              {UserRoleConstants.map((role: UserRole) => (
                <label className="block font-normal" htmlFor={role}>
                  <input
                    className="mr-3"
                    type="radio"
                    name="role"
                    id={role}
                    value={role}
                    ref={register}
                  />
                  {UserRoleLabel[role]}
                </label>
              ))}
            </FormField>
            {/* TODO: display below only after role is chosen */}
            <legend className="text-lg font-medium mb-10 mt-16">
              Role Information
            </legend>
            <FormField
              label="Linked Players"
              name="linkedPlayers"
              error={errors.linkedPlayers?.message}
            >
              <p className="text-xs font-normal mt-3 mb-3">
                {/* TODO: display different messages based on roles  */}
                Mentors will have access to the full profile of players they are
                mentorning, including Engagement Scores, Academics, Attendance,
                and Physical Health information.
              </p>
              {/* TODO: add onClick functionality */}
              <Button iconType="plus">Add players</Button>
              <SearchBar />
            </FormField>
          </fieldset>
          <hr />
          <div className="my-10">
            <div className="mb-2 flex">
              <Button className="button-primary px-10 py-2 mr-5" type="submit">
                Send Invite
              </Button>
              <Link href="/admin/invite">
                <Button className="button-hollow px-10 py-2">Cancel</Button>
              </Link>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AdminNewInvitePage;
