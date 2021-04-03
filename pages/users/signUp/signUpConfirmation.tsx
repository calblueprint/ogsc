import SignUpLayout from "components/SignUpLayout";

const Confirmation: React.FC = () => (
  <SignUpLayout>
    <div className="flex justify-center self-center ml-20 mt-20 flex-wrap space-y-6 flex-col mx-16">
      <div>
        <p className="w-1/2 text-6xl">Thanks for signing up!</p>
        <p className="w-1/2 mt-10 text-2xl">
          Your Oakland Genesis Soccer Club account request has been sent! We’ll
          send you a notice once you’ve been approved.
        </p>
      </div>
    </div>
  </SignUpLayout>
);

export default Confirmation;
