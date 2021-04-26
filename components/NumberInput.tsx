import React from "react";

export type NumberInputProps = React.ComponentPropsWithRef<"input"> & {
  unit?: string;
};

const NumberInput: React.FC<NumberInputProps> = ({
  unit,
  ...props
}: NumberInputProps) => {
  const input = (
    <input
      {...props}
      className={`${props.className ?? ""} input max-w-sm`}
      type="number"
    />
  );
  if (unit) {
    return (
      <div className="flex items-center">
        {input}
        <p className="ml-3 mr-6">{unit}</p>
      </div>
    );
  }
  return input;
};

NumberInput.defaultProps = {
  unit: undefined,
};

export default NumberInput;
