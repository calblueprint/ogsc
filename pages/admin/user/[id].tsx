import { NextRouter, useRouter } from "next/router";
import DashboardLayout from "components/DashboardLayout";
import React, { useState, useEffect } from "react";
import Icon from "components/Icon";
import Button from "components/Button";
import FormField from "components/FormField";
import { IUser, UserRoleLabel, UserRoleType, UserStatus } from "interfaces";
import Joi from "lib/validate";
import { joiResolver } from "@hookform/resolvers/joi";
import { UpdateUserDTO } from "pages/api/admin/users/update";
import { useForm } from "react-hook-form";
import { DeleteUserDTO } from "pages/api/admin/users/delete";
import Link from "next/link";
import { NextPageContext } from "next";
import { PrismaClient, User } from "@prisma/client";
import Combobox from "components/Combobox";
import { ViewingPermissionDTO } from "pages/api/admin/roles/create";

interface AdminEditUserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: UserRoleType;
  menteedPlayers: [User];
}

interface EditUserProps {
  user?: IUser;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: (user: IUser) => void;
  relatedPlayers?: User[];
  originalPlayers: User[];
}

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
  const prisma = new PrismaClient();
  const id = context.query.id as string;

  const user = await prisma.user.findOne({
    where: { id: Number(id) },
    include: { roles: true },
  });

  if (user === null) {
    // TODO: Set statusCode to 404
    return { props: {} };
  }

  const relatedPlayerIds = user.roles
    .filter((role) => role.type === "Mentor")
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
  });

  return {
    props: {
      user,
      relatedPlayers: users,
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

const AdminEditUserFormSchema = Joi.object<AdminEditUserFormValues>({
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

const EditUser: React.FunctionComponent<EditUserProps> = ({
  user,
  isEditing,
  setIsEditing,
  setUser,
  relatedPlayers,
  originalPlayers,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [currRole, setCurrRole] = useState<UserRoleType>();
  const [selectedPlayers, setSelectedPlayers] = useState<User[]>(
    relatedPlayers || []
  );
  const { errors, register, handleSubmit } = useForm<AdminEditUserFormValues>({
    resolver: joiResolver(AdminEditUserFormSchema),
  });
  const router = useRouter();
  const refreshData = (): void => {
    router.replace(router.asPath);
  };

  useEffect(() => {
    setCurrRole(user?.defaultRole.type);
  }, [user]);

  async function onSubmit(
    values: AdminEditUserFormValues,
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

    try {
      const response = await fetch(`/api/admin/users/${user?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: values.email,
          name: `${values.firstName} ${values.lastName}`,
          phoneNumber: values.phoneNumber,
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
    <Modal open={Boolean(isEditing)}>
      <div className="mx-16 mt-24">
        <h1 className="text-3xl font-display font-medium mb-2">
          Basic Information
        </h1>
        <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
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
                />
              ) : (
                <input
                  type="text"
                  className="input input-full"
                  name="firstName"
                  placeholder="e.g., Cristiano"
                  ref={register}
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
                />
              ) : (
                <input
                  type="text"
                  className="input input-full"
                  name="lastName"
                  placeholder="e.g., Ronaldo"
                  ref={register}
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
            <FormField label="Role" name="role" error={errors.role?.message}>
              {Object.values(UserRoleType).map((role: UserRoleType) => (
                <label className="block font-normal" htmlFor={role} key={role}>
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
            <FormField
              label="Linked Players"
              name="linkedPlayers"
              error="" // TODO: fix this
            >
              <Combobox
                selectedPlayers={selectedPlayers}
                setSelectedPlayers={setSelectedPlayers}
                role={currRole}
              />
            </FormField>
          </fieldset>
          <hr />
          <div className="my-10">
            <div className="mb-2 flex">
              <Button className="button-primary px-10 py-2 mr-5" type="submit">
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
    </Modal>
  );
};

const UserProfile: React.FunctionComponent<gsspProps> = ({
  relatedPlayers,
}) => {
  const [user, setUser] = useState<IUser>();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  let statusButtonText;
  const refreshData = (): void => {
    router.replace(router.asPath);
  };
  const { id } = router.query;
  const [originalPlayers, setOriginalPlayers] = useState<User[]>([]);
  useEffect(() => {
    const getUser = async (): Promise<void> => {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "GET",
        headers: { "content-type": "application/json" },
        redirect: "follow",
      });
      if (!response.ok) {
        throw await response.json();
      } else {
        setUser((await response.json()).user);
      }
    };
    getUser();
  }, [id]);
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
  return (
    <DashboardLayout>
      <div className="mx-16 mb-24">
        <div className="flex flex-row items-center pt-20 pb-12">
          <div className="w-24 h-24 mr-4 bg-placeholder rounded-full">
            {/* <img src={user?.image} alt="" />{" "} */}
          </div>
          <div>
            <p className="text-2xl">{user?.name}</p>
            <p className="text-sm">
              {user && UserRoleLabel[user.defaultRole.type]}
            </p>
          </div>
        </div>
        <hr className="border-unselected border-opacity-50 pb-10" />
        <div className="justify-end flex-row flex">
          <button
            type="button"
            className="py-3 px-5 rounded-full font-bold tracking-wide bg-button h-10 items-center text-sm flex-row flex"
            onClick={() => {
              setIsEditing(true);
              setOriginalPlayers((relatedPlayers && [...relatedPlayers]) || []);
            }}
          >
            <Icon type="edit" />
            <p className="pl-2">Edit</p>
          </button>
        </div>
        <div>
          <div className="pb-16 pt-">
            <h2 className="text-lg pb-5">Basic Information</h2>
            <div className="flex flex-row text-sm pb-6">
              <p className="text-blue mr-20 w-24">Email Address</p>
              <p>{user?.email}</p>
            </div>
            <div className="flex flex-row text-sm pb-6">
              <p className="text-blue mr-20 w-24">Phone Number</p>
              <p>{user?.phoneNumber}</p>
            </div>
            <div className="flex flex-row text-sm">
              <p className="text-blue mr-20 w-24">User Role</p>
              <p>{user && UserRoleLabel[user.defaultRole.type]}</p>
            </div>
          </div>
          {user?.defaultRole.type === "Mentor" && (
            <div className="pb-16">
              <h2 className="text-lg pb-5">Mentor Information</h2>
              <div className="flex flex-row text-sm">
                <p className="text-blue mr-20 w-24">Linked Players</p>
                <div className="flex flex-col">
                  {relatedPlayers?.map((player: User) => {
                    return (
                      <Link href={`/admin/players/${player.id}`}>
                        <div className="underline cursor-pointer text-blue mb-2">
                          <p>{player.name}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          <p className="text-lg font-semibold pb-5">Account Changes</p>

          <Button
            className="button-primary mt-7 mb-52 mr-5"
            onClick={() => {
              changeUserStatus();
            }}
          >
            {statusButtonText}
          </Button>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
        {DeleteConfirmation({
          user,
          isDeleting,
          setIsDeleting,
          router,
        })}
        <EditUser
          user={user}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          setUser={setUser}
          relatedPlayers={relatedPlayers}
          originalPlayers={originalPlayers}
        />
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;
