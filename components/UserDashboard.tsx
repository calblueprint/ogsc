import { UserRoleType, UserStatus } from "@prisma/client";
import Link from "next/link";
import PageNav from "components/PageNav";
import { IUser, UserRoleLabel } from "interfaces/user";
import { ReadManyUsersDTO } from "pages/api/admin/users/readMany";
import useSessionInfo from "utils/useSessionInfo";
import usePagination from "./pagination";

interface UserDashboardProps {
  filterValue: UserRoleType | UserStatus | null;
  phrase: string;
}

const UserDashboardItem: React.FunctionComponent<{ user: IUser }> = ({
  user: { id, name, email, image, phoneNumber, defaultRole, status },
}) => {
  const session = useSessionInfo();
  return (
    <Link href={`/${UserRoleLabel[session.sessionType].toLowerCase()}/${id}`}>
      <div className="hover:bg-hover cursor-pointer">
        <div className="grid grid-cols-8 text-sm h-24 ml-5">
          {/* TODO: FIX PADDING ABOVE */}
          <div className="col-span-3 inline-flex self-center">
            <div className="w-10 h-10 mr-4 bg-placeholder rounded-full">
              <img src={image || "/placeholder-profile.png"} alt="" />
              {/* Not being used right now because seed data doesn't have images */}
            </div>
            <div>
              <p className="font-semibold">
                {name}
                {status === UserStatus.Inactive && (
                  <text className="px-3 ml-5 rounded-full font-semibold text-unselected bg-button">
                    {UserStatus.Inactive.toUpperCase()}
                  </text>
                )}
              </p>
              <p>{UserRoleLabel[defaultRole.type]}</p>
            </div>
          </div>
          <p className="col-span-3 self-center">{email}</p>
          <p className="col-span-2 self-center">{phoneNumber}</p>
        </div>
        <hr className="border-unselected border-opacity-50" />
      </div>
    </Link>
  );
};

// TODO: Responsive Spacing
const UserDashboard: React.FunctionComponent<UserDashboardProps> = ({
  filterValue,
  phrase,
}) => {
  let roleFilter = ``;
  let statusFilter = ``;
  if (filterValue && filterValue in UserRoleType) {
    roleFilter = `&role=${filterValue}`;
  }
  if (filterValue && filterValue in UserStatus) {
    statusFilter = `?inactive=true`;
  }
  const [visibleData, numUIPages, currUIPage, setUIPage] = usePagination<IUser>(
    [filterValue, phrase],
    async (pageNumber: number) => {
      const response = await fetch(
        `/api/admin/users${statusFilter}?pageNumber=${pageNumber}&search=${phrase}${roleFilter}`,
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
      <div className="grid grid-cols-8 text-sm text-unselected tracking-wide mt-12 font-semibold mb-4 ml-5">
        <p className="col-span-3">Name</p>
        <p className="col-span-3">Email</p>
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
