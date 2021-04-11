import { NextRouter, useRouter } from "next/router";
import DashboardLayout from "components/DashboardLayout";
import React, { useState, useEffect } from "react";
import Icon from "components/Icon";
import Button from "components/Button";
import FormField from "components/FormField";
import { IUser, UserRoleLabel } from "interfaces";
import Joi from "lib/validate";
import { joiResolver } from "@hookform/resolvers/joi";
import { UpdateUserDTO } from "pages/api/admin/users/update";
import { useForm } from "react-hook-form";
import { DeleteUserDTO } from "pages/api/admin/users/delete";
import Link from "next/link";
import { NextPageContext } from "next";
import { User, UserRoleType, UserStatus } from "@prisma/client";
import prisma from "utils/prisma";
import Combobox from "components/Combobox";
import { ViewingPermissionDTO } from "pages/api/admin/roles/create";
import useSessionInfo from "utils/useSessionInfo";
import toast, { Toaster } from "react-hot-toast";
import { signOut } from "next-auth/client";
import colors from "../../constants/colors";

interface DeleteConfirmationProps {
  user?: IUser;
  isDeleting: boolean;
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>;
  router: NextRouter;
}

type ModalProps = React.PropsWithChildren<{
  open?: boolean;
}>;

type gsspProps = {
  user?: User;
  relatedPlayers?: User[];
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

  console.log("TESTING");

  const relatedPlayerIds = user.roles
    .filter(
      (role) =>
        role.type === "Mentor" ||
        role.type === "Parent" ||
        role.type === "Donor"
    )
    .map((role) => role.relatedPlayerId)
    .filter(
      (relatedPlayerId): relatedPlayerId is number => relatedPlayerId !== null
    );

  const relatedUsers = await prisma.user.findMany({
    where: {
      id: {
        in: relatedPlayerIds,
      },
    },
  });

  return {
    props: {
      user,
      relatedPlayers: relatedUsers,
    },
  };
}

// TODO: Make some styling changes
const Modal: React.FC<ModalProps> = ({ children, open }: ModalProps) => {
  return open ? (
    <div className="absolute top-0 left-0 w-screen h-screen bg-dark bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded w-3/4 px-10 pt-12 pb-8">{children}</div>
    </div>
  ) : null;
};

