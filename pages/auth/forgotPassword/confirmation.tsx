import Link from "next/link";

const Confirmation: React.FC = () => {
  return (
    <div className="flex ml-20 justify-center flex-col space-y-7 h-screen">
      <div>
        <p className="text-6xl font-semibold">Check your email</p>
        <div className="flex flex-row">
          <p className="text-gray-600">
            We’ve sent password recovery instructions to your provided email. If
            you haven’t recieved it, check your spam box or{" "}
          </p>{" "}
          <Link href="/auth/forgotPassword">
            <a className="ml-1 text-blue hover:font-semibold">resend email.</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
