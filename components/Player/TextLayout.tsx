import React from "react";

type TextProps = React.PropsWithChildren<{
  title: string | null;
  // add prop for Last Updated
}>;

const TextLayout: React.FunctionComponent<TextProps> = ({
  title,
  children,
}: TextProps) => {
  if (title) {
    return (
      <div className="mb-5">
        <div className="flex flex-row text-sm">
          <div className="flex flex-col w-40 font-semibold text-blue">
            <div>{title}</div>
          </div>
          <div className="flex flex-col ml-24 font-normal">
            <div>{children}</div>
          </div>
        </div>
      </div>
    );
  }
  return <div className="mb-5 text-sm font-normal">{children}</div>;
};

export default TextLayout;
