import { useState } from "react";
import {
  Absence,
  PrismaClient,
  ProfileField,
  Role,
  User,
} from "@prisma/client";
import { NextPageContext } from "next";
import { useRouter } from "next/router";

import DashboardLayout from "components/DashboardLayout";
import PlayerProfile from "components/Player/Profile";
import Modal from "components/Modal";
import Button from "components/Button";
import sanitizeUser from "utils/sanitizeUser";
import buildUserProfile from "utils/buildUserProfile";
import flattenUserRoles from "utils/flattenUserRoles";

type Props = {
  player?: Omit<
    User & {
      absences: Absence[];
      profileFields: ProfileField[];
      roles: Role[];
    },
    "hashedPassword"
  >;
};

export async function getServerSideProps(
  context: NextPageContext
): Promise<{ props: Props }> {
  const prisma = new PrismaClient();
  const id = context.query.id as string;
  const user = await prisma.user.findOne({
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

  return {
    props: {
      player: JSON.parse(JSON.stringify(sanitizeUser(user))),
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
  const hydratedPlayer = flattenUserRoles(buildUserProfile(player));

  return (
    <DashboardLayout>
      <div className="flex mt-20 flex-wrap space-y-6 flex-col mx-16">
        <div className="header flex items-center">
          <div className="picture flex mr-10">
            <img
              src="/placeholder-profile.png"
              alt={hydratedPlayer.name || "player"}
              className="bg-button rounded-full max-w-full align-middle border-none w-24 h-24"
            />
          </div>
          <div className="player-info grid grid-rows-2">
            <p className="pt-6 text-2xl font-semibold">{hydratedPlayer.name}</p>
            <p className="pt-2 text-sm font-medium">
              {hydratedPlayer.profile?.PlayerNumber.current &&
                `#${hydratedPlayer.profile?.PlayerNumber.current}`}
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
        <PlayerProfile player={hydratedPlayer} />
      </div>
    </DashboardLayout>
  );
};

PlayerProfilePage.defaultProps = {
  player: undefined,
};

export default PlayerProfilePage;
