import Icon, { IconType } from "./Icon";

type Props = React.PropsWithChildren<{
  className?: string;
  iconType?: IconType;
  onClick?: React.MouseEventHandler;
  pill?: boolean;
  type?: "button" | "submit" | "reset";
}> &
  React.HTMLProps<HTMLButtonElement>;

const Button: React.FC<Props> = ({
  children,
  className = "",
  iconType,
  onClick,
  pill,
  type = "button",
  ...additionalButtonProps
}: Props) => {
  return (
    <button
      className={`button button-normal ${
        pill ? "rounded-full" : "rounded"
      } ${className}`}
      onClick={onClick}
      // eslint-disable-next-line react/button-has-type
      type={type}
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
