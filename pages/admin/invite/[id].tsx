import { useRouter } from "next/router";
import DashboardLayout from "components/DashboardLayout";
import React, { useState, useEffect } from "react";
import Button from "components/Button";
import FormField from "components/FormField";
import { IUser, UserRoleLabel, UserRoleType } from "interfaces";
import Joi from "lib/validate";
import { joiResolver } from "@hookform/resolvers/joi";
import { UpdateUserDTO } from "pages/api/admin/users/update";
import { useForm } from "react-hook-form";
import { NextPageContext } from "next";
import { PrismaClient, User } from "@prisma/client";
import Combobox from "components/Combobox";

interface AdminEditUserInviteFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: UserRoleType;
}

// interface EditUserProps {
//   user?: IUser;
//   isEditing: boolean;
//   setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
//   setUser: (user: IUser) => void;
// }

// interface DeleteConfirmationProps {
//   user?: IUser;
//   isDeleting: boolean;
//   setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>;
//   router: NextRouter;
// }

// type ModalProps = React.PropsWithChildren<{
//   open?: boolean;
// }>;

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
  });

  return {
    props: {
      user,
      relatedPlayers: users,
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

/*
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
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [currRole, setCurrRole] = useState<UserRoleType>();
  const { errors, register, handleSubmit } = useForm<AdminEditUserFormValues>({
    resolver: joiResolver(AdminEditUserFormSchema),
  });

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
    try {
      const response = await fetch(`/api/admin/users/${user?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: values.email,
          name: `${values.firstName} ${values.lastName}`,
          phoneNumber: values.phoneNumber,
          roles: [values.role as UserRoleType],
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
*/
// const showCombobox = (currRole: UserRoleType | undefined): string => {
//   return ([
//     UserRoleType.Mentor,
//     UserRoleType.Parent,
//     UserRoleType.Donor,
//   ] as UserRoleType[]).includes(currRole)
//     ? ""
//     : "hidden";
// };

const UserInvitation: React.FunctionComponent<gsspProps> = ({
  relatedPlayers,
}) => {
  const [user, setUser] = useState<IUser>();
  // const [isEditing, setIsEditing] = useState(false);
  // const [isDeleting, setIsDeleting] = useState(false);

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
      setUser(data.user);
      // console.log(data.user);
    };
    getUser();
  }, [id]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [currRole, setCurrRole] = useState<UserRoleType>();
  const [selectedPlayers, setSelectedPlayers] = useState<User[]>([]); // contains the newly selected players
  const {
    errors,
    register,
    handleSubmit,
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
    try {
      const response = await fetch(`/api/admin/users/${user?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: values.email,
          name: `${values.firstName} ${values.lastName}`,
          phoneNumber: values.phoneNumber,
          roles: [values.role as UserRoleType],
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
      // setIsEditing(false);
    }
  }

  return (
    // <Modal open={Boolean(isEditing)}>
    <DashboardLayout>
      <div className="mx-16 mt-24">
        <h1 className="text-3xl font-display font-medium mb-2">Edit Invite</h1>
        <p>Description</p>
        <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
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
                />
              </FormField>
            </div>
          </fieldset>
          <hr />
          <div className="my-10">
            <div className="mb-2 flex">
              <Button className="button-primary px-10 py-2 mr-5" type="submit">
                Re-Send Invite
              </Button>
              <Button
                className="button-hollow px-10 py-2"
                // onClick={() => {
                //   setIsEditing(false);
                // }}
              >
                Cancel
              </Button>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default UserInvitation;
