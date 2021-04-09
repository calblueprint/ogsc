import { signIn } from "next-auth/client";
import Joi from "lib/validate";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Button from "components/Button";
import { useRouter } from "next/router";
import Link from "next/link";
import FormField from "components/FormField";
import SignUpLayout from "components/SignUpLayout";

type UserSignInFormValues = {
  email: string;
  password: string;
};

const UserSignInFormSchema = Joi.object<UserSignInFormValues>({
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } }),
  password: Joi.string().required(),
});

const SignIn: React.FC = () => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [revealPassword, setRevealPassword] = useState(false);
  const { errors, register, handleSubmit } = useForm<UserSignInFormValues>({
    resolver: joiResolver(UserSignInFormSchema),
  });

  useEffect(() => {
    if (router.query.error) {
      setError(router.query.error as string);
    }
    if (router.query.email) {
      setEmail(router.query.email as string);
    }
  }, [router.query.error, router.query.email]);

  async function onSubmit(
    values: UserSignInFormValues,
    event?: React.BaseSyntheticEvent
  ): Promise<void> {
    event?.preventDefault();
    if (submitting) {
      return;
    }
    try {
      await signIn("credentials", {
        email: values.email,
        password: values.password,
        callbackUrl: `${window.location.origin}`,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SignUpLayout>
      <div className="form flex mt-10 mr-32 flex-col">
        <p className="text-6xl font-semibold mb-4">Welcome Back</p>
        <p className="pt-6 text-2xl h-16">Login to Your Account</p>
        <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <FormField label="Email" name="email" error={errors.email?.message}>
              <input
                type="text"
                className="input input-full"
                name="email"
                ref={register}
                defaultValue={email}
              />
            </FormField>
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
                  ref={register}
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
            <div className="flex flex-row">
              <Link href="/auth/forgotPassword">
                <a className="ml-1 text-gray-600 hover:text-blue hover:underline hover:font-semibold">
                  Forgot your password?
                </a>
              </Link>
            </div>
            <div className="flex mt-24 mb-32 justify-between align-middle">
              <div className="flex flex-row">
                <p className="text-gray-600">New to Oakland Genesis Club? </p>{" "}
                <Link href="/users/signUp">
                  <a className="ml-1 text-blue hover:underline hover:font-semibold">
                    Create an account here.
                  </a>
                </Link>
              </div>
              <div className="mb-2 flex ">
                <Button
                  className="button-primary text-base px-10 py-2 "
                  type="submit"
                >
                  Sign In
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

export default SignIn;
