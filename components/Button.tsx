import Icon, { IconType } from "./Icon";

type Props = React.PropsWithChildren<{
  className?: string;
  iconType?: IconType;
  onClick?: React.MouseEventHandler;
  pill?: boolean;
}> &
  React.HTMLAttributes<HTMLButtonElement>;

const Button: React.FC<Props> = ({
  children,
  className = "",
  iconType,
  onClick,
  pill,
  ...additionalButtonProps
}: Props) => {
  return (
    <button
      className={`button button-normal ${
        pill ? "rounded-full" : "rounded"
      } ${className}`}
      onClick={onClick}
      type="button"
      {...additionalButtonProps}
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
