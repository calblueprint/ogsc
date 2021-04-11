import { useState } from "react";
import prisma from "utils/prisma";
import { NextPageContext } from "next";
import { useRouter } from "next/router";
import { getSession } from "next-auth/client";

import DashboardLayout from "components/DashboardLayout";
import PlayerProfile from "components/Player/Profile";
import Modal from "components/Modal";
import Button from "components/Button";
import sanitizeUser from "utils/sanitizeUser";
import buildUserProfile from "utils/buildUserProfile";
import filterPlayerProfileRead from "utils/filterPlayerProfileRead";
import flattenUserRoles from "utils/flattenUserRoles";
import { IPlayer } from "interfaces";

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

const PlayerProfilePage: React.FunctionComponent<Props> = ({
  player,
}: Props) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState<boolean>(
    Boolean(router.query.success)
  );
  if (!player) {
    return <DashboardLayout>No player found</DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="flex mt-20 flex-wrap space-y-6 flex-col mx-16">
        <div className="header flex items-center">
          <div className="picture flex mr-10">
            <img
              src="/placeholder-profile.png"
              alt={player.name || "player"}
              className="bg-button rounded-full max-w-full align-middle border-none w-24 h-24"
            />
          </div>
          <div className="player-info grid grid-rows-2">
            <p className="pt-6 text-2xl font-semibold">{player.name}</p>
            <p className="pt-2 text-sm font-medium">
              {player.profile?.PlayerNumber?.current &&
                `#${player.profile?.PlayerNumber.current}`}
            </p>
          </div>
        </div>
        <Modal className="w-2/5" open={showModal}>
          <h1 className="text-dark text-3xl font-medium mb-2">
            Dashboard Created!
          </h1>
          <p className="text-dark mb-10">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            semper, massa sed tempor rhoncus, tortor lectus luctus orci,
            suscipit commodo nunc quam eu risus.
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
        <PlayerProfile player={player} />
      </div>
    </DashboardLayout>
  );
};

PlayerProfilePage.defaultProps = {
  player: undefined,
};

export default PlayerProfilePage;
