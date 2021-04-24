import { UserRoleType, UserStatus } from "@prisma/client";
import { useRouter } from "next/router";
import DashboardLayout from "components/DashboardLayout";
import React, { useState, useEffect } from "react";
import Button from "components/Button";
import FormField from "components/FormField";
import { IUser, UserRoleLabel } from "interfaces";
import Joi from "lib/validate";
import { joiResolver } from "@hookform/resolvers/joi";
import { UpdateUserDTO } from "pages/api/admin/users/update";
import { useForm } from "react-hook-form";
import { NextPageContext } from "next";
import prisma from "utils/prisma";
import Combobox from "components/Combobox";
import { ViewingPermissionDTO } from "pages/api/admin/roles/create";
import flattenUserRoles from "utils/flattenUserRoles";
import sanitizeUser from "utils/sanitizeUser";
import Modal from "components/Modal";
import { Dialog } from "@headlessui/react";

interface ResendConfirmationProps {
  isResending: boolean;
  setIsResending: React.Dispatch<React.SetStateAction<boolean>>;
  setSubmitter: React.Dispatch<React.SetStateAction<string>>;
  getValues: () => AdminEditUserInviteFormValues;
  onSubmit: (values: AdminEditUserInviteFormValues) => Promise<void>;
}

const ResendConfirmation: React.FunctionComponent<ResendConfirmationProps> = ({
  isResending,
  setIsResending,
  setSubmitter,
  getValues,
  onSubmit,
}) => {
  return (
    <>
      <Modal
        open={isResending}
        onClose={() => setIsResending(false)}
        className="max-w-xl"
      >
        <Dialog.Title className="text-lg font-medium text-dark">
          Re-sending this invite will save invite changes
        </Dialog.Title>
        <p className="text-sm font-normal text-dark pt-2 pb-10">
          By re-sending this invite, any changes you&apos;ve made will
          automatically be saved and updated.
        </p>
        <div className="mb-2 flex float-right">
          <Button
            className="px-10 py-2 mr-5 hover:bg-button text-unselected bg-opacity-0"
            onClick={() => {
              setIsResending(false);
            }}
          >
            Don&apos;t Send
          </Button>
          <Button
            className="button-primary px-10 py-2 text-blue hover:bg-blue-muted bg-opacity-0"
            type="submit"
            onClick={() => {
              setSubmitter("resend");
              onSubmit(getValues());
            }}
          >
            Save and Send
          </Button>
        </div>
      </Modal>
    </>
  );
};

interface AdminEditUserInviteFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: UserRoleType;
}

type gsspProps = {
  user?: IUser;
  relatedPlayers?: IUser[];
};

export async function getServerSideProps(
  context: NextPageContext
): Promise<{ props: gsspProps }> {
  const id = context.query.id as string;

  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    include: { roles: true },
  });

  if (user === null) {
    // TODO: Set statusCode to 404
    return { props: {} };
  }

  const relatedPlayerIds = user.roles
    .filter(
      (role) =>
        role.type === "Mentor" ||
        role.type === "Donor" ||
        role.type === "Parent"
    )
    .map((role) => role.relatedPlayerId)
    .filter(
      (relatedPlayerId): relatedPlayerId is number => relatedPlayerId !== null
    );

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: relatedPlayerIds,
      },
    },
    include: {
      roles: true,
    },
  });

  return {
    props: {
      user: flattenUserRoles(sanitizeUser(user)),
      relatedPlayers: users.map(sanitizeUser).map(flattenUserRoles),
    },
  };
}

const AdminEditUserFormSchema = Joi.object<AdminEditUserInviteFormValues>({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required(),
  phoneNumber: Joi.string()
    .phoneNumber({ defaultCountry: "US", format: "national", strict: true })
    .optional(),
  role: Joi.string()
    .valid(...Object.values(UserRoleType))
    .required(),
});

