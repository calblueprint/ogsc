import { useRouter } from "next/router";
import DashboardLayout from "components/DashboardLayout";
import { User } from "@prisma/client";
import React, { useState, useEffect } from "react";
import Icon from "components/Icon";
import Button from "components/Button";
import FormField from "components/FormField";
import {
  UserRole,
  UserRoleConstants,
  UserRoleLabel,
  RoleLabel,
} from "interfaces";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { UpdateUserDTO } from "pages/api/admin/users/update";
import { useForm } from "react-hook-form";
import Combobox from "components/Combobox";

interface AdminEditUserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
}

interface EditUserProps {
  user?: User;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  currentRole?: string | string[];
  setUser: (user: User) => void;
  setNewRole: (newRole: string) => void;
}

type ModalProps = React.PropsWithChildren<{
  open?: boolean;
}>;

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
  phoneNumber: Joi.string().optional(),
  role: Joi.string()
    .valid(...UserRoleConstants)
    .required(),
});

const EditUser: React.FunctionComponent<EditUserProps> = ({
  user,
  isEditing,
  setIsEditing,
  currentRole,
  setUser,
  setNewRole,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [currRole, setCurrRole] = useState(currentRole);
  const [roleChosen, setRoleChosen] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState<User[]>([]);
  const { errors, register, handleSubmit } = useForm<AdminEditUserFormValues>({
    resolver: joiResolver(AdminEditUserFormSchema),
  });

  async function onSubmit(
    values: AdminEditUserFormValues,
    event?: React.BaseSyntheticEvent
  ): Promise<void> {
    event?.preventDefault();
    if (submitting) {
      return;
    }
    try {
      const response =
        values.role === "admin" || values.role === "player"
          ? await fetch(`/api/admin/users/${user?.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                name: `${values.firstName} ${values.lastName}`,
                email: values.email,
                phoneNumber: values.phoneNumber,
                role: `${UserRoleLabel[values.role]}`,
              } as UpdateUserDTO),
            })
          : await fetch(`/api/admin/users/${user?.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                name: `${values.firstName} ${values.lastName}`,
                email: values.email,
                phoneNumber: values.phoneNumber,
                role: `${UserRoleLabel[values.role]} to Player`,
              } as UpdateUserDTO),
            });
      if (!response.ok) {
        throw await response.json();
      } else {
        setUser((await response.json()).user);
        setNewRole(UserRoleLabel[values.role]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
      setIsEditing(false);
    }
  }
  const showCombobox = (): string => {
    return roleChosen === "mentor" ||
      roleChosen === "parent" ||
      roleChosen === "donor"
      ? ""
      : "hidden";
  };

  const handleRoleChange = (role: string, value: string): void => {
    setCurrRole(role);
    setRoleChosen(value);
  };

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
              {UserRoleConstants.map((role: UserRole) => (
                <label className="block font-normal" htmlFor={role}>
                  <input
                    className="mr-3"
                    type="radio"
                    name="role"
                    id={role}
                    defaultValue={role}
                    onChange={(event) =>
                      handleRoleChange(UserRoleLabel[role], event.target.value)
                    }
                    checked={currRole === UserRoleLabel[role]}
                    ref={register}
                  />
                  {UserRoleLabel[role]}
                </label>
              ))}
            </FormField>
            <div className={showCombobox()}>
              <legend className="text-lg font-medium mb-10 mt-16">
                Role Information
              </legend>
              <FormField
                label="Linked Players"
                name="linkedPlayers"
                error="" // TODO: fix this
              >
                <p
                  className={`text-xs font-normal mt-3 mb-3 ${showCombobox()}`}
                >
                  {(() => {
                    switch (roleChosen) {
                      case "mentor":
                        return "Mentors will have access to the full profile of players they are mentoring, including Engagement Scores, Academics, Attendance, and Physical Health information.";
                      case "parent":
                        return "Parents will have access to the full profile of their children, including Engagement Scores, Academics, Attendance, and Physical Health information.";
                      case "donor":
                        return "Donors will have access to extended profiles of players they’re sponsoring, including Engagement Scores, Academics, and Physical Health information.";
                      default:
                        return "error";
                    }
                  })()}
                </p>
                <Combobox
                  selectedPlayers={selectedPlayers}
                  setSelectedPlayers={setSelectedPlayers}
                />
              </FormField>
            </div>
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

const UserProfile: React.FunctionComponent = () => {
  const [user, setUser] = useState<User>();
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { id, role } = router.query;
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    const getUser = async (): Promise<void> => {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "GET",
        headers: { "content-type": "application/json" },
        redirect: "follow",
      });
      const data = await response.json();
      setUser(data.user);
      setNewRole(RoleLabel[data.user.viewerPermissions[0].relationship_type]);
    };
    getUser();
  }, [id]);
  return (
    <DashboardLayout>
      <div className="mx-16">
        <div className="flex flex-row items-center pt-20 pb-12">
          <div className="w-24 h-24 mr-4 bg-placeholder rounded-full">
            {/* <img src={user?.image} alt="" />{" "} */}
          </div>
          <div>
            <p className="text-2xl">{user?.name}</p>
            <p className="text-sm">{newRole}</p>
          </div>
        </div>
        <hr className="border-unselected border-opacity-50 pb-10" />
        <div className="justify-end flex-row flex">
          <button
            type="button"
            className="py-3 px-5 rounded-full font-bold tracking-wide bg-button h-10 items-center text-sm flex-row flex"
            onClick={() => {
              setIsEditing(true);
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
              <p>{newRole}</p>
            </div>
          </div>
          <h2 className="text-lg pb-5">Mentor Information</h2>
          <div className="flex flex-row text-sm">
            <p className="text-blue mr-20 w-24">Menteed Players</p>
            <p>List</p>
          </div>
        </div>
        {EditUser({
          user,
          isEditing,
          setIsEditing,
          currentRole: role,
          setUser,
          setNewRole,
        })}
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;