const DeleteConfirmation: React.FunctionComponent<DeleteConfirmationProps> = ({
  user,
  isDeleting,
  setIsDeleting,
  router,
}) => {
  async function onDelete(): Promise<void> {
    const response = await fetch(`/api/admin/users/${user?.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        id: user?.id,
      } as DeleteUserDTO),
    });
    if (!response.ok) {
      throw await response.json();
    }
    setIsDeleting(false);
    router.push("/admin/users");
  }
  return (
    <Modal open={Boolean(isDeleting)}>
      <p>Are you sure you want to delete this user?</p>
      <div className="mb-2 flex">
        <Button
          className="button-primary px-10 py-2 mr-5"
          onClick={() => {
            onDelete();
          }}
        >
          Delete
        </Button>
        <Button
          className="button-hollow px-10 py-2"
          onClick={() => {
            setIsDeleting(false);
          }}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

interface BasicInfoFormValues {
  email: string;
  phoneNumber: string;
  role: UserRoleType;
}
const BasicInfoFormSchema = Joi.object<BasicInfoFormValues>({
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

interface BasicInfoProps {
  user?: IUser;
  setUser: (user: IUser) => void;
  relatedPlayers?: User[];
  canEdit?: boolean;
}

const BasicInfo: React.FunctionComponent<BasicInfoProps> = ({
  user,
  setUser,
  relatedPlayers,
  canEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { errors, register, handleSubmit } = useForm<BasicInfoFormValues>({
    resolver: joiResolver(BasicInfoFormSchema),
  });
  const [currRole, setCurrRole] = useState<UserRoleType>();

  useEffect(() => {
    setCurrRole(user?.defaultRole.type);
  }, [user]);

  async function onSubmit(
    values: BasicInfoFormValues,
    event?: React.BaseSyntheticEvent
  ): Promise<void> {
    event?.preventDefault();
    if (submitting) {
      return;
    }

    const linkedPlayers: ViewingPermissionDTO[] = [];
    (relatedPlayers || [])?.forEach((role) => {
      const body = (JSON.stringify({
        type: currRole,
        userId: user?.id,
        relatedPlayerId: role.id,
      }) as unknown) as ViewingPermissionDTO;
      linkedPlayers.push(body);
    });
    if (linkedPlayers.length === 0) {
      const body = (JSON.stringify({
        type: currRole,
        userId: user?.id,
      }) as unknown) as ViewingPermissionDTO;
      linkedPlayers.push(body);
    }

    try {
      const response = await fetch(`/api/users/${user?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: values.email,
          phoneNumber: values.phoneNumber,
          roles: linkedPlayers,
        } as UpdateUserDTO),
      });
      if (!response.ok) {
        throw await response.json();
      } else {
        setUser((await response.json()).user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
      setIsEditing(false);
    }
  }

  const router = useRouter();
  const refreshData = (): void => {
    router.replace(router.asPath);
  };

  return (
    <div className="pb-16 grid grid-cols-2 justify-items-start w-4/6">
      <div>
        <div className="flex flex-row items-start">
          <h2 className="text-lg mr-6 font-medium">Basic Information</h2>
          {canEdit ? (
            <button
              type="button"
              onClick={() => {
                setIsEditing(true);
                setCurrRole(user?.defaultRole.type);
              }}
            >
              <Icon type="editCircle" />
            </button>
          ) : (
            []
          )}
        </div>
      </div>
      {isEditing ? (
        <div>
          <form id="basic-info-form" onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
              <FormField
                label="Email Address"
                name="email"
                error={errors.email?.message}
                mb={3}
              >
                {user?.email ? (
                  <input
                    type="text"
                    className="input"
                    name="email"
                    defaultValue={user?.email}
                    placeholder="e.g., soccer@fifa.com"
                    ref={register}
                  />
                ) : (
                  <input
                    type="text"
                    className="input"
                    name="email"
                    placeholder="e.g., soccer@fifa.com"
                    ref={register}
                  />
                )}
              </FormField>
              <FormField
                label="Phone Number"
                name="phoneNumber"
                error={errors.phoneNumber?.message}
                mb={3}
              >
                {user?.phoneNumber ? (
                  <input
                    type="text"
                    className="input"
                    name="phoneNumber"
                    defaultValue={user?.phoneNumber}
                    placeholder="e.g., 123-456-7890"
                    ref={register}
                  />
                ) : (
                  <input
                    type="text"
                    className="input"
                    name="phoneNumber"
                    placeholder="e.g., 123-456-7890"
                    ref={register}
                  />
                )}
              </FormField>
              <FormField
                label="Role"
                name="role"
                error={errors.role?.message}
                mb={3}
              >
                {Object.values(UserRoleType).map((role: UserRoleType) => (
                  <label
                    className="block font-normal"
                    htmlFor={role}
                    key={role}
                  >
                    <input
                      className="mr-3"
                      type="radio"
                      name="role"
                      id={role}
                      defaultValue={role}
                      onChange={() => setCurrRole(role)}
                      checked={currRole === role}
                      ref={register}
                    />
                    {UserRoleLabel[role]}
                  </label>
                ))}
              </FormField>
            </fieldset>

            <div className="my-10">
              <div className="mb-2 flex">
                <Button
                  className="button-primary px-10 py-2 mr-5"
                  type="submit"
                >
                  Save
                </Button>
                <Button
                  className="button-hollow px-10 py-2"
                  onClick={() => {
                    setIsEditing(false);
                    refreshData();
                  }}
                >
                  Cancel
                </Button>
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
            </div>
          </form>
        </div>
      ) : (
        <div>
          <div className="text-sm pb-6">
            <p className="text-dark mr-20 font-semibold">Email Address</p>
            <p className="font-normal">{user?.email}</p>
          </div>
          <div className="text-sm pb-6">
            <p className="text-dark mr-20 font-semibold">Phone Number</p>
            <p className="font-normal">{user?.phoneNumber}</p>
          </div>
          <div className="text-sm">
            <p className="text-dark mr-20 font-semibold">User Role</p>
            <p className="font-normal">
              {user && UserRoleLabel[user.defaultRole.type]}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

interface RoleInfoFormValues {
  menteedPlayers: [User];
}

interface RoleInfoProps {
  user?: IUser;
  setUser: (user: IUser) => void;
  relatedPlayers?: User[];
  canEdit?: boolean;
}

const RoleInfo: React.FunctionComponent<RoleInfoProps> = ({
  user,
  setUser,
  relatedPlayers,
  canEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { handleSubmit } = useForm<RoleInfoFormValues>();
  const [currRole, setCurrRole] = useState<UserRoleType>();
  const [selectedPlayers, setSelectedPlayers] = useState<User[]>(
    relatedPlayers || []
  );
  const [originalPlayers, setOriginalPlayers] = useState<User[]>([]);

  const router = useRouter();
  const refreshData = (): void => {
    router.replace(router.asPath);
  };
  useEffect(() => {
    setCurrRole(user?.defaultRole.type);
  }, [user]);

  async function onSubmit(
    values: RoleInfoFormValues,
    event?: React.BaseSyntheticEvent
  ): Promise<void> {
    event?.preventDefault();
    if (values && submitting) {
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
    if (linkedPlayers.length === 0) {
      const body = (JSON.stringify({
        type: currRole,
        userId: user?.id,
      }) as unknown) as ViewingPermissionDTO;
      linkedPlayers.push(body);
    }

    try {
      const response = await fetch(`/api/users/${user?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: user?.id,
          roles: linkedPlayers,
        } as UpdateUserDTO),
      });
      if (!response.ok) {
        throw await response.json();
      } else {
        setUser((await response.json()).user);
        refreshData();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
      setIsEditing(false);
    }
  }

  return (
    <div className="pb-16 grid grid-cols-2 justify-items-start w-4/6">
      <div className="flex flex-row pb-5 items-start">
        <h2 className="text-lg mr-6 font-medium">Role Information</h2>
        {canEdit ? (
          <button
            type="button"
            onClick={() => {
              setIsEditing(true);
              setOriginalPlayers((relatedPlayers && [...relatedPlayers]) || []);
            }}
          >
            <Icon type="editCircle" />
          </button>
        ) : (
          []
        )}
      </div>
      {isEditing ? (
        <div>
          <form id="basic-info-form" onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
              <FormField
                label="Linked Players"
                name="linkedPlayers"
                error="" // TODO: fix this
              >
                <Combobox
                  selectedPlayers={selectedPlayers}
                  setSelectedPlayers={setSelectedPlayers}
                  role={currRole}
                  promptOff
                />
              </FormField>
            </fieldset>

            <div className="my-10">
              <div className="mb-2 flex">
                <Button
                  className="button-primary px-10 py-2 mr-5"
                  type="submit"
                >
                  Save
                </Button>
                <Button
                  className="button-hollow px-10 py-2"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedPlayers(originalPlayers);
                  }}
                >
                  Cancel
                </Button>
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
            </div>
          </form>
        </div>
      ) : (
        <div className="text-sm pb-6">
          <p className="text-dark mr-20 font-semibold">Linked Players</p>
          <div className="flex flex-col">
            {relatedPlayers?.map((player: User) => {
              return (
                <Link href={`/admin/players/${player.id}`}>
                  <div className="underline cursor-pointer text-blue mb-2 font-normal">
                    <p>{player.name}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const UserProfile: React.FunctionComponent<gsspProps> = ({
  relatedPlayers,
}) => {
  const [user, setUser] = useState<IUser>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { id } = router.query;
  let statusButtonText;
  const refreshData = (): void => {
    router.replace(router.asPath);
  };

  useEffect(() => {
    setNewStatus(
      user?.status === UserStatus.Inactive
        ? UserStatus.Active
        : UserStatus.Inactive
    );
  }, [user]);

  async function changeUserStatus(): Promise<void> {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          status: newStatus,
        } as UpdateUserDTO),
      });
      if (!response.ok) {
        throw await response.json();
      } else {
        setUser((await response.json()).user);
        refreshData();
        let toastMessage;
        if (user?.status === UserStatus.Inactive) {
          toastMessage = "User account activated";
        } else {
          toastMessage = "User account deactivated";
        }
        toast.success(toastMessage, {
          duration: 2000,
          iconTheme: { primary: colors.dark, secondary: colors.button },
          style: {
            background: colors.dark,
            color: colors.button,
            margin: "50px",
          },
        });
      }
    } catch (err) {
      setError(err.message);
    }
  }
  if (user?.status === UserStatus.Active) {
    statusButtonText = "Deactivate Account";
  } else {
    statusButtonText = "Activate Acconut";
  }

  useEffect(() => {
    const getUser = async (): Promise<void> => {
      const response = await fetch(`/api/users/${id}`, {
        method: "GET",
        headers: { "content-type": "application/json" },
        redirect: "follow",
      });
      const data = await response.json();
      setUser(data.user);
    };
    getUser();
  }, [id]);
  const session = useSessionInfo();

  return (
    <DashboardLayout>
      <div className="mx-16 mb-24 ">
        <div className="flex flex-row items-center pt-20 pb-12">
          <img
            src={user?.image || "/placeholder-profile.png"}
            alt=""
            className="w-24 h-24 mr-12 bg-placeholder rounded-full"
          />
          <div>
            <div className="flex flex-row items-center">
              <p className="text-2xl font-semibold">{user?.name}</p>
              {user?.status === UserStatus.Inactive && (
                <text className="px-3 ml-5 rounded-full font-semibold text-unselected bg-button">
                  {UserStatus.Inactive.toUpperCase()}
                </text>
              )}
            </div>
            <div className="flex flex-row items-center">
              <p className="text-sm font-medium mr-4">
                {user && UserRoleLabel[user.defaultRole.type]}
              </p>
              {UserRoleLabel[session.sessionType] === "Admin" ||
              (user && session.user.id.toString() === id) ? (
                <button type="button">
                  <Icon type="editCircle" />
                </button>
              ) : (
                []
              )}
            </div>
          </div>
          {user && session.user.id.toString() === id ? (
            <button
              className="absolute top-24 right-0 mr-20"
              type="button"
              onClick={() => signOut()}
            >
              <Icon type="logoutButton" />
            </button>
          ) : (
            []
          )}
        </div>
        <hr className="border-unselected border-opacity-50 pb-16" />
        <p className="text-blue text-2xl font-medium pb-10">User Profile</p>
        <hr className="border-unselected border-opacity-50 pb-10" />
        <div>
          <BasicInfo
            user={user}
            setUser={setUser}
            relatedPlayers={relatedPlayers || []}
            canEdit={
              UserRoleLabel[session.sessionType] === "Admin" ||
              (user && session.user.id.toString() === id)
            }
          />
        </div>
        {user?.defaultRole.type === "Mentor" ||
        user?.defaultRole.type === "Parent" ||
        user?.defaultRole.type === "Donor" ? (
          <div>
            <hr className="border-unselected border-opacity-50 pb-16" />
            <RoleInfo
              user={user}
              setUser={setUser}
              relatedPlayers={relatedPlayers}
              canEdit={UserRoleLabel[session.sessionType] === "Admin"}
            />
          </div>
        ) : (
          []
        )}
        <div>
          {UserRoleLabel[session.sessionType] === "Admin" ? (
            <div>
              <hr className="border-unselected border-opacity-50 pb-10" />
              <div className="pb-16 grid grid-cols-2 justify-items-start w-4/6">
                <p className="text-lg mr-6 font-medium">Account Changes</p>

                <div>
                  <p className="font-semibold text-sm pb-2">User Access</p>
                  {user?.status === UserStatus.Active && (
                    <div className="text-sm pb-3">
                      Inactive users will no longer be able to access their
                      account but their data will remain intact. This action can
                      be undone at any point.
                    </div>
                  )}
                  <Button
                    className="button-primary mt-7 mb-52 mr-5"
                    onClick={() => {
                      changeUserStatus();
                    }}
                  >
                    {statusButtonText}
                  </Button>
                  <div className="text-sm pt-3">
                    {user?.name} is currently{" "}
                    <span className="text-blue font-semibold">
                      {user?.status.toLowerCase()}
                    </span>
                    .
                  </div>
                  <Toaster position="bottom-left" />
                  {error && <p className="text-red-600 text-sm">{error}</p>}
                </div>
              </div>
            </div>
          ) : (
            []
          )}
        </div>
        {DeleteConfirmation({
          user,
          isDeleting,
          setIsDeleting,
          router,
        })}
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;
