import Link from "next/link";

const Confirmation: React.FC = () => {
  return (
    <div className="flex ml-20 justify-center flex-col space-y-7 h-screen">
      <div>
        <p className="text-6xl font-semibold">
          Oops! This link is no longer valid.
        </p>
        <div className="flex flex-col mt-10">
          <div>
            <p className="text-gray-600">
              The password reset link you used is invalid or expired, possibly
              because it’s already been used.
            </p>
          </div>
          <div className="flex flex-row mt-10">
            <p className="text-gray-600">Please request a </p>{" "}
            <Link href="/auth/forgotPassword">
              <a className="ml-1 text-blue hover:font-semibold">
                new password reset.
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
