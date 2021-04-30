import { Transition } from "@headlessui/react";
import colors from "constants/colors";
import Link from "next/link";
import React, { useState } from "react";

type BarProps = {
  fill: boolean;
  errorCount?: number;
  content: string;
  title: string;
  disabled?: boolean;
};

const BarTab: React.FunctionComponent<BarProps> = ({
  fill,
  errorCount = 0,
  content,
  title,
  disabled,
}: BarProps) => {
  const link = `/admin/players/create/${title}`;
  const [hoveringOverError, setHoveringOverError] = useState(false);

  return (
    <Link href={link}>
      <button
        type="button"
        className={`text-left focus:outline-none mr-2 flex-1 ${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        disabled={disabled}
        onMouseEnter={() => setHoveringOverError(true)}
        onMouseLeave={() => setHoveringOverError(false)}
      >
        <div
          className={`${fill ? "bg-blue" : "bg-placeholder"} ${
            errorCount ? "bg-error" : ""
          } h-2 rounded-full`}
        />
        <div className="flex h-full mt-1 items-center">
          <p className="font-bold text-xs">{content}</p>
          {errorCount > 0 && (
            <div className="h-4 w-4 ml-2 rounded-full bg-error text-white text-center font-bold text-xs relative">
              <span>!</span>
              <Transition
                show={hoveringOverError}
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <div className="absolute bg-dark w-16 py-1 font-semibold rounded -ml-6 mt-2">
                  {errorCount} error{errorCount > 1 ? "s" : ""}
                  <div
                    className="absolute w-0 h-0"
                    style={{
                      top: "-5px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      borderLeft: "5px solid transparent",
                      borderRight: "5px solid transparent",

                      borderBottom: `5px solid ${colors.dark}`,
                    }}
                  />
                </div>
              </Transition>
            </div>
          )}
        </div>
      </button>
    </Link>
  );
};

BarTab.defaultProps = {
  disabled: false,
  errorCount: 0,
};

export default BarTab;
