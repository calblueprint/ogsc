import SignUpLayout from "components/SignUpLayout";
import Link from "next/link";
import { useRouter } from "next/router";

enum Title {
  NoAccess = "Oops! You don’t have access.",
  Expired = "Oops! This link is no longer valid.",
}

enum Text {
  NoAccess = "It seems like you don’t have access to this page. Please contact ______________ if you believe that this is an error.",
  Expired = "This invitation link has expired or has already been accepted. Please contact ______________ if you believe that this is an error.",
}

const Error: React.FC = () => {
  const router = useRouter();

  // let title = "Oops! You don’t have access.";
  // let text =
  //   "It seems like you don’t have access to this page. Please contact ______________ if you believe that this is an error.";
  // if (router.query.type === "expired") {
  //   title = "Oops! This link is no longer valid.";
  //   text =
  //     "This invitation link has expired or has already been accepted. Please contact ______________ if you believe that this is an error.";
  // }
  return (
    <SignUpLayout>
      <div className="flex ml-20 justify-center flex-col space-y-7 h-screen">
        <div>
          <p className="text-6xl">
            {router.query.type === "expired" ? Title.Expired : Title.NoAccess}
          </p>
          <p className="text-base w-3/5">
            {router.query.type === "expired" ? Text.Expired : Text.NoAccess}
          </p>
        </div>
        <div className="absolute bottom-0 mb-20">
          <div className="flex flex-row">
            <p className="text-gray-600">New to Oakland Genesis Club? </p>{" "}
            <Link href="/users/signUp">
              <a className="ml-1 text-blue hover:font-semibold">
                Create an account here.
              </a>
            </Link>
          </div>
          <div className="flex flex-row mt-5">
            <p className="text-gray-600">Already have an account? </p>{" "}
            {/* TODO: Update signin form */}
            <Link href="/api/auth/signin">
              <a className="ml-1 text-blue hover:font-semibold">Login here.</a>
            </Link>
          </div>
        </div>
      </div>
    </SignUpLayout>
  );
};

export default Error;
