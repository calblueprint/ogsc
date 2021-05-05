import { Dialog } from "@headlessui/react";
import { Absence, ProfileFieldKey } from "@prisma/client";
import DashboardLayout from "components/DashboardLayout";
import Icon from "components/Icon";
import ProfileContext, {
  ProfileContextType,
  useProfileContext,
} from "components/Player/ProfileContext";
import ProfileFieldEditorModal from "components/Player/ProfileFieldEditorModal";
import PlayerProfile from "components/Player/Profile";
import Modal from "components/Modal";
import Button from "components/Button";
import {
  IAbsence,
  IPlayer,
  IProfileField,
  ProfileFieldValueDeserializedTypes,
  ProfileFieldValues,
} from "interfaces";
import { getSession } from "next-auth/client";
import { useRouter } from "next/router";
import { NextPageContext } from "next";
import { UpdateOneAbsenceDTO } from "pages/api/absences/update";
import React, { useCallback, useContext, useEffect, useState } from "react";
import buildUserProfile, {
  deserializeProfileFieldValue,
  serializeProfileFieldValue,
} from "utils/buildUserProfile";
import filterPlayerProfileRead from "utils/filterPlayerProfileRead";
import flattenUserRoles from "utils/flattenUserRoles";
import isAbsence from "utils/isAbsence";
import prisma from "utils/prisma";
import sanitizeUser from "utils/sanitizeUser";
import useCanEditField from "utils/useCanEditField";
import useSessionInfo from "utils/useSessionInfo";
import useProfilePicture from "utils/useProfilePicture";

type Props = {
  player?: IPlayer;
};

export async function getServerSideProps(
  context: NextPageContext
): Promise<{ props: Props }> {
  const id = context.query.id as string;
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    include: {
      absences: true,
      profileFields: true,
      roles: true,
      playerNotes: true,
    },
  });
  if (user === null) {
    // TODO: Set statusCode to 404
    return { props: {} };
  }

  const session = await getSession({ req: context.req });
  if (!session) {
    // TODO: Set statusCode to 401
    return { props: {} };
  }
  const authenticatedUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { roles: true },
  });
  if (!authenticatedUser) {
    // TODO: Set statusCode to 401
    return { props: {} };
  }

  return {
    props: {
      player: filterPlayerProfileRead(
        buildUserProfile(flattenUserRoles(sanitizeUser(user))),
        flattenUserRoles(authenticatedUser)
      ),
    },
  };
}

