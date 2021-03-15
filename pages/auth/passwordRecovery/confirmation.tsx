import Link from "next/link";

const Confirmation: React.FC = () => {
  return (
    <div className="flex ml-20 justify-center flex-col space-y-7 h-screen">
      <div>
        <p className="text-6xl font-semibold">Password Changed!</p>
        <div className="flex flex-col mt-10">
          <div>
            <p className="text-gray-600">
              Your password has been changed successfully!
            </p>
          </div>
          <div className="flex flex-row mt-10">
            <p className="text-gray-600">Continue to the </p>{" "}
            <Link href="/api/auth/signin">
              <a className="ml-1 text-blue hover:font-semibold">
                Oakland Genesis Soccer Club Portal
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