const UserInvitation: React.FunctionComponent<gsspProps> = ({
  relatedPlayers,
}) => {
  const [user, setUser] = useState<IUser>();

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const getUser = async (): Promise<void> => {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "GET",
        headers: { "content-type": "application/json" },
        redirect: "follow",
      });
      const data = await response.json();

      // check user is pending
      if (data.user.status !== UserStatus.PendingUserAcceptance) {
        throw new Error("Invalid user invite");
      }
      setUser(data.user);
    };
    getUser();
  }, [id]);

  const [notSaved, setNotSaved] = useState(false);

  useEffect(() => {
    const confirmationMessage =
      "You have unsaved changes. Leaving this page will discard any unsaved changes.";
    const beforeUnloadHandler = (e: BeforeUnloadEvent): string => {
      (e || window.event).returnValue = confirmationMessage;
      return confirmationMessage; // Gecko + Webkit, Safari, Chrome etc.
    };
    const beforeRouteHandler = (url: string): void => {
      // eslint-disable-next-line no-alert
      if (router.pathname !== url && !window.confirm(confirmationMessage)) {
        router.events.emit("routeChangeError");
        // eslint-disable-next-line no-throw-literal
        throw `Route change to "${url}" was aborted (this error can be safely ignored). See https://github.com/zeit/next.js/issues/2476.`;
      }
    };
    if (notSaved) {
      window.addEventListener("beforeunload", beforeUnloadHandler);
      router.events.on("routeChangeStart", beforeRouteHandler);
    } else {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
      router.events.off("routeChangeStart", beforeRouteHandler);
    }
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
      router.events.off("routeChangeStart", beforeRouteHandler);
    };
  }, [notSaved, router.events, router.pathname]);

  const [submitting, setSubmitting] = useState(false);
  const [submitter, setSubmitter] = useState<string>("");
  const [error, setError] = useState("");
  const [currRole, setCurrRole] = useState<UserRoleType>();
  const [selectedPlayers, setSelectedPlayers] = useState<IUser[]>([]);
  const [isResending, setIsResending] = useState(false);
  const {
    errors,
    register,
    handleSubmit,
    getValues,
  } = useForm<AdminEditUserInviteFormValues>({
    resolver: joiResolver(AdminEditUserFormSchema),
  });

  useEffect(() => {
    setCurrRole(user?.defaultRole.type);
    if (!relatedPlayers) {
      setSelectedPlayers([]);
    } else {
      setSelectedPlayers(relatedPlayers);
    }
  }, [relatedPlayers, user]);

  async function onSubmit(
    values: AdminEditUserInviteFormValues,
    event?: React.BaseSyntheticEvent
  ): Promise<void> {
    event?.preventDefault();
    if (submitting) {
      return;
    }
    const linkedPlayers: ViewingPermissionDTO[] = [];
    selectedPlayers.forEach((role) => {
      const body = (JSON.stringify({
        type: currRole,
        userId: user?.id,
        relatedPlayerId: role.id,
      }) as unknown) as ViewingPermissionDTO;
      linkedPlayers.push(body);
    });
    let role = [
      (JSON.stringify({
        type: currRole,
        userId: user?.id,
      }) as unknown) as ViewingPermissionDTO,
    ];
    role = linkedPlayers.length > 0 ? linkedPlayers : role;
    try {
      const response = await fetch(`/api/admin/users/${user?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: values.email,
          name: `${values.firstName} ${values.lastName}`,
          phoneNumber: values.phoneNumber,
          roles: role,
          sendEmail: submitter === "resend",
        } as UpdateUserDTO),
      });

      if (!response.ok) {
        throw await response.json();
      } else {
        setUser((await response.json()).user);
        setNotSaved(false);
        router.push("/admin/invite");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-16 mt-24">
        <h1 className="text-3xl font-display font-medium mb-2">Edit Invite</h1>
        <p>Description</p>
        <form
          className="mt-10"
          id="editInviteForm"
          onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset>
            <legend className="text-lg font-semibold mb-8">
              Basic Information
            </legend>
            <FormField
              label="First Name"
              name="firstName"
              error={errors.firstName?.message}
            >
              {user?.name ? (
                <input
                  type="text"
                  className="input input-full"
                  name="firstName"
                  defaultValue={user?.name?.split(" ")[0]}
                  placeholder="e.g., Cristiano"
                  ref={register}
                  onChange={() => setNotSaved(true)}
                />
              ) : (
                <input
                  type="text"
                  className="input input-full"
                  name="firstName"
                  placeholder="e.g., Cristiano"
                  ref={register}
                  onChange={() => setNotSaved(true)}
                />
              )}
            </FormField>
            <FormField
              label="Last Name"
              name="lastName"
              error={errors.lastName?.message}
            >
              {user?.name ? (
                <input
                  type="text"
                  className="input input-full"
                  name="lastName"
                  defaultValue={
                    user?.name?.split(" ").length === 1
                      ? undefined
                      : user?.name?.substr(user?.name?.indexOf(" ") + 1)
                  }
                  placeholder="e.g., Ronaldo"
                  ref={register}
                  onChange={() => setNotSaved(true)}
                />
              ) : (
                <input
                  type="text"
                  className="input input-full"
                  name="lastName"
                  placeholder="e.g., Ronaldo"
                  ref={register}
                  onChange={() => setNotSaved(true)}
                />
              )}
            </FormField>
            <FormField
              label="Email Address"
              name="email"
              error={errors.email?.message}
            >
              {user?.email ? (
                <input
                  type="text"
                  className="input input-full"
                  name="email"
                  defaultValue={user?.email}
                  placeholder="e.g., soccer@fifa.com"
                  ref={register}
                  onChange={() => setNotSaved(true)}
                />
              ) : (
                <input
                  type="text"
                  className="input"
                  name="email"
                  placeholder="e.g., soccer@fifa.com"
                  ref={register}
                  onChange={() => setNotSaved(true)}
                />
              )}
            </FormField>
            <FormField
              label="Phone Number"
              name="phoneNumber"
              error={errors.phoneNumber?.message}
            >
              {user?.phoneNumber ? (
                <input
                  type="text"
                  className="input"
                  name="phoneNumber"
                  defaultValue={user?.phoneNumber}
                  placeholder="e.g., 123-456-7890"
                  ref={register}
                  onChange={() => setNotSaved(true)}
                />
              ) : (
                <input
                  type="text"
                  className="input"
                  name="phoneNumber"
                  placeholder="e.g., 123-456-7890"
                  ref={register}
                  onChange={() => setNotSaved(true)}
                />
              )}
            </FormField>
            <FormField label="Role" name="role" error={errors.role?.message}>
              {Object.values(UserRoleType).map((role: UserRoleType) => (
                <label className="block font-normal" htmlFor={role} key={role}>
                  <input
                    className="mr-3"
                    type="radio"
                    name="role"
                    id={role}
                    defaultValue={role}
                    onChange={() => {
                      setNotSaved(true);
                      setCurrRole(role);
                    }}
                    checked={currRole === role}
                    ref={register}
                  />
                  {UserRoleLabel[role]}
                </label>
              ))}
            </FormField>
            <div
              className={
                currRole === "Mentor" ||
                currRole === "Donor" ||
                currRole === "Parent"
                  ? ""
                  : "hidden"
              }
            >
              <legend className="text-lg font-medium mb-10 mt-16">
                Role Information
              </legend>
              <FormField
                label="Linked Players"
                name="linkedPlayers"
                error="" // TODO: fix this
              >
                <Combobox
                  selectedPlayers={selectedPlayers}
                  setSelectedPlayers={setSelectedPlayers}
                  role={currRole}
                  callback={() => setNotSaved(true)}
                />
              </FormField>
            </div>
          </fieldset>
          <hr />
          <div className="my-10">
            <div className="mb-2 flex">
              <Button
                className="button-primary px-10 py-2 mr-5"
                type="submit"
                onClick={() => setSubmitter("save")}
              >
                Save Changes
              </Button>
              <Button
                className="button-primary px-10 py-2 mr-5"
                onClick={() => {
                  setIsResending(true);
                }}
              >
                Re-Send Invite
              </Button>
              <Button
                className="button-hollow px-10 py-2"
                onClick={() => {
                  router.push("/admin/invite");
                }}
              >
                Cancel
              </Button>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>
          {user && (
            <ResendConfirmation
              isResending={isResending}
              setIsResending={setIsResending}
              setSubmitter={setSubmitter}
              getValues={getValues}
              onSubmit={onSubmit}
            />
          )}
        </form>
      </div>
    </DashboardLayout>
  );
};

export default UserInvitation;
