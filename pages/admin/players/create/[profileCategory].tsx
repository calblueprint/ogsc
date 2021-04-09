import { ProfileFieldKey } from "@prisma/client";
import Button from "components/Button";
import DashboardLayout from "components/DashboardLayout";
import Icon from "components/Icon";
import PlayerFormLayout from "components/Player/PlayerFormLayout";
import ProfileFieldEditor from "components/Player/ProfileFieldEditor";
import { ProfileCategory, ProfileFieldsByCategory } from "interfaces";
import { useRouter } from "next/router";
import React, { useState } from "react";
import labelProfileField from "utils/labelProfileField";

const CreatePlayerProfilePage: React.FC = () => {
  const [error] = useState(null);
  const router = useRouter();
  const category = router.query.profileCategory as ProfileCategory;

  return (
    <DashboardLayout>
      <div className="form flex mx-20 mt-24 flex-col">
        <p className="py-6 text-2xl h-16 tracking-wide font-medium">
          Create a new player profile
        </p>
        <p className="font-light mt-2">Description Here</p>
        <PlayerFormLayout>
          <p className="pt-10 text-xl tracking-wider font-medium">
            Student Bio
          </p>
          <form className="mt-10" onSubmit={undefined}>
            <fieldset>
              {ProfileFieldsByCategory[category].map(
                (field: ProfileFieldKey) => (
                  <>
                    <p>{labelProfileField(field)}</p>
                    <ProfileFieldEditor profileField={field} />
                  </>
                )
              )}
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <hr className="border-unselected border-opacity-50 my-16" />
              <div className="flex mb-32">
                <div className="mb-2 flex justify-between w-full">
                  <Button
                    className="text-blue bg-white text-sm py-2 rounded-md tracking-wide"
                    onClick={() => router.push("/admin/players/create")}
                  >
                    <Icon className="mr-6 w-8 stroke-current" type="back" />
                    Back
                  </Button>
                  <Button
                    className="bg-blue text-sm px-5 py-2 text-white tracking-wide rounded-md"
                    type="submit"
                  >
                    Next Step
                    <Icon className="ml-6 w-8 stroke-current" type="next" />
                  </Button>
                </div>
              </div>
              <hr />
            </fieldset>
          </form>
        </PlayerFormLayout>
      </div>
    </DashboardLayout>
  );
};

export default CreatePlayerProfilePage;
