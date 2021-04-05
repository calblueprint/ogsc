import React, { useState } from "react";

type Props = React.PropsWithChildren<{
  trigger: React.ReactElement;
}>;

const Popover: React.FC<Props> = ({ children, trigger }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      {React.cloneElement(trigger, {
        onClick: () => {
          trigger.props?.onClick?.();
          setOpen((prevOpen) => !prevOpen);
        },
      })}
      {open && <div className="absolute">{children}</div>}
    </>
  );
};

export default Popover;
