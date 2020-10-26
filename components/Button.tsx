import Icon, { IconType } from "./Icon";

type Props = React.PropsWithChildren<{
  className?: string;
  iconType?: IconType;
  onClick?: React.MouseEventHandler;
  pill?: boolean;
}>;

const Button: React.FC<Props> = ({
  children,
  className = "",
  iconType,
  onClick,
  pill,
}) => {
  return (
    <button
      className={`bg-button flex items-center px-6 py-3 font-medium ${
        pill ? "rounded-full" : "rounded"
      } ${className}`}
      onClick={onClick}
      type="button"
    >
      {iconType && (
        <Icon
          className="fill-current stroke-current h-4 mr-5"
          type={iconType}
        />
      )}
      {children}
    </button>
  );
};

export default Button;
