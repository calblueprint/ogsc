import { UserRoleType } from "@prisma/client";
import Link from "next/link";
import PageNav from "components/PageNav";
import { IUser, UserRoleLabel } from "interfaces/user";
import { ReadManyUsersDTO } from "pages/api/admin/users/readMany";
import usePagination from "./pagination";

interface UserDashboardProps {
  userRole: UserRoleType | null;
  phrase: string;
}

const UserDashboardItem: React.FunctionComponent<{ user: IUser }> = ({
  user: { id, name, email, image, phoneNumber, defaultRole },
}) => {
  return (
    <Link href={`user/${id}`}>
      <div className="grid grid-cols-6 text-sm h-24 hover:bg-hover border-unselected border-opacity-50 border-b">
        {/* TODO: FIX PADDING ABOVE */}
        <div className="col-span-3 inline-flex self-center">
          <div className="w-10 h-10 mr-4 bg-placeholder rounded-full">
            <img src={image || "/placeholder-profile.png"} alt="" />
            {/* Not being used right now because seed data doesn't have images */}
          </div>
          <div>
            <p className="font-semibold">{name}</p>
            <p>{UserRoleLabel[defaultRole.type]}</p>
          </div>
        </div>
        <p className="col-span-2 self-center">{email}</p>
        <p className="col-span-1 self-center">{phoneNumber}</p>
      </div>
    </Link>
  );
};

// TODO: Responsive Spacing
const UserDashboard: React.FunctionComponent<UserDashboardProps> = ({
  userRole,
  phrase,
}) => {
  const [visibleData, numUIPages, currUIPage, setUIPage] = usePagination<IUser>(
    [userRole, phrase],
    async (pageNumber: number) => {
      const response = await fetch(
        `/api/admin/users?pageNumber=${pageNumber}&search=${phrase}${
          userRole ? `&role=${userRole}` : ""
        }`,
        {
          method: "GET",
          headers: { "content-type": "application/json" },
          redirect: "follow",
        }
      );
      const data = (await response.json()) as ReadManyUsersDTO;
      return {
        data: data.users,
        count: data.total,
      };
    }
  );

  return (
    <div>
      <div className="grid grid-cols-6 text-sm text-unselected tracking-wide mt-10">
        <p className="col-span-3">Name</p>
        <p className="col-span-2">Email</p>
        <p>Phone</p>
      </div>
      <hr className="border-unselected border-opacity-50" />
      <img src="" alt="" />
      {visibleData.map((user) => (
        <UserDashboardItem user={user} />
      ))}
      <PageNav
        currentPage={currUIPage + 1}
        numPages={numUIPages}
        onPrevPage={() => {
          setUIPage(currUIPage - 1);
        }}
        onNextPage={() => {
          setUIPage(currUIPage + 1);
        }}
        prevDisabled={currUIPage <= 0}
        nextDisabled={currUIPage >= numUIPages - 1}
      />
    </div>
  );
};

export default UserDashboard;
