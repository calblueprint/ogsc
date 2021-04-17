import DashboardLayout from "components/DashboardLayout";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { DeleteUserDTO } from "pages/api/admin/users/delete";
import Combobox from "components/Combobox";
import { User } from "@prisma/client";
import Button from "components/Button";
import { UpdateUserDTO } from "pages/api/admin/users/update";
import { UserRoleType, IUser, UserRoleLabel, UserStatus } from "interfaces";
import FormField from "components/FormField";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { useForm } from "react-hook-form";
import Icon from "components/Icon";
import toast, { Toaster } from "react-hot-toast";

interface AdminEditUserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: UserRoleType;
}

interface EditUserProps {
  user?: IUser;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: (user: IUser) => void;
}

type ModalProps = React.PropsWithChildren<{
  open?: boolean;
}>;

const Modal: React.FC<ModalProps> = ({ children, open }: ModalProps) => {
  return open ? (
    <div className="absolute top-0 left-0 w-screen h-screen bg-dark bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded w-3/4 px-10 pt-12 pb-8">{children}</div>
    </div>
  ) : null;
};
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const toasty = () => toast.success("Account request accepted!");

const AdminEditUserFormSchema = Joi.object<AdminEditUserFormValues>({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required(),
  phoneNumber: Joi.string().optional(),
  role: Joi.string()
    .valid(...Object.values(UserRoleType))
    .required(),
});

const EditUser: React.FunctionComponent<EditUserProps> = ({
  user,
  isEditing,
  setIsEditing,
  setUser,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [currRole, setCurrRole] = useState<UserRoleType>();
  const router = useRouter();
  const refreshData = (): void => {
    router.replace(router.asPath);
  };
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
        body: JSON.stringify(({
          id: user?.id,
          email: values.email,
          name: `${values.firstName} ${values.lastName}`,
          phoneNumber: values.phoneNumber,
          roles: [values.role as UserRoleType],
        } as unknown) as UpdateUserDTO),
      });
      // eslint-disable-next-line no-console
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
    </Modal>
  );
};

const UserAccountPage: React.FunctionComponent<UserRequest> = () => {
  const router = useRouter();
  const [selectedPlayers, setSelectedPlayers] = useState<User[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<IUser>();
  const id = Number(router.query.id);
  useEffect(() => {
    const getUser = async (): Promise<void> => {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "GET",
        headers: { "content-type": "application/json" },
        redirect: "follow",
      });
      const data = await response.json();
      setUser(data.user);
    };
    getUser();
  }, [id]);

  const showCombobox = (): string => {
    return ([
      UserRoleType.Mentor,
      UserRoleType.Parent,
      UserRoleType.Donor,
    ] as UserRoleType[]).includes(user?.defaultRole.type as UserRoleType)
      ? ""
      : "hidden";
  };
  const deleteUser = async (): Promise<void> => {
    try {
      const response = await fetch("/api/admin/users/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id,
        } as DeleteUserDTO),
      });
      if (!response.ok) {
        throw await response.json();
      }
      router.push("../");
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const acceptUser = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          status: UserStatus.Active,
        } as UpdateUserDTO),
      });
      if (!response.ok) {
        throw await response.json();
      }
      router.push("/admin/invite");
    } catch (err) {
      throw new Error(err.message);
    }
  };
  return (
    <DashboardLayout>
      <div className="flex-col mx-16 mt-14">
        <div className="mt-5 mb-10">
          <Button
            iconType="back"
            className="bg-white hover:bg-white text-blue font-bold py-2 px-4 rounded border-blue"
            onClick={() => {
              router.push("../");
            }}
          >
            Back to invites
          </Button>
        </div>
        <div className="flex space-x-8">
          <p className="text-4xl font-semibold">
            Invitation Request for {user?.name}{" "}
          </p>
          <button
            type="button"
            className="py-3 px-5 rounded-full font-bold tracking-wide bg-button h-10 items-center text-sm flex-row flex"
            onClick={() => {
              setIsEditing(true);
            }}
          >
            <Icon type="edit" />
          </button>
        </div>
        <p className="mb-10">Created {user?.createdAt}</p>
        <p className="text-3xl font-semibold mb-10">Basic Information </p>
        <p className="text-1xl">Name</p>
        <p className="mb-10 font-semibold">{user?.name}</p>
        <p className="text-1xl">Email Address</p>
        <p className="mb-10 font-semibold">{user?.email}</p>
        <p className="text-1xl">Phone number</p>
        <p className="mb-10 font-semibold">{user?.phoneNumber}</p>

        <p className="text-1xl">Role</p>
        <p className="mb-10 font-semibold">{user?.defaultRole.type}</p>
        <p className="text-2xl font-semibold mb-10">Attached Note</p>
        <p className="mb-10 font-semibold">{user?.adminNote}</p>
        <div className={showCombobox()}>
          <p className="text-2xl font-semibold"> Role Information </p>
          <p className="text-1xl font-semibold">Linked Players</p>
          <p className="mb-20">
            {user && (
              <Combobox
                selectedPlayers={selectedPlayers}
                setSelectedPlayers={setSelectedPlayers}
                role={user.defaultRole.type}
              />
            )}
          </p>
        </div>
        <div className="mb-10">
          <hr className="border-unselected border-opacity-50" />
        </div>
        <div className="flex space-x-8 self-center mb-16">
          <div>
            <Button
              className="bg-danger-muted hover:bg-danger-muted text-danger font-bold py-2 px-8 rounded"
              onClick={deleteUser}
            >
              Decline
            </Button>
          </div>
          <div className="ml-4 ">
            <div>
              <Button
                className="bg-success-muted hover:bg-success-muted text-success font-bold py-2 px-8 rounded"
                onClick={() => {
                  acceptUser();
                  toasty();
                }}
              >
                Accept
              </Button>
              <Toaster position="bottom-left" reverseOrder={false} />
            </div>
          </div>
        </div>
        <div>
          <EditUser
            user={user}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            setUser={setUser}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};
interface UserRequest {
  name: string;
  email: string;
  phoneNumber: string;
  Role: string;
  id: number;
  onDelete: () => void;
  onAccept: () => void;
}
export default UserAccountPage;
