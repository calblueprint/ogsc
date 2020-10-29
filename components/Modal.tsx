import React from "react";

type Props = React.PropsWithChildren<{
  open?: boolean;
}>;

const Modal: React.FC<Props> = ({ children, open }: Props) => {
  return open ? (
    <div className="absolute top-0 left-0 w-screen h-screen bg-dark bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded w-1/2 px-10 pt-12 pb-8">{children}</div>
    </div>
  ) : null;
};

export default Modal;
