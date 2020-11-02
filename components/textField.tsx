const title = "Student Bio";

const textField: React.FunctionComponent = () => (
  <div className="block">
    <span className="text-gray-700">{title} </span>
    <textarea
      className="form-textarea mt-1 block w-full"
      placeholder="notes..."
    />
  </div>
);
export default textField;
