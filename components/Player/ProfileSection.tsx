import { UserRoleType } from "@prisma/client";
import Button from "components/Button";
import Icon from "components/Icon";
import ProfileAccessDefinitionsByRole from "lib/access/definitions";
import resolveAccessValue from "lib/access/resolve";
import useReactChildrenUtils from "utils/useReactChildrenUtils";
import useSessionInfo from "utils/useSessionInfo";
import React, { useContext } from "react";
import ProfileContext, { ProfileSectionContext } from "./ProfileContext";
import ProfileFieldCell, { ProfileFieldCellProps } from "./ProfileFieldCell";

type Props = React.PropsWithChildren<{
  sectionName: string;
}>;

const ProfileSection: React.FC<Props> = ({ children, sectionName }: Props) => {
  const Children = useReactChildrenUtils();
  const { user } = useSessionInfo();
  const {
    defaultRole: { type: currentUserType },
  } = user;
  const {
    state: { editingState, player },
    dispatch,
  } = useContext(ProfileContext);

  const canEditSection =
    currentUserType === UserRoleType.Admin ||
    Children?.deepFind(children, (child: React.ReactNode) => {
      if (
        typeof child !== "object" ||
        child === null ||
        !("type" in child) ||
        !player
      ) {
        return false;
      }
      if (child.type === ProfileFieldCell) {
        const { fieldKey } = child.props as ProfileFieldCellProps;
        const accessValue =
          ProfileAccessDefinitionsByRole[currentUserType][fieldKey];
        return (
          accessValue !== undefined &&
          resolveAccessValue(accessValue, "write", player, user)
        );
      }
      return false;
    });

  const editing = editingState.sections[sectionName]?.editing;

  return (
    <div className="mt-10 grid grid-cols-3">
      <div className="flex flex-row">
        <div className="mb-6 text-lg font-semibold pr-6">{sectionName}</div>
        {canEditSection && !editing && (
          <button
            type="button"
            onClick={() =>
              dispatch({ type: "OPEN_EDIT_SECTION", section: sectionName })
            }
            className="h-6"
          >
            <Icon
              type="edit"
              className="w-3 h-3 text-dark-gray fill-current stroke-2"
            />
          </button>
        )}
      </div>
      <div className="col-span-2">
        <ProfileSectionContext.Provider value={sectionName}>
          {children}
        </ProfileSectionContext.Provider>
        {editing && (
          <div className="flex flex-row gap-8 justify-end pb-4">
            <Button
              type="button"
              className="border border-blue text-blue bg-white text-sm px-10 py-2 rounded-md tracking-wide"
              onClick={() =>
                dispatch({ type: "CLOSE_EDIT_SECTION", section: sectionName })
              }
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue text-sm px-12 py-2 text-white tracking-wide rounded-md"
              onClick={() => onSubmit()}
            >
              Save
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;
