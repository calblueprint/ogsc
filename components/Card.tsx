import React from "react";

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
    <div>
      {maxSize ? (
        <div>
          <div className="rounded-md border border-gray-500 my-3 w-full">
            <div className="flex justify-between py-2 px-3">
              <div className="text-sm font-light self-center">{text}</div>
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
        </div>
      ) : (
        <div>
          <div className="rounded-md border border-gray-500 my-3 w-1/3">
            <div className="flex justify-between py-2 px-3">
              <div className="text-sm font-light self-center">{text}</div>
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
        </div>
      )}
    </div>
  );
};

export default Card;
