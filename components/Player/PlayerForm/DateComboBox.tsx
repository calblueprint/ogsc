import React, { useState } from "react";
import Icon from "components/Icon";
import Button from "components/Button";

type BoxProps = React.PropsWithChildren<{
  items: string[];
  placeholder: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
  short?: boolean;
}>;

const Combobox: React.FC<BoxProps> = ({
  items,
  placeholder,
  setState,
  short,
}: BoxProps) => {
  const [dropDown, setDropDown] = useState(false);
  const [text, setText] = useState(placeholder);

  function onClick(category: string): void {
    setDropDown(false);
    setText(category);
    setState(category);
  }

  return (
    <div>
      <Button
        className={`p-2 border border-unselected w-40 h-10 rounded-lg bg-transparent font-light text-black ${
          text === "" ? "justify-end" : "justify-between"
        }`}
        onClick={() => setDropDown(!dropDown)}
      >
        <p className="ml-2 text-sm">{text}</p>
        <Icon className="w-3 h-3 stroke-current -ml-6 mr-3" type="chevron" />
      </Button>
      {dropDown && (
        <div className="absolute h-10 w-40 bg-white">
          <div className="relative rounded-lg border border-unselected bg-white w-full text-sm">
            <ul
              className={`list-reset relative overflow-auto ${
                short ? "" : "h-48"
              }`}
            >
              {items.map((name: string) => (
                <li className="hover:bg-hover rounded-lg">
                  <button
                    type="button"
                    onClick={() => onClick(name)}
                    className="w-full text-left"
                  >
                    <a className="px-4 py-2 block self-start">{name}</a>
                  </button>
                  <hr className="border-unselected" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Combobox;
