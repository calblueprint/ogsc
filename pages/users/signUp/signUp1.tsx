import { joiResolver } from "@hookform/resolvers/joi";
import Button from "components/Button";
import FormField from "components/FormField";
import UserSignUpFormField from "components/UserSignUpFormField";
import { UserRole, UserRoleConstants, UserRoleLabel } from "interfaces";
import Joi from "joi";
import {
  createStore,
  StateMachineProvider,
  useStateMachine,
} from "little-state-machine";
import { useRouter } from "next/router";
import { CreateUserDTO } from "pages/api/users";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import updateAction from "./updateAction";

createStore({
  userData: {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: null,
    adminNote: "",
  },
});
console.log("creating store");

export type UserSignUpFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  password: string;
  role?: UserRole;
  adminNote?: string;
};

const UserSignUpFormSchema = Joi.object<UserSignUpFormValues>({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required(),
  phoneNumber: Joi.string().optional(),
  password: Joi.forbidden().required(),
  role: Joi.string()
    .valid(...UserRoleConstants)
    .optional(),
  adminNote: Joi.string().optional(),
});

const UserSignUpPageOne: React.FC = () => {
  const router = useRouter();

  // TODO: Add loading state to form submission
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [revealPassword, setRevealPassword] = useState(false);
  const { errors, register, handleSubmit } = useForm<UserSignUpFormValues>({
    resolver: joiResolver(UserSignUpFormSchema),
  });
  const { action, state } = useStateMachine(updateAction);

  console.log(state);
  async function onSubmit(
    values: UserSignUpFormValues,
    event?: React.BaseSyntheticEvent
  ): Promise<void> {
    event?.preventDefault();
    if (submitting) {
      return;
    }
    try {
      action(values);
      router.push("/users/signUp/signUp2");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const togglePassword = (): void => {
    setRevealPassword(!revealPassword);
  };

  return (
    <StateMachineProvider>
      <div className="form flex ml-20 mt-10 mr-32 flex-col">
        <p className="pt-6 text-2xl h-16">Create your account</p>
        <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <div className="flex mr-32">
              <UserSignUpFormField
                label="First Name"
                name="firstName"
                error={errors.firstName?.message}
              >
                <input
                  type="text"
                  className="input "
                  name="firstName"
                  placeholder="e.g., Cristiano"
                  ref={register}
                  // defaultValue={state.userData.firstName}
                />
              </UserSignUpFormField>
              <UserSignUpFormField
                label="Last Name"
                name="lastName"
                error={errors.lastName?.message}
              >
                <input
                  type="text"
                  className="input "
                  name="lastName"
                  placeholder="e.g., Ronaldo"
                  ref={register}
                  // defaultValue={state.userData.lastName}
                />
              </UserSignUpFormField>
            </div>
            <div className="flex mr-32">
              <UserSignUpFormField
                label="Email Address"
                name="email"
                error={errors.email?.message}
              >
                <input
                  type="text"
                  className="input "
                  name="email"
                  placeholder="e.g., soccer@fifa.com"
                  ref={register}
                  // defaultValue={state.userData.email}
                />
              </UserSignUpFormField>
              <UserSignUpFormField
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
                  // defaultValue={state.userData.phoneNumber}
                />
              </UserSignUpFormField>
            </div>
            <UserSignUpFormField
              label="Password"
              name="password"
              error={errors.password?.message}
            >
              <input
                type={revealPassword ? "password" : "text"}
                className="input input-full"
                name="password"
                placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                ref={register}
                // defaultValue={state.userData.password}
              />
              <button
                className="text-sm text-gray-500"
                type="button"
                onClick={togglePassword}
              >
                {revealPassword ? "Show password" : "Hide password"}
              </button>
            </UserSignUpFormField>
            <div className="flex mt-24 mb-32 justify-between align-middle">
              {/* TODO: link user login page */}
              <p className="text-base">
                Already have an account? <b>Login here.</b>
              </p>
              <div className="mb-2 flex ">
                {/* <Link href="/users/signUp2"> */}
                <Button
                  className="button-primary text-base px-10 py-2 "
                  type="submit"
                >
                  Next step &#x2192;
                </Button>
                {/* </Link> */}
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
            </div>
            <hr />

            {/* <FormField label="Role" name="role" error={errors.role?.message}>
            {UserRoleConstants.map((role: UserRole) => (
              <label className="block font-normal" htmlFor={role}>
                <input
                  className="mr-3"
                  type="radio"
                  name="role"
                  id={role}
                  value={role}
                  ref={register}
                  // defaultValue={state.userData.role}
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
            <p className="text-xs mb-3">
              Recommended for parents and donors just so we know for sure who
              you are!
            </p>
            <input
              type="text"
              className="input input-full"
              name="adminNote"
              placeholder="Briefly describe your involvment in Oakland Genisis Soccer Club"
              ref={register}
              // defaultValue={state.userData.adminNote}
            />
          </FormField>
        </fieldset>

        <div className="flex mt-24 mb-32 justify-between align-middle">
          <div className="mb-2 flex ">
            <a href="/users/signUp" className="text-base text-gray-500">
              &#x2190; Back
            </a>
          </div>
          <div className="mb-2 flex justify-end">
            <Button className="button-primary px-10 py-2" type="submit">
              Request Account
            </Button>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div> */}
          </fieldset>
        </form>
      </div>
    </StateMachineProvider>
  );
};

export default UserSignUpPageOne;
