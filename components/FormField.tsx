import React from "react";

type Props = React.PropsWithChildren<{
  label: string;
  name: string;
  error?: string;
}>;

const FormField: React.FC<Props> = ({
  children,
  error,
  label,
  name,
}: Props) => {
  return (
    <label className="font-medium block mb-8" htmlFor={name}>
      <p className="mb-3">{label}</p>
      {children}
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </label>
  );
};

export default FormField;
