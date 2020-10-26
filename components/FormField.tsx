import React from "react";

type Props = React.PropsWithChildren<{
  label: string;
  name: string;
}>;

const FormField: React.FC<Props> = ({ children, label, name }: Props) => {
  return (
    <label className="font-medium block mb-8" htmlFor={name}>
      <p className="mb-3">{label}</p>
      {children}
    </label>
  );
};

export default FormField;
