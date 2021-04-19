import { Dialog, Transition } from "@headlessui/react";
import React from "react";

type Props = React.PropsWithChildren<{
  open?: boolean;
  onClose: () => void;
  className?: string;
}>;

const Modal: React.FC<Props> = ({
  children,
  open = false,
  onClose,
  className,
}: Props) => {
  return (
    <Transition show={open} as={React.Fragment}>
      <Dialog
        open={open}
        onClose={onClose}
        className="fixed inset-0 overscroll-auto w-full"
        static
      >
        <div className="min-h-screen flex items-center">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-dark bg-opacity-25" />
          </Transition.Child>
          <Transition.Child
            as={React.Fragment}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <div
              className={`fixed z-10 inset-x-0 m-auto bg-white rounded-lg px-10 pt-12 pb-8 shadow-xl w-1/2 h-auto ${
                className ?? ""
              }`}
            >
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
