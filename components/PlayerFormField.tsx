import React from "react";

type Props = React.PropsWithChildren<{
  label: string;
  name: string;
  error?: string;
}>;

const PlayerFormField: React.FC<Props> = ({
  children,
  error,
  label,
  name,
}: Props) => {
  return (
    <label className="font-medium block mb-12" htmlFor={name}>
      <p className="mb-3 text-sm tracking-wide">{label}</p>
      {children}
      {error && (
        <p className="text-red-600 text-sm mt-1 tracking-wide">{error}</p>
      )}
    </label>
  );
};

export default PlayerFormField;
