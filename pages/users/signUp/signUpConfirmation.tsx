import SignUpLayout from "components/SignUpLayout";

const Confirmation: React.FC = () => (
  <SignUpLayout>
    <div className="flex justify-center self-center mt-10 flex-wrap space-y-6 flex-col mx-5 pb-48">
      <div>
        <p className="w-1/2 text-6xl font-semibold mb-4">
          Thanks for signing up!
        </p>
        <p className="w-3/4 mt-10 text-2xl">
          Your Oakland Genesis Soccer Club account request has been sent! We’ll
          send you a notice once you’ve been approved.
        </p>
      </div>
    </div>
  </SignUpLayout>
);

export default Confirmation;
