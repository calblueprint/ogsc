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
      <div className="mb-6">
        <div className="flex flex-col text-sm">
          <div className="flex flex-col font-semibold text-dark mb-1">
            <div>{title}</div>
          </div>
          <div className="flex flex-col font-normal">{children}</div>
        </div>
      </div>
    );
  }
  return <div className="mb-6 text-sm font-normal">{children}</div>;
};

export default TextLayout;
