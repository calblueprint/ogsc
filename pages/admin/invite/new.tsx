import { joiResolver } from "@hookform/resolvers/joi";
import { UserRoleType, User, UserStatus } from "@prisma/client";
import Button from "components/Button";
import DashboardLayout from "components/DashboardLayout";
import FormField from "components/FormField";
import { UserRoleLabel } from "interfaces";
import Joi from "lib/validate";
import Link from "next/link";
import { useRouter } from "next/router";
import { AdminCreateUserDTO } from "pages/api/admin/users/create";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Combobox from "components/Combobox";

type AdminInviteFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: UserRoleType;
  linkedPlayers?: number[];
};

const AdminInviteFormSchema = Joi.object<AdminInviteFormValues>({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required(),
  phoneNumber: Joi.string()
    .phoneNumber({ defaultCountry: "US", format: "national", strict: true })
    .allow(""),
  role: Joi.string()
    .valid(...Object.values(UserRoleType))
    .required(),
  linkedPlayers: Joi.array().items(Joi.number()).allow(null),
});

const AdminNewInvitePage: React.FC = () => {
  const router = useRouter();

  // TODO: Add loading state to form submission
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [roleChosen, setRoleChosen] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState<User[]>([]);

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
          status: UserStatus.PendingUserAcceptance,
          phoneNumber: values.phoneNumber,
          role: values.role,
          linkedPlayers: selectedPlayers.map((user) => user.id),
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

  const showCombobox = (): string => {
    return ([
      UserRoleType.Mentor,
      UserRoleType.Parent,
      UserRoleType.Donor,
    ] as UserRoleType[]).includes(roleChosen as UserRoleType)
      ? ""
      : "hidden";
  };

  return (
    <DashboardLayout>
      <div className="mx-16 mt-24">
        <h1 className="text-3xl font-semibold mb-2">Add a new user</h1>
        <p>Pending page description</p>
        <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <legend className="text-lg font-semibold mb-8">
              Basic Information
            </legend>
            <FormField
              label="First Name"
              name="firstName"
              error={errors.firstName?.message}
            >
              <input
                type="text"
                className="input input-full"
                id="firstName"
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
                id="lastName"
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
                id="email"
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
                id="phoneNumber"
                name="phoneNumber"
                placeholder="e.g., 123-456-7890"
                ref={register}
              />
            </FormField>
            <FormField label="Role" name="role" error={errors.role?.message}>
              {Object.values(UserRoleType).map((role: UserRoleType) => (
                <label
                  className="font-medium flex items-center mb-2"
                  htmlFor={role}
                >
                  <input
                    className="mr-5"
                    type="radio"
                    name="role"
                    id={role}
                    value={role}
                    ref={register}
                    onChange={(event) => setRoleChosen(event.target.value)}
                  />
                  {UserRoleLabel[role]}
                </label>
              ))}
            </FormField>
            <div className={showCombobox()}>
              <legend className="text-lg font-medium mb-10 mt-16">
                Role Information
              </legend>
              <FormField
                label="Linked Players"
                name="linkedPlayers"
                error="" // TODO: fix this
              >
                <Combobox
                  selectedPlayers={selectedPlayers}
                  setSelectedPlayers={setSelectedPlayers}
                  role={roleChosen}
                />
              </FormField>
            </div>
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
