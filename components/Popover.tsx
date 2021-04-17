import React from "react";
import { Popover } from "@headlessui/react";

type Props = React.PropsWithChildren<{
  trigger: React.ReactElement;
}>;

const WrappedPopover: React.FC<Props> = ({ children, trigger }: Props) => {
  return (
    <Popover className="relative">
      <Popover.Button className="focus:outline-none">{trigger}</Popover.Button>
      <Popover.Panel className="absolute z-10">{children}</Popover.Panel>
    </Popover>
  );
};

export default WrappedPopover;
