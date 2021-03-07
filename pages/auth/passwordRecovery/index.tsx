import Joi from "lib/validate";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Button from "components/Button";
import { useRouter } from "next/router";
import FormField from "components/FormField";
import { NewPasswordUserDTO } from "pages/api/auth/reset-password";

type PasswordRecoveryFormValues = {
  email?: string;
  newPassword: string;
  confirmPassword: string;
};

const PasswordRecoveryFormSchema = Joi.object<PasswordRecoveryFormValues>({
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .optional(),
  newPassword: Joi.forbidden().required(),
  confirmPassword: Joi.forbidden().required(),
});

const PasswordRecovery: React.FC = () => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [revealPassword, setRevealPassword] = useState(false);
  const [revealConfirmPassword, setRevealConfirmPassword] = useState(false);

  const {
    errors,
    register,
    handleSubmit,
  } = useForm<PasswordRecoveryFormValues>({
    resolver: joiResolver(PasswordRecoveryFormSchema),
  });
  const resetCodeId = router.query.resetCode;

  // useEffect(() => {
  //   let mounted = true;
  //   const getUser = async (): Promise<void> => {
  //     if (mounted) {
  //       const response = await fetch(`/api/invites/${resetCodeId}`, {
  //         method: "GET",
  //         headers: { "content-type": "application/json" },
  //         redirect: "follow",
  //       });
  //       const data = await response.json();
  //       if (!response.ok || !data.user) {
  //         router.push("/users/acceptInvite/error?type=noAccess");
  //       } else if (data.user.status !== UserStatus.PendingUserAcceptance) {
  //         router.push("/users/acceptInvite/error?type=expired");
  //       } else {
  //         setUser(data.user);
  //         action({ email: `${data.user.email}` });
  //       }
  //     }
  //     mounted = false;
  //   };
  //   if (resetCodeId) {
  //     getUser();
  //   }
  // }, [action, resetCodeId, router]);

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
        // confirmation page?
        router.push("/admin/players");
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
          <FormField label="Email Address" name="email" error="">
            <input
              type="text"
              className="input input-full"
              name="email"
              ref={register}
              defaultValue={resetCodeId}
              disabled
            />
          </FormField>
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
