import React from "react";

type EditProps = React.PropsWithChildren<{
  title: string | null | undefined;
  currentText: string | null | undefined;
  setState: React.Dispatch<React.SetStateAction<string>>;
}>;

const TextLayout: React.FunctionComponent<EditProps> = ({
  title,
  currentText,
  setState,
  children,
}: EditProps) => {
  if (title) {
    return (
      <div className="mb-5">
        <div className="flex flex-col text-sm">
          <div className="flex flex-col font-semibold text-dark">
            <div>{title}:</div>
          </div>
          <div className="flex flex-col font-normal">
            <input
              type="text"
              className="input"
              name={title}
              defaultValue={currentText || ""}
              onChange={(event) => setState(event.target.value)}
            />
            <div>{children}</div>
          </div>
        </div>
      </div>
    );
  }
  return <div className="mb-5 text-sm font-normal">{children}</div>;
};

export default TextLayout;
