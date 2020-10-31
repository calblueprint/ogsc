import { joiResolver } from "@hookform/resolvers/joi";
import Button from "components/Button";
import FormField from "components/FormField";
import { UserRole, UserRoleConstants, UserRoleLabel } from "interfaces";
import Joi from "joi";
import { useRouter } from "next/router";
import { CreateUserDTO } from "pages/api/users";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

type UserSignUpForm2Values = {
  role: UserRole;
  adminNote: string;
};

const UserSignUpForm2Schema = Joi.object<UserSignUpForm2Values>({
  role: Joi.string()
    .valid(...UserRoleConstants)
    .required(),
  adminNote: Joi.string(),
});

const UserSignUp2Page: React.FC = () => {
  const router = useRouter();

  // TODO: Add loading state to form submission
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { errors, register, handleSubmit } = useForm<UserSignUpForm2Values>({
    resolver: joiResolver(UserSignUpForm2Schema),
  });

  async function onSubmit(
    // values: UserSignUpForm2Values,
    event?: React.BaseSyntheticEvent
  ): Promise<void> {
    event?.preventDefault();
    if (submitting) {
      return;
    }
    try {
      const response = await fetch("/api/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          // email: values.email,
          // name: `${values.firstName} ${values.lastName}`,
          // phoneNumber: values.phoneNumber,
        } as CreateUserDTO),
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
    <div className="form flex ml-20 mt-10 mr-32 flex-col">
      <p className="pt-6 text-2xl h-16">Create your account</p>
      <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
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
          <FormField
            label="Attach a Note to the Admins"
            name="adminNote"
            error={errors.adminNote?.message}
          >
            <input
              type="text"
              className="input input-full"
              name="adminNote"
              placeholder="Briefly describe your involvment in Oakland Genisis Soccer Club"
              ref={register}
            />
          </FormField>
        </fieldset>
        <div className="mt-16 mb-32">
          <div className="mb-2 flex justify-end">
            <Button className="button-primary px-10 py-2" type="submit">
              Request Account
            </Button>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default UserSignUp2Page;
