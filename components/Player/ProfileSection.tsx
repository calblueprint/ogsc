import { ProfileFieldKey, UserRoleType } from "@prisma/client";
import Button from "components/Button";
import Icon from "components/Icon";
import { IPlayer } from "interfaces";
import { ProfileAccessDefinitionsByRole } from "lib/access/definitions";
import resolveAccessValue from "lib/access/resolve";
import superjson from "superjson";
import { serializeProfileFieldValue } from "utils/buildUserProfile";
import useReactChildrenUtils from "utils/useReactChildrenUtils";
import useSessionInfo from "utils/useSessionInfo";
import React, { useContext } from "react";
import ProfileContext, { ProfileSectionContext } from "./ProfileContext";
import ProfileFieldCell, { ProfileFieldCellProps } from "./ProfileFieldCell";

export type Props = React.PropsWithChildren<{
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

  const profileFieldKeys = (Children?.deepMap(
    children,
    (child: React.ReactNode) => {
      if (
        typeof child !== "object" ||
        child === null ||
        !("type" in child) ||
        !player
      ) {
        return null;
      }
      if (child.type === ProfileFieldCell) {
        return (child.props as ProfileFieldCellProps).fieldKey;
      }
      return null;
    }
  ) as (ProfileFieldKey | null)[] | undefined)?.filter(
    (key: ProfileFieldKey | null): key is ProfileFieldKey => key !== null
  );
  const canEditSection =
    currentUserType === UserRoleType.Admin ||
    profileFieldKeys?.some((key: ProfileFieldKey) => {
      if (!player) {
        return false;
      }
      const accessValue = ProfileAccessDefinitionsByRole[currentUserType][key];
      return (
        accessValue !== undefined &&
        resolveAccessValue(accessValue, "write", player, user)
      );
    });

  const editing = editingState.sections[sectionName]?.editing;

  async function onSubmit(): Promise<void> {
    if (!player || !profileFieldKeys) {
      return;
    }
    const allDrafts = profileFieldKeys
      .filter((key: ProfileFieldKey) => player?.profile?.[key]?.draft != null)
      .map((key: ProfileFieldKey) => {
        return {
          key,
          // Optional access only to satisfy types. This case is prevented from the filter above.
          value: serializeProfileFieldValue(player?.profile?.[key]),
        };
      });
    const response = await fetch("/api/profileFields", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playerId: player.id,
        fields: allDrafts,
      }),
    });
    if (response.ok) {
      dispatch({
        type: "SAVE_SECTION",
        section: sectionName,
        updatedPlayer: superjson.parse<IPlayer>((await response.json()).player),
      });
    }
  }

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
      <div className="col-span-2 max-w-2xl">
        <ProfileSectionContext.Provider value={sectionName}>
          {children}
        </ProfileSectionContext.Provider>
        {editing && (
          <div className="flex flex-row gap-4 justify-end pb-4">
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
              className="bg-blue text-sm px-12 py-2 text-white tracking-wide rounded-md"
              onClick={onSubmit}
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
