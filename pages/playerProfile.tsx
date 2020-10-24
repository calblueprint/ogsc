import { useState } from "react";

const PlayerNavBar: React.FunctionComponent = () => {
  const [title, setTitle] = useState("Overview");
  const Button = (category: string): unknown => {
    return (
      <button
        type="button"
        className={
          title === category
            ? "bg-gray-300 py-3 px-8 rounded-full"
            : "py-3 px-8 rounded-full"
        }
        onClick={() => {
          setTitle(category);
        }}
      >
        {category}
      </button>
    );
  };
  return (
    <div>
      <div className="flex flex-row justify-between text-xs text-center">
        {Button("Overview")}
        {Button("Engagement")}
        {Button("Academic Performance")}
        {Button("Attendance")}
        {Button("Physical Wellness")}
        {Button("Highlights")}
      </div>
      <div className="mt-12 mb-10 text-xl">{title}</div>
      {/* TODO: add profile content to each tab */}
    </div>
  );
};

const PlayerProfile: React.FunctionComponent = () => (
  <div className="flex mt-20 flex-wrap space-y-6 flex-col mx-16">
    <div className="header flex">
      <div className="picture flex mr-10">
        <img
          src="/reference to pic"
          alt="..."
          className="shadow rounded-full max-w-full align-middle border-none w-24 h-24"
        />
      </div>
      <div className="player-info grid grid-rows-2">
        <p className="pt-6 text-xl">Player Name</p>
        <p className="pt-2 text-xs">Player Number</p>
      </div>
    </div>
    {PlayerNavBar({})}
  </div>
);

export default PlayerProfile;
