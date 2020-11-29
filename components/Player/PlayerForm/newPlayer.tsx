import { joiResolver } from "@hookform/resolvers/joi";
import Button from "components/Button";
import FormField from "components/FormField";
import Joi from "joi";
import { UserDTO } from "pages/api/admin/users/readOneEmail";
import { AdminCreateUserDTO } from "pages/api/admin/users/create";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import updateAction from "utils/updateAction";
import { useStateMachine } from "little-state-machine";
import type { UserSignUpFormValues } from "../../../pages/users/signUp";

const AdminInviteFormSchema = Joi.object<UserSignUpFormValues>({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required(),
  phoneNumber: Joi.string().empty("").optional(),
});

type Props = React.PropsWithChildren<{
  setPlayerID: React.Dispatch<React.SetStateAction<number>>;
}>;

const NewPlayerInvitePage: React.FC<Props> = ({ setPlayerID }: Props) => {
  const { action, state } = useStateMachine(updateAction);
  const [submitting, setSubmitting] = useState(false);
  const [firstName, setFirstName] = useState(
    state.userData.firstName ? state.userData.firstName : null
  );
  const [lastName, setLastName] = useState(
    state.userData.lastName ? state.userData.lastName : null
  );
  const [email, setEmail] = useState(
    state.userData.email ? state.userData.email : null
  );
  const [phoneNumber, setPhoneNumber] = useState(
    state.userData.phoneNumber ? state.userData.phoneNumber : null
  );
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const { errors, register } = useForm<UserSignUpFormValues>({
    resolver: joiResolver(AdminInviteFormSchema),
  });

  async function onSubmit(event?: React.BaseSyntheticEvent): Promise<void> {
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
          email,
          name: `${firstName} ${lastName}`,
          phoneNumber,
        } as AdminCreateUserDTO),
      });
      if (!response.ok) {
        throw await response.json();
      }
      action({
        email,
        firstName,
        lastName,
        phoneNumber,
      });
      const player = await fetch("/api/admin/users/readOneEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
        } as UserDTO),
      });
      if (!player.ok) {
        throw await player.json();
      }
      const newPlayer = await player.json();
      setPlayerID(newPlayer.user.id);
      setConfirm(
        "You have sent an invite to this player and may continue on with the form!"
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <div className="mt-10">
      <form className="mt-10">
        <fieldset>
          <legend className="text-sm font-light mb-8">
            A player dashboard must be linked to a player member. Create a
            player member in order to create their dashboard.
          </legend>
          <FormField
            label="First Name"
            name="firstName"
            error={errors.firstName?.message}
          >
            <input
              type="text"
              className="input w-2/5 text-sm"
              id="firstName"
              name="firstName"
              placeholder="e.g., Cristiano"
              ref={register}
              defaultValue={state.userData.firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </FormField>
          <FormField
            label="Last Name"
            name="lastName"
            error={errors.lastName?.message}
          >
            <input
              type="text"
              className="input w-2/5 text-sm"
              id="lastName"
              name="lastName"
              placeholder="e.g., Ronaldo"
              ref={register}
              defaultValue={state.userData.lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </FormField>
          <FormField
            label="Email Address"
            name="email"
            error={errors.email?.message}
          >
            <input
              type="text"
              className="input w-7/12 text-sm"
              id="email"
              name="email"
              placeholder="e.g., soccer@fifa.com"
              ref={register}
              defaultValue={state.userData.email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </FormField>
          <FormField
            label="Phone Number"
            name="phoneNumber"
            error={errors.phoneNumber?.message}
          >
            <input
              type="text"
              className="input text-sm"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="e.g., 123-456-7890"
              ref={register}
              defaultValue={state.userData.phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
            />
          </FormField>
        </fieldset>
        <div className="my-10">
          <div className="mb-2 flex">
            <Button
              className="button-primary px-10 py-2 mr-5"
              onClick={() => onSubmit()}
            >
              Send Invite
            </Button>
          </div>
          {confirm}
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default NewPlayerInvitePage;
