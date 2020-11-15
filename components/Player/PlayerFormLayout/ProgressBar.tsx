import Link from "next/link";

type BarProps = {
  fill: boolean;
  content: string;
  title: string;
};

const BarTab: React.FunctionComponent<BarProps> = ({
  fill,
  content,
  title,
}: BarProps) => {
  const link = `/admin/players/playerForm/${title}`;
  return (
    <Link href={link}>
      <div role="button">
        <div
          className={
            fill
              ? "bg-darkBlue h-2 rounded-full"
              : "bg-placeholder h-2 rounded-full"
          }
        />
        <p className="font-bold mt-2 text-xs">{content}</p>
      </div>
    </Link>
  );
};

export default BarTab;
