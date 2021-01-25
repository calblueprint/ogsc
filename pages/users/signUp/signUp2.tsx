import { joiResolver } from "@hookform/resolvers/joi";
import Button from "components/Button";
import FormField from "components/FormField";
import { UserRoleLabel, UserRoleType } from "interfaces";
import Joi from "joi";
import { useStateMachine } from "little-state-machine";
import { useRouter } from "next/router";
import { CreateUserDTO } from "pages/api/users";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import updateActionSignUp from "utils/updateActionSignUp";

type UserSignUpForm2Values = {
  role: UserRoleType;
  adminNote: string;
};

const UserSignUpForm2Schema = Joi.object<UserSignUpForm2Values>({
  role: Joi.string()
    .valid(...Object.values(UserRoleType))
    .allow(""),
  adminNote: Joi.string().allow(""),
});

const UserSignUpPageTwo: React.FC = () => {
  const router = useRouter();

  // TODO: Add loading state to form submission
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { errors, register, handleSubmit } = useForm<UserSignUpForm2Values>({
    resolver: joiResolver(UserSignUpForm2Schema),
  });
  const { state, action } = useStateMachine(updateActionSignUp);

  async function onSubmit(
    values: UserSignUpForm2Values,
    event?: React.BaseSyntheticEvent
  ): Promise<void> {
    event?.preventDefault();
    if (submitting) {
      return;
    }
    try {
      action(values);
      const response = await fetch("/api/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: state.userData.email,
          name: `${state.userData.firstName} ${state.userData.lastName}`,
          phoneNumber: state.userData.phoneNumber.toString(),
          password: state.userData.password,
          role: state.userData.role,
        } as CreateUserDTO),
      });
      if (!response.ok) {
        throw await response.json();
      }
      router.push("/users/signUp/signUpConfirmation");
    } catch (err) {
      // TODO: better error handling (especially for duplicate email)
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
            {Object.values(UserRoleType).map((role: UserRoleType) => (
              <label className="block font-normal" htmlFor={role}>
                <input
                  className="mr-3"
                  type="radio"
                  name="role"
                  id={role}
                  value={role}
                  ref={register}
                  defaultValue={state.userData.role}
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
            <p className="text-xs mb-3 font-normal">
              Recommended for parents and donors just so we know for sure who
              you are!
            </p>
            <input
              type="text"
              className="input input-full"
              name="adminNote"
              placeholder="Briefly describe your involvment in Oakland Genisis Soccer Club"
              ref={register}
              defaultValue={state.userData.adminNote}
            />
          </FormField>
        </fieldset>
        <div className="flex mt-24 mb-32 justify-between align-middle">
          <div className="mb-2 flex ">
            <Button
              className="button-normal px-10 py-2"
              onClick={() => {
                router.push("/users/signUp");
              }}
            >
              &#x2190; Back
            </Button>
          </div>
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

export default UserSignUpPageTwo;
