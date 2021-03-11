import Joi from "lib/validate";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Button from "components/Button";
import { useRouter } from "next/router";
import FormField from "components/FormField";
import { NewPasswordUserDTO } from "pages/api/auth/reset-password";
import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

type PasswordRecoveryFormValues = {
  newPassword: string;
  confirmPassword: string;
};

const PasswordRecoveryFormSchema = Joi.object<PasswordRecoveryFormValues>({
  newPassword: Joi.forbidden().required(),
  confirmPassword: Joi.forbidden().required(),
});

const PasswordRecovery: React.FC = () => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [revealPassword, setRevealPassword] = useState(false);
  const [revealConfirmPassword, setRevealConfirmPassword] = useState(false);
  const resetCodeId = router.query.resetCode; // as string;

  // useEffect(() => {
  //   let mounted = true;
  //   const getUser = async (): Promise<void> => {
  //     if (mounted) {
  //       // if (

  //       // ) {
  //       //   throw new Error("Invalid resetCodeId");
  //       // }

  //       const resetPasswordRecord = await prisma.resetPassword.findOne({
  //         where: { id: resetCodeId },
  //       });
  //       if (
  //         Joi.string().uuid({ version: "uuidv4" }).validate(resetCodeId)
  //           .error ||
  //         !resetPasswordRecord ||
  //         resetPasswordRecord.isUsed
  //       ) {
  //         router.push("/users/acceptInvite/error?type=noAccess");
  //       }
  //     }
  //     mounted = false;
  //   };
  //   if (resetCodeId) {
  //     getUser();
  //   }
  // }, [resetCodeId, router]);

  const {
    errors,
    register,
    handleSubmit,
  } = useForm<PasswordRecoveryFormValues>({
    resolver: joiResolver(PasswordRecoveryFormSchema),
  });

  async function onSubmit(
    values: PasswordRecoveryFormValues,
    event?: React.BaseSyntheticEvent
  ): Promise<void> {
    event?.preventDefault();
    if (submitting) {
      return;
    }
    try {
      if (values.newPassword !== values.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          newPassword: values.newPassword,
          resetCodeId,
        } as NewPasswordUserDTO),
      });
      if (!response.ok) {
        throw await response.json();
      } else {
        router.push("/passwordRecovery/confirmation");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="form flex ml-20 mt-10 mr-32 flex-col">
      <p className="text-6xl font-semibold mb-4">Password Recovery</p>
      <p className="pt-6 text-2xl h-16">Create a new password</p>
      <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <FormField
            label="New Password"
            name="newPassword"
            error={errors.newPassword?.message}
          >
            <input
              type={revealPassword ? "text" : "password"}
              className="input input-full"
              name="newPassword"
              ref={register}
            />
            <button
              className="text-sm text-gray-500"
              type="button"
              onClick={() => setRevealPassword(!revealPassword)}
            >
              {revealPassword ? "Hide password" : "Show password"}
            </button>
          </FormField>
          <FormField
            label="Re-enter New Password"
            name="confirmPassword"
            error={errors.confirmPassword?.message}
          >
            <input
              type={revealConfirmPassword ? "text" : "password"}
              className="input input-full"
              name="confirmPassword"
              ref={register}
            />
            <button
              className="text-sm text-gray-500"
              type="button"
              onClick={() => setRevealConfirmPassword(!revealConfirmPassword)}
            >
              {revealConfirmPassword ? "Hide password" : "Show password"}
            </button>
          </FormField>
          <div className="flex mt-24 mb-32 justify-end align-middle">
            <div className="mb-2 flex ">
              <Button
                className="button-primary text-base px-10 py-2 "
                type="submit"
              >
                Reset Password
              </Button>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default PasswordRecovery;
