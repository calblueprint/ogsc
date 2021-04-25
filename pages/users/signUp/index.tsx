import { joiResolver } from "@hookform/resolvers/joi";
import { UserRoleType } from "@prisma/client";
import Button from "components/Button";
import Icon from "components/Icon";
import SignUpLayout from "components/SignUpLayout";
import UserSignUpFormField from "components/UserSignUpFormField";
import Joi from "lib/validate";
import { StateMachineProvider, useStateMachine } from "little-state-machine";
import Link from "next/link";
import { useRouter } from "next/router";
import { UserDTO } from "pages/api/admin/users/readOneEmail";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import updateActionSignUp from "utils/updateActionSignUp";

export type UserSignUpFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  adminNote?: string;
  phoneNumber?: string;
  password: string;
  role: UserRoleType;
};

type UserSignUpForm1Values = Pick<
  UserSignUpFormValues,
  "firstName" | "lastName" | "email" | "phoneNumber" | "password"
>;

const UserSignUpForm1Schema = Joi.object<UserSignUpForm1Values>({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required(),
  phoneNumber: Joi.string()
    .phoneNumber({ defaultCountry: "US", format: "national", strict: true })
    .empty("")
    .allow(null),
  password: Joi.string().min(8).required(),
});

const UserSignUpPageOne: React.FC = () => {
  const router = useRouter();

  // TODO: Add loading state to form submission
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [revealPassword, setRevealPassword] = useState(false);
  const { errors, register, handleSubmit } = useForm<UserSignUpForm1Values>({
    resolver: joiResolver(UserSignUpForm1Schema),
  });
  const { action, state } = useStateMachine(updateActionSignUp);

  async function onSubmit(
    values: UserSignUpForm1Values,
    event?: React.BaseSyntheticEvent
  ): Promise<void> {
    event?.preventDefault();
    if (submitting) {
      return;
    }
    try {
      const player = await fetch("/api/admin/users/readOneEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: values.email,
        } as UserDTO),
      });
      if (player.ok) {
        setEmailError("Email already exists.");
      } else {
        action(values);
        router.push("/users/signUp/signUp2");
      }
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
      <SignUpLayout>
        <div className="form flex mr-32 flex-col">
          <p className="text-6xl font-semibold mb-10">Join the team</p>
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
                    className="input"
                    name="firstName"
                    placeholder="e.g., Cristiano"
                    ref={register}
                    defaultValue={state.userData.firstName}
                  />
                </UserSignUpFormField>
                <UserSignUpFormField
                  label="Last Name"
                  name="lastName"
                  error={errors.lastName?.message}
                >
                  <input
                    type="text"
                    className="input"
                    name="lastName"
                    placeholder="e.g., Ronaldo"
                    ref={register}
                    defaultValue={state.userData.lastName}
                  />
                </UserSignUpFormField>
              </div>
              <div className="flex mr-32">
                <UserSignUpFormField
                  label="Email Address"
                  name="email"
                  error={errors.email?.message || emailError}
                >
                  <input
                    type="text"
                    className="input"
                    name="email"
                    placeholder="e.g., soccer@fifa.com"
                    ref={register}
                    defaultValue={state.userData.email}
                    onChange={() => setEmailError("")}
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
                    defaultValue={state.userData.phoneNumber}
                  />
                </UserSignUpFormField>
              </div>
              <UserSignUpFormField
                label="Password"
                name="password"
                error={errors.password?.message}
              >
                <div className="flex flex-row space-x-4">
                  <input
                    type={revealPassword ? "text" : "password"}
                    className="input input-full"
                    name="password"
                    placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                    ref={register}
                    defaultValue={state.userData.password}
                  />
                  <button
                    className="text-sm text-gray-500"
                    type="button"
                    onClick={togglePassword}
                  >
                    {revealPassword ? "Hide password" : "Show password"}
                  </button>
                </div>
              </UserSignUpFormField>
              <div className="flex mt-24 mb-32 justify-between align-middle">
                <div className="flex flex-row">
                  <p className="text-gray-600">Already have an account? </p>{" "}
                  <Link href="/api/auth/signin">
                    <a className="ml-1 text-blue font-semibold hover:underline">
                      Login here.
                    </a>
                  </Link>
                </div>

                <div className="mb-2 flex ">
                  <Button
                    className="bg-blue text-sm px-5 py-2 text-white tracking-wide rounded-md"
                    type="submit"
                  >
                    Next Step
                    <Icon className="ml-6 w-8 stroke-current" type="next" />
                  </Button>
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
              </div>
              <hr />
            </fieldset>
          </form>
        </div>
      </SignUpLayout>
    </StateMachineProvider>
  );
};

export default UserSignUpPageOne;
