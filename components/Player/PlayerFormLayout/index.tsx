import { ProfileCategory } from "interfaces";
import { useRouter } from "next/router";
import React from "react";
import BarTab from "./ProgressBar";

type Props = {
  children: React.ReactNode;
};

const PlayerFormLayout: React.FC<Props> = ({ children }: Props) => {
  const categories = Object.values(ProfileCategory);
  const router = useRouter();
  const currentTabIndex = categories.findIndex(
    (category: ProfileCategory) => router.query.profileCategory === category
  );

  return (
    <div className="text-dark">
      <div className="mt-6 grid grid-cols-7 gap-4">
        <BarTab fill content="1. Basic Info" title="" />
        {categories.map((category: ProfileCategory, index: number) => {
          const displayIndex = index + 2;
          return (
            <BarTab
              fill={currentTabIndex >= index}
              content={`${displayIndex}. ${category}`}
              title={category}
            />
          );
        })}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default PlayerFormLayout;
