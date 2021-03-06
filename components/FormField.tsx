import React from "react";

type Props = React.PropsWithChildren<{
  label: string;
  name: string;
  error?: string;
  mb?: number;
}>;

const FormField: React.FC<Props> = ({
  children,
  error,
  label,
  name,
  mb = 8,
}: Props) => {
  return (
    <label className={`text-sm font-semibold block mb-${mb}`} htmlFor={name}>
      <p className="mb-1">{label}</p>
      {children}
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </label>
  );
};

export default FormField;
