import {
  ProfileCategory,
  ProfileFieldsByCategory,
  UncategorizedProfileFields,
} from "interfaces";
import { useRouter } from "next/router";
import { useCreateProfileContext } from "pages/admin/players/create/[profileCategory]";
import React from "react";
import BarTab from "./ProgressBar";

type Props = {
  children: React.ReactNode;
};

const categories = Object.values(ProfileCategory);
export const usePlayerFormCategoryIndex = (): number => {
  const router = useRouter();
  const currentTabIndex = categories.findIndex(
    (category: ProfileCategory) => router.query.profileCategory === category
  );
  return currentTabIndex;
};

const PlayerFormLayout: React.FC<Props> = ({ children }: Props) => {
  const currentTabIndex = usePlayerFormCategoryIndex();
  const { state } = useCreateProfileContext();

  const categorizedErrors = Object.fromEntries(
    Object.values(ProfileCategory).map((category) => [
      category,
      ProfileFieldsByCategory[category]
        .map((key) => state.player?.profile?.[key]?.error)
        .filter(
          (errorOrNone): errorOrNone is string => errorOrNone !== undefined
        ),
    ])
  );

  return (
    <div className="text-dark">
      <div className="mt-6 flex">
        <BarTab
          fill
          content="1. Basic Info"
          title=""
          errorCount={
            UncategorizedProfileFields.map(
              (key) => state.player?.profile?.[key]?.error
            ).filter((error): error is string => error !== undefined).length
          }
        />
        {categories.map((category: ProfileCategory, index: number) => {
          const displayIndex = index + 2;
          return (
            <BarTab
              fill={currentTabIndex >= index}
              content={`${displayIndex}. ${category}`}
              title={category}
              disabled={state.player === null}
              errorCount={categorizedErrors[category].length}
            />
          );
        })}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default PlayerFormLayout;
