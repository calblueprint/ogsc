import SignUpLayout from "components/SignUpLayout";
import Link from "next/link";
import React from "react";

const Confirmation: React.FC = () => (
  <SignUpLayout>
    <div className="flex justify-center self-center mt-10 flex-wrap space-y-6 flex-col mx-5 pb-48">
      <div>
        <p className="w-1/2 text-6xl font-semibold mb-4">
          You&apos;re all set!
        </p>
        <p className="w-3/4 mt-10 text-2xl mb-16">
          Your Oakland Genesis Soccer Club account has been created! You can log
          into your account{" "}
          <Link href="/api/auth/signin">
            <a className="ml-1 text-blue hover:underline hover:font-semibold text-2xl">
              here.
            </a>
          </Link>
        </p>
      </div>
    </div>
  </SignUpLayout>
);

export default Confirmation;
