import { joiResolver } from "@hookform/resolvers/joi";
import Button from "components/Button";
import PlayerFormField from "components/PlayerFormField";
import Joi from "joi";
import { useStateMachine } from "little-state-machine";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import updateAction from "utils/updateActionPlayer";
import DashboardLayout from "components/DashboardLayout";
import PlayerFormLayout from "components/Player/PlayerFormLayout";
import { PlayerProfileFormValues } from ".";

export type OverviewFormValues = Pick<
  PlayerProfileFormValues,
  | "BioAboutMe"
  | "BioHobbies"
  | "BioFavoriteSubject"
  | "BioMostDifficultSubject"
  | "BioSiblings"
  | "BioParents"
>;

const PlayerProfileFormSchema = Joi.object<OverviewFormValues>({
  BioAboutMe: Joi.string().empty("").default(null),
  BioHobbies: Joi.string().empty("").default(null),
  BioFavoriteSubject: Joi.string().empty("").default(null),
  BioMostDifficultSubject: Joi.string().empty("").default(null),
  BioSiblings: Joi.string().empty("").default(null),
  BioParents: Joi.string().empty("").default(null),
});

const UserSignUpPageOne: React.FC = () => {
  const router = useRouter();

  // TODO: Add loading state to form submission
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { errors, register, handleSubmit } = useForm<OverviewFormValues>({
    resolver: joiResolver(PlayerProfileFormSchema),
  });
  const { action, state } = useStateMachine(updateAction);

  async function onSubmit(
    values: OverviewFormValues,
    event?: React.BaseSyntheticEvent
  ): Promise<void> {
    event?.preventDefault();
    if (submitting) {
      return;
    }
    try {
      action(values);
      router.push("/admin/players/playerForm/engagement");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="form flex mx-20 mt-24 flex-col">
        <p className="py-6 text-2xl h-16 tracking-wide font-medium">
          Create a new player profile
        </p>
        <p className="font-light mt-2">Description Here</p>
        <PlayerFormLayout tabNum={2}>
          <p className="pt-10 text-xl tracking-wider font-medium">
            Student Bio
          </p>
          <form className="mt-10 " onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
              <div className="grid grid-rows-2">
                <PlayerFormField
                  label="About Me"
                  name="BioAboutMe"
                  error={errors.BioAboutMe?.message}
                >
                  <input
                    type="text"
                    className="input text-sm w-full"
                    name="BioAboutMe"
                    placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                    ref={register}
                    defaultValue={state.playerData.BioAboutMe}
                  />
                </PlayerFormField>
                <PlayerFormField
                  label="Hobbies"
                  name="BioHobbies"
                  error={errors.BioHobbies?.message}
                >
                  <input
                    type="text"
                    className="input text-sm w-full"
                    name="BioHobbies"
                    placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                    ref={register}
                    defaultValue={state.playerData.BioHobbies}
                  />
                </PlayerFormField>
                <PlayerFormField
                  label="Favorite Subject"
                  name="BioFavoriteSubject"
                  error={errors.BioFavoriteSubject?.message}
                >
                  <input
                    type="text"
                    className="input text-sm w-full"
                    name="BioFavoriteSubject"
                    placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                    ref={register}
                    defaultValue={state.playerData.BioFavoriteSubject}
                  />
                </PlayerFormField>
                <PlayerFormField
                  label="Most Difficult Subject"
                  name="BioMostDifficultSubject"
                  error={errors.BioMostDifficultSubject?.message}
                >
                  <input
                    type="text"
                    className="input text-sm w-full"
                    name="BioMostDifficultSubject"
                    placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                    ref={register}
                    defaultValue={state.playerData.BioMostDifficultSubject}
                  />
                </PlayerFormField>
                <PlayerFormField
                  label="Siblings"
                  name="BioSiblings"
                  error={errors.BioSiblings?.message}
                >
                  <input
                    type="text"
                    className="input text-sm w-full"
                    name="BioSiblings"
                    placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                    ref={register}
                    defaultValue={state.playerData.BioSiblings}
                  />
                </PlayerFormField>
                <PlayerFormField
                  label="Parents"
                  name="BioParents"
                  error={errors.BioParents?.message}
                >
                  <input
                    type="text"
                    className="input text-sm w-full"
                    name="BioParents"
                    placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                    ref={register}
                    defaultValue={state.playerData.BioParents}
                  />
                </PlayerFormField>
              </div>
              <hr className="border-unselected border-opacity-50 my-16" />
              <div className="flex mb-32 justify-between align-middle">
                <div className="mb-2 flex">
                  <Button
                    className="bg-blue text-base px-5 py-2 text-white tracking-wide rounded-md"
                    type="submit"
                  >
                    Save + Continue
                  </Button>
                  <Button
                    className="border-2 border-blue text-blue bg-white text-base px-12 py-2 ml-10 rounded-md tracking-wide"
                    type="submit"
                  >
                    Cancel
                  </Button>
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
              </div>
              <hr />
            </fieldset>
          </form>
        </PlayerFormLayout>
      </div>
    </DashboardLayout>
  );
};

export default UserSignUpPageOne;
