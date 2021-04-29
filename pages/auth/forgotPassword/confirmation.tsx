import Link from "next/link";
import SignUpLayout from "components/SignUpLayout";

const Confirmation: React.FC = () => {
  return (
    <SignUpLayout>
      <div className="flex justify-center pt-24">
        <div className="pb-64">
          <p className="text-6xl font-semibold">Check your email</p>
          <div className="flex flex-wrap">
            <p className="text-gray-600 pr-20">
              We’ve sent password recovery instructions to your provided email.
              If you haven’t recieved it, check your spam box or{" "}
            </p>{" "}
            <Link href="/auth/forgotPassword">
              <a className="ml-1 text-blue hover:underline hover:font-semibold">
                resend email.
              </a>
            </Link>
          </div>
        </div>
      </div>
    </SignUpLayout>
  );
};

export default Confirmation;
