import { joiResolver } from "@hookform/resolvers/joi";
import { User } from "@prisma/client";
import { UserStatus } from "interfaces";
import Button from "components/Button";
import UserSignUpFormField from "components/UserSignUpFormField";
import Joi from "lib/validate";
import { StateMachineProvider, useStateMachine } from "little-state-machine";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import updateActionAcceptInvite from "utils/updateActionAcceptInvite";

export type UserAcceptInviteFormValues = {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber: string;
};

const UserAcceptInviteFormSchema = Joi.object<UserAcceptInviteFormValues>({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .optional(),
  phoneNumber: Joi.string()
    .phoneNumber({ defaultCountry: "US", format: "national", strict: true })
    .required(),
});

const UserAcceptInvitePageOne: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const inviteCodeId = router.query.inviteCode;
  const { action, state } = useStateMachine(updateActionAcceptInvite);

  useEffect(() => {
    let mounted = true;
    const getUser = async (): Promise<void> => {
      if (mounted) {
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
        } else {
          setUser(data.user);
          action({ email: `${data.user.email}` });
        }
      }
      mounted = false;
    };
    if (inviteCodeId) {
      getUser();
    }
  }, [action, inviteCodeId, router]);

  // TODO: Add loading state to form submission
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const {
    errors,
    register,
    handleSubmit,
  } = useForm<UserAcceptInviteFormValues>({
    resolver: joiResolver(UserAcceptInviteFormSchema),
  });

  async function onSubmit(
    values: UserAcceptInviteFormValues,
    event?: React.BaseSyntheticEvent
  ): Promise<void> {
    event?.preventDefault();
    if (submitting) {
      return;
    }
    try {
      action({ ...values, ...{ email: state.acceptUserData.email } });
      router.push(
        `/users/acceptInvite/acceptInvite2?inviteCode=${inviteCodeId}`
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (inviteCodeId && user) {
    return (
      <StateMachineProvider>
        <div className="form flex ml-20 mt-10 mr-32 flex-col">
          <p className="pt-6 text-2xl h-16">
            Complete your account setup, {user?.name}.
          </p>
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
                    defaultValue={
                      state.acceptUserData.firstName ||
                      user?.name?.split(" ")[0]
                    }
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
                    defaultValue={
                      state.acceptUserData.lastName || user?.name?.split(" ")[1]
                    }
                  />
                </UserSignUpFormField>
              </div>
              <div className="flex mr-32">
                <UserSignUpFormField
                  label="Email Address"
                  name="email"
                  error=""
                >
                  <input
                    type="text"
                    className="input"
                    name="email"
                    ref={register}
                    defaultValue={state.acceptUserData.email}
                    disabled
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
                    defaultValue={
                      state.acceptUserData.phoneNumber || user?.phoneNumber
                    }
                  />
                </UserSignUpFormField>
              </div>
              <div className="flex mt-24 mb-32 justify-end align-middle">
                <div className="mb-2 flex ">
                  <Button
                    className="button-primary text-base px-10 py-2 "
                    type="submit"
                  >
                    Next step &#x2192;
                  </Button>
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
              </div>
            </fieldset>
          </form>
        </div>
      </StateMachineProvider>
    );
  }
  return (
    <div>
      <p>Loading...</p>
    </div>
  );
};

export default UserAcceptInvitePageOne;
