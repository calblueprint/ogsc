import Joi from "lib/validate";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Button from "components/Button";
import { useRouter } from "next/router";
import FormField from "components/FormField";
import { ForgotPasswordUserDTO } from "pages/api/auth/forgot-password";
import SignUpLayout from "components/SignUpLayout";

type ForgotPasswordFormValues = {
  email: string;
};

const ForgotPasswordFormSchema = Joi.object<ForgotPasswordFormValues>({
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } }),
});

const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { errors, register, handleSubmit } = useForm<ForgotPasswordFormValues>({
    resolver: joiResolver(ForgotPasswordFormSchema),
  });

  async function onSubmit(
    values: ForgotPasswordFormValues,
    event?: React.BaseSyntheticEvent
  ): Promise<void> {
    event?.preventDefault();
    if (submitting) {
      return;
    }
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: values.email,
        } as ForgotPasswordUserDTO),
      });
      if (!response.ok) {
        throw await response.json();
      } else {
        router.push("/auth/forgotPassword/confirmation");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SignUpLayout>
      <div className="form flex mr-32 flex-col">
        <p className="text-6xl font-semibold mb-4">Password Recovery</p>
        <p className="pt-6 text-2xl h-16">Forgot your password?</p>
        <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <FormField
              label="Email Address"
              name="email"
              error={errors.email?.message}
            >
              <p className="text-xs mb-3 font-normal">
                Enter the email associated with your account and we’ll send you
                an account recovery link. Follow the instructions provided to
                reset your password.
              </p>
              <input
                type="text"
                className="input input-full"
                name="email"
                placeholder="e.g., soccer@FIFA.com"
                ref={register}
              />
            </FormField>
            <div className="flex mt-24 mb-20 justify-end">
              <div className="mb-2 flex ">
                <Button
                  className="button-primary text-base px-10 py-2 "
                  type="submit"
                >
                  Send Link
                </Button>
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
            </div>
          </fieldset>
        </form>
      </div>
    </SignUpLayout>
  );
};

export default ForgotPassword;
