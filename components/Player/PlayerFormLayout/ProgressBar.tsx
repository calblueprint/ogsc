import Link from "next/link";

type BarProps = {
  fill: boolean;
  content: string;
  title: string;
  disabled?: boolean;
};

const BarTab: React.FunctionComponent<BarProps> = ({
  fill,
  content,
  title,
  disabled,
}: BarProps) => {
  const link = `/admin/players/create/${title}`;
  return (
    <Link href={link}>
      <button
        type="button"
        className={`text-left focus:outline-none ${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        disabled={disabled}
      >
        <div
          className={
            fill
              ? "bg-blue h-2 rounded-full"
              : "bg-placeholder h-2 rounded-full"
          }
        />
        <p className="font-bold mt-2 text-xs">{content}</p>
      </button>
    </Link>
  );
};

BarTab.defaultProps = {
  disabled: false,
};

export default BarTab;
