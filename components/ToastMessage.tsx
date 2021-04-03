import React from "react";

type Props = React.PropsWithChildren<{
  open?: boolean;
  className: string;
}>;

const Toast: React.FC<Props> = ({ children, open, className }: Props) => {
  return open ? (
    <div
      className={`absolute animation: fade-in bg-dark text-white rounded shadow-lg ${className}`}
    >
      {children}
    </div>
  ) : null;
};

export default Toast;
