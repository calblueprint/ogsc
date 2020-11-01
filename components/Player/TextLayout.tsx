type TextProps = {
  title: string | null;
  content: string | null | number;
  // add prop for Last Updated
};

const TextLayout: React.FunctionComponent<TextProps> = ({
  title,
  content,
}: TextProps) => {
  if (title) {
    return (
      <div className="mb-5">
        <div className="flex flex-row text-sm font-medium tracking-wide">
          <div className="flex flex-col w-48">
            <div>{title}</div>
          </div>
          <div className="flex flex-col ml-24 font-light">
            <div>{content}</div>
          </div>
        </div>
      </div>
    );
  }
  return <div className="mb-5 text-sm font-light">{content}</div>;
};

export default TextLayout;
