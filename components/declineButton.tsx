/* eslint-disable react/button-has-type */
const DeclineButton: React.FunctionComponent = () => (
  <div className="flex space-x-4">
    <div>
      <button className="bg-red-200 hover:bg-red-200 text-danger font-bold py-2 px-4 rounded">
        Decline
      </button>
    </div>
  </div>
);
export default DeclineButton;