const PlayerProfileHeader: React.FC = () => {
  const router = useRouter();
  const session = useSessionInfo();
  const canEditProfilePicture = useCanEditField(ProfileFieldKey.ProfilePicture);
  const canEditBirthYear = useCanEditField(ProfileFieldKey.YearOfBirth);
  const { state } = useContext(ProfileContext);
  const { player } = state;

  // const profilePicture = useProfilePicture(player);
  const profilePicture = useProfilePicture(player?.id);

  const profilePictureCurrentField = state.player?.profile?.ProfilePicture?.history.find(
    (profileField: IProfileField<typeof ProfileFieldKey.ProfilePicture>) =>
      profileField.id === state.player?.profile?.ProfilePicture?.current?.id
  );
  const birthYearCurrentField = state.player?.profile?.YearOfBirth?.history.find(
    (profileField: IProfileField<typeof ProfileFieldKey.YearOfBirth>) =>
      profileField.id === state.player?.profile?.YearOfBirth?.current?.id
  );

  return (
    <>
      <div>
        <Button
          className="bg-white text-blue px-4 font-light hover:font-semibold"
          onClick={() => {
            router.push(`/${session.sessionType.toLocaleLowerCase()}/players`);
          }}
        >
          <Icon type="back" className="mr-3" /> BACK TO ALL PLAYERS
        </Button>
      </div>
      <div className="header flex items-center">
        <div className="picture flex mr-10">
          <img
            src={profilePicture}
            alt={player?.name || "player"}
            className="bg-button rounded-full max-w-full align-middle border-none w-24 h-24"
          />
          {canEditProfilePicture && (
            <ProfileFieldEditorModal
              trigger={
                <div className="pt-16 pl-20 absolute">
                  <button
                    type="button"
                    className="bg-button w-8 h-8 rounded-full flex justify-center items-center"
                  >
                    <Icon type="camera" />
                  </button>
                </div>
              }
              {...(profilePictureCurrentField
                ? { field: profilePictureCurrentField }
                : { fieldKey: ProfileFieldKey.ProfilePicture })}
            />
          )}
        </div>
        <div className="player-info grid grid-rows-2">
          <p className="pt-6 text-2xl font-semibold">{player?.name}</p>
          <div className="flex justify-between items-center h-10">
            <p className="text-sm font-medium">
              Birth Year:{" "}
              {deserializeProfileFieldValue(
                player?.profile?.YearOfBirth?.current
              )}
            </p>
            {canEditBirthYear && (
              <ProfileFieldEditorModal
                trigger={
                  <Button className="w-8 h-8 p-0 rounded-full text-dark stroke-0 flex justify-center items-center bg-button">
                    <Icon className="w-4 h-4" type="edit" />
                  </Button>
                }
                {...(birthYearCurrentField
                  ? { field: birthYearCurrentField }
                  : { fieldKey: ProfileFieldKey.YearOfBirth })}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const PlayerProfilePage: React.FunctionComponent<Props> = ({
  player,
}: Props) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState<boolean>(
    Boolean(router.query.success)
  );
  const [state, dispatch] = useProfileContext();
  useEffect(() => {
    if (player) {
      dispatch({ type: "SET_PLAYER", player });
    }
  }, [player, dispatch]);
  const refreshProfile = useCallback(() => {
    router.replace(router.asPath);
  }, [router]);

  const createField: ProfileContextType["createField"] = useCallback(
    async function createField(fieldKey, draft, userId): Promise<void> {
      const serializedValue = JSON.stringify(
        fieldKey === "absence"
          ? {
              absences: [draft as Partial<Absence>],
              playerId: userId,
            }
          : {
              playerId: userId,
              fields: [
                {
                  key: fieldKey,
                  value: serializeProfileFieldValue(
                    draft as ProfileFieldValueDeserializedTypes[ProfileFieldValues[ProfileFieldKey]],
                    fieldKey
                  ),
                },
              ],
            }
      );

      const response = await fetch(
        fieldKey === "absence" ? "/api/absences" : "/api/profileFields",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: serializedValue,
        }
      );
      if (!response.ok) {
        throw await response.json();
      }
      refreshProfile();
    },
    [refreshProfile]
  );

  const updateField: ProfileContextType["updateField"] = useCallback(
    async function updateField(field: IProfileField | IAbsence): Promise<void> {
      if (!field.draft) {
        return;
      }
      const serializedValue = isAbsence(field)
        ? JSON.stringify({
            date: field.draft?.date,
            description: field.draft?.description,
            reason: field.draft?.reason,
            type: field.draft?.type,
            userId: field.draft?.userId,
          } as UpdateOneAbsenceDTO)
        : JSON.stringify({
            value: serializeProfileFieldValue(field.draft, field.key),
          });
      const response = await fetch(
        isAbsence(field)
          ? `/api/absences/${field.id}`
          : `/api/profileFields/${field.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: serializedValue,
        }
      );
      if (!response.ok) {
        throw await response.json();
      }
      refreshProfile();
    },
    [refreshProfile]
  );

  const deleteField: ProfileContextType["deleteField"] = useCallback(
    async function deleteField(
      fieldKey: ProfileFieldKey | "absence",
      id: number
    ): Promise<void> {
      const response = await fetch(
        fieldKey === "absence"
          ? `/api/absences/${id}`
          : `/api/profileFields/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw await response.json();
      }
      refreshProfile();
    },
    [refreshProfile]
  );

  if (!player) {
    return <DashboardLayout>No player found</DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <ProfileContext.Provider
        value={{ state, dispatch, createField, updateField, deleteField }}
      >
        <div className="flex mt-20 flex-wrap space-y-6 flex-col mx-16">
          <PlayerProfileHeader />
          <PlayerProfile player={player} />
          <Modal
            className="w-2/5"
            open={showModal}
            onClose={() => setShowModal(false)}
          >
            <Dialog.Title className="text-dark text-3xl font-medium mb-2">
              Dashboard Created!
            </Dialog.Title>
            <p className="text-dark mb-10">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse semper, massa sed tempor rhoncus, tortor lectus luctus
              orci, suscipit commodo nunc quam eu risus.
            </p>
            <div className="flex justify-end">
              <Button
                className="button-primary px-10 py-3"
                onClick={() => setShowModal(false)}
              >
                Done
              </Button>
            </div>
          </Modal>
        </div>
      </ProfileContext.Provider>
    </DashboardLayout>
  );
};

PlayerProfilePage.defaultProps = {
  player: undefined,
};

export default PlayerProfilePage;
