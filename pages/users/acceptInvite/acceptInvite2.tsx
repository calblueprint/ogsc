import { joiResolver } from "@hookform/resolvers/joi";
import { User } from "@prisma/client";
import Button from "components/Button";
import FormField from "components/FormField";
import Joi from "joi";
import { useStateMachine } from "little-state-machine";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import updateActionAcceptInvite from "utils/updateActionAcceptInvite";

type UserAcceptInviteForm2Values = {
  password: string;
  confirmPassword: string;
};

const UserAcceptInviteForm2Schema = Joi.object<UserAcceptInviteForm2Values>({
  password: Joi.forbidden().required(),
  confirmPassword: Joi.forbidden().required(),
});

const UserAcceptInvitePageTwo: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User>();
  const inviteCodeId = router.query.inviteCode;

  // console.log(router.query);

  useEffect(() => {
    const getUser = async (): Promise<void> => {
      const response = await fetch(`/api/invites/${inviteCodeId}`, {
        method: "GET",
        headers: { "content-type": "application/json" },
        redirect: "follow",
      });
      const data = await response.json();
      console.log(data);
      console.log(data.user);
      setUser(data.user);
    };
    getUser();
  }, [inviteCodeId]);

  if (!user) {
    // create error page?
  }

  // TODO: Add loading state to form submission
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [revealPassword, setRevealPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const { errors, register, handleSubmit } = useForm<
    UserAcceptInviteForm2Values
  >({
    resolver: joiResolver(UserAcceptInviteForm2Schema),
  });
  const { state, action } = useStateMachine(updateActionAcceptInvite);

  async function onSubmit(
    values: UserAcceptInviteForm2Values,
    event?: React.BaseSyntheticEvent
  ): Promise<void> {
    event?.preventDefault();
    if (submitting) {
      return;
    }
    try {
      action(values);

      if (values.password !== values.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      // const response = await fetch("/api/users/", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   credentials: "include",
      //   body: JSON.stringify({
      //     email: state.userData.email,
      //     name: `${state.userData.firstName} ${state.userData.lastName}`,
      //     phoneNumber: state.userData.phoneNumber,
      //     password: state.userData.password,
      //   } as CreateUserDTO),
      // });
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

  const togglePassword = (): void => {
    setRevealPassword(!revealPassword);
  };

  return (
    <div className="form flex ml-20 mt-10 mr-32 flex-col">
      <p className="pt-6 text-2xl h-16">Set your password</p>
      <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <FormField
            label="Password"
            name="password"
            error={errors.password?.message}
          >
            <input
              type={revealPassword ? "text" : "password"}
              className="input input-full"
              name="password"
              placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
              ref={register}
              defaultValue={state.acceptUserData.password}
            />
            <button
              className="text-sm text-gray-500"
              type="button"
              onClick={togglePassword}
            >
              {revealPassword ? "Hide password" : "Show password"}
            </button>
          </FormField>
          <FormField
            label="Confirm Password"
            name="confirmPassword"
            error={errors.confirmPassword?.message}
          >
            <input
              type={revealPassword ? "text" : "password"}
              className="input input-full"
              name="confirmPassword"
              placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
              ref={register}
              defaultValue={state.acceptUserData.confirmPassword}
            />
            <button
              className="text-sm text-gray-500"
              type="button"
              onClick={togglePassword}
            >
              {revealPassword ? "Hide password" : "Show password"}
            </button>
          </FormField>
        </fieldset>
        <div className="flex mt-24 mb-32 justify-between align-middle">
          <div className="mb-2 flex ">
            <Button
              className="button-normal px-10 py-2"
              onClick={() => {
                router.push(`/users/acceptInvite?inviteCode=${inviteCodeId}`);
              }}
            >
              &#x2190; Back
            </Button>
          </div>
          <div className="mb-2 flex justify-end">
            <Button className="button-primary px-10 py-2" type="submit">
              Submit
            </Button>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default UserAcceptInvitePageTwo;
