import React from "react";
import Icon from "components/Icon";

type EditProps = React.PropsWithChildren<{
  text: string;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}>;

const SuccessfulChange: React.FunctionComponent<EditProps> = ({
  text,
  setSuccess,
}: EditProps) => {
  return (
    <div className=" bg-mutedPalette-success-muted text-palette-success p-4 flex justify-between rounded-lg place-items-center">
      <div className="flex flex-row ">
        <Icon type="checkmark" className="h-6 stroke-current mr-4" />
        {text}
      </div>
      <button type="button" className="ml-4" onClick={() => setSuccess(false)}>
        x
      </button>
    </div>
  );
};

export default SuccessfulChange;
