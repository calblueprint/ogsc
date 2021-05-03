import React from "react";
import Icon from "./Icon";

type Props = React.PropsWithChildren<{
  text: string | null;
  onDelete: React.MouseEventHandler;
  maxSize?: boolean;
}>;

const Card: React.FC<Props> = ({
  children,
  text,
  onDelete,
  maxSize,
}: Props) => {
  return (
    <div
      className={`rounded-md border-2 border-medium-gray my-3 ${
        maxSize ? "w-full" : "w-1/3"
      }`}
    >
      <div className="flex justify-between py-2 px-3">
        <div className="text-sm font-medium self-center">{text}</div>
        <button
          type="button"
          className="text-medium-gray fill-current hover:font-bold hover:text-black"
          onClick={onDelete}
        >
          <Icon type="close" />
        </button>
      </div>
      {children}
    </div>
  );
};

export default Card;
