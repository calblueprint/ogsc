import { joiResolver } from "@hookform/resolvers/joi";
import { UserStatus } from "@prisma/client";
import Button from "components/Button";
import FormField from "components/FormField";
import Joi from "lib/validate";
import { useStateMachine } from "little-state-machine";
import { useRouter } from "next/router";
import { CreateUserDTO } from "pages/api/users";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import updateActionAcceptInvite from "utils/updateActionAcceptInvite";
import SignUpLayout from "components/SignUpLayout";

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
  const inviteCodeId = router.query.inviteCode;

  useEffect(() => {
    const getUser = async (): Promise<void> => {
      const response = await fetch(`/api/invites/${inviteCodeId}`, {
        method: "GET",
        headers: { "content-type": "application/json" },
        redirect: "follow",
      });
      const data = await response.json();
      if (!response.ok || !data.user) {
        router.push("/users/acceptInvite/error?type=noAccess");
      } else if (data.user.status !== UserStatus.PendingUserAcceptance) {
        router.push("/users/acceptInvite/error?type=expired");
      }
    };
    getUser();
  }, [inviteCodeId, router]);

  // TODO: Add loading state to form submission
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [revealPassword, setRevealPassword] = useState(false);
  const [revealConfirmPassword, setRevealConfirmPassword] = useState(false);

  const {
    errors,
    register,
    handleSubmit,
  } = useForm<UserAcceptInviteForm2Values>({
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
      if (values.password !== values.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: `${state.acceptUserData.firstName} ${state.acceptUserData.lastName}`,
          email: state.acceptUserData.email,
          password: values.password,
          phoneNumber: state.acceptUserData.phoneNumber,
          inviteCodeId,
        } as CreateUserDTO),
      });
      if (!response.ok) {
        throw await response.json();
      }
      action({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
      });
      // TODO: user dashboard view doesn't exist yet
      router.push("/users/signUp/signUpConfirmation");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SignUpLayout>
      <div className="form flex mr-32 flex-col">
        <p className="text-6xl mb-4">Accept your account invite</p>
        <p className="pt-6 text-2xl h-16">Set your password</p>
        <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <FormField
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
                  defaultValue={state.acceptUserData.password}
                />
                <button
                  className="text-sm text-gray-500"
                  type="button"
                  onClick={() => setRevealPassword(!revealPassword)}
                >
                  {revealPassword ? "Hide password" : "Show password"}
                </button>
              </div>
            </FormField>
            <FormField
              label="Confirm Password"
              name="confirmPassword"
              error={errors.confirmPassword?.message}
            >
              <div className="flex flex-row space-x-4">
                <input
                  type={revealConfirmPassword ? "text" : "password"}
                  className="input input-full"
                  name="confirmPassword"
                  placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                  ref={register}
                  defaultValue={state.acceptUserData.confirmPassword}
                />
                <button
                  className="text-sm text-gray-500"
                  type="button"
                  onClick={() =>
                    setRevealConfirmPassword(!revealConfirmPassword)
                  }
                >
                  {revealConfirmPassword ? "Hide password" : "Show password"}
                </button>
              </div>
            </FormField>
          </fieldset>
          <div className="flex mt-24 mb-32 justify-between align-middle">
            <div className="flex">
              <Button
                className="button-normal px-10 py-2"
                onClick={() => {
                  router.push(`/users/acceptInvite?inviteCode=${inviteCodeId}`);
                }}
              >
                &#x2190; Back
              </Button>
            </div>
            <div className="flex justify-end">
              <Button className="button-primary px-10 py-2" type="submit">
                Submit
              </Button>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>
        </form>
      </div>
    </SignUpLayout>
  );
};

export default UserAcceptInvitePageTwo;
