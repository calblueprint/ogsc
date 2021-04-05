import { joiResolver } from "@hookform/resolvers/joi";
import Button from "components/Button";
import FormField from "components/FormField";
import SignUpLayout from "components/SignUpLayout";
import { UserRoleLabel, UserRoleType } from "interfaces";
import Joi from "lib/validate";
import { StateMachineProvider, useStateMachine } from "little-state-machine";
import { useRouter } from "next/router";
import { CreateUserDTO } from "pages/api/users";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import updateActionSignUp from "utils/updateActionSignUp";
import { UserSignUpFormValues } from ".";

export type UserSignUpForm2Values = Pick<
  UserSignUpFormValues,
  "role" | "adminNote"
>;

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
  const [currRole, setCurrRole] = useState<UserRoleType>();
  const [adminNote, setAdminNote] = useState<string>();

  useEffect(() => {
    if (state.userData.email === "") {
      router.push("/users/signUp");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state.userData.role) {
      setCurrRole(state.userData.role);
    }
    if (state.userData.adminNote) {
      setAdminNote(state.userData.adminNote);
    }
  }, [state.userData.role, state.userData.adminNote]);

  async function onSubmit(
    _: UserSignUpForm2Values,
    event?: React.BaseSyntheticEvent
  ): Promise<void> {
    event?.preventDefault();
    if (submitting) {
      return;
    }
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: state.userData.email,
          name: `${state.userData.firstName} ${state.userData.lastName}`,
          phoneNumber: state.userData.phoneNumber.toString(),
          password: state.userData.password,
          role: currRole,
          adminNote,
        } as CreateUserDTO),
      });
      if (!response.ok) {
        throw await response.json();
      }
      router.push("/users/signUp/signUpConfirmation");
      action({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: null,
        adminNote: "",
      });
    } catch (err) {
      // TODO: better error handling (especially for duplicate email)
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }
  const goBack = (): void => {
    action({
      role: currRole,
      adminNote,
    });
    router.push("/users/signUp");
  };

  return (
    <StateMachineProvider>
      <SignUpLayout>
        <div className="form flex mt-10 mr-32 flex-col">
          <p className="text-6xl font-semibold mb-4">Join the Team</p>
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
                      checked={currRole === role}
                      onChange={() => setCurrRole(role)}
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
                  Recommended for parents and donors just so we know for sure
                  who you are!
                </p>
                <input
                  type="text"
                  className="input input-full"
                  name="adminNote"
                  placeholder="Briefly describe your involvement in Oakland Genesis Soccer Club"
                  ref={register}
                  defaultValue={state.userData.adminNote}
                  onChange={(event) => setAdminNote(event.target.value)}
                />
              </FormField>
            </fieldset>
            <div className="flex mt-24 mb-32 justify-between align-middle">
              <div className="mb-2 flex ">
                <Button className="button-normal px-10 py-2" onClick={goBack}>
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
      </SignUpLayout>
    </StateMachineProvider>
  );
};

export default UserSignUpPageTwo;
