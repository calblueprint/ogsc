import Icon, { IconType } from "components/Icon";

type ScoreBoxProps = {
  score: number | null;
  icon: IconType;
  title: string;
  // add prop for Last Updated
};

const ScoreBox: React.FunctionComponent<ScoreBoxProps> = ({
  score,
  icon,
  title,
}: ScoreBoxProps) => {
  return (
    <div>
      <div className="text-lg font-bold mb-4">{title}</div>
      <div className="flex bg-button rounded-2xl flex-col">
        <div className="flex flex-col">
          <Icon type={icon} className="w-6 mx-5 mt-5 text-unselected" />
          <div className="flex flex-row self-center justify-center">
            <div className="p-4 text-5xl font-bold">{score}</div>
            <div className="text-sm font-bold self-center h-0">/ 10</div>
          </div>
          <div className="text-sm self-center font-medium text-unselected mb-10 mt-2">
            Last Updated
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreBox;
