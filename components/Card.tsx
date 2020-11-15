import React from "react";

type Props = React.PropsWithChildren<{
  text: string;
  onDelete: React.MouseEventHandler;
}>;

const Card: React.FC<Props> = ({ children, text, onDelete }: Props) => {
  return (
    <div className="rounded-md border border-gray-500 my-3 w-1/3">
      <div className="flex justify-between p-2">
        <div>{text}</div>
        <button
          type="button"
          className="text-gray-500 hover:font-bold hover:text-black"
          onClick={onDelete}
        >
          x
        </button>
      </div>
      {children}
    </div>
  );
};

export default Card;
