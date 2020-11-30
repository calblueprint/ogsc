import { useState, useEffect } from "react";
import Link from "next/link";
import PageNav from "components/PageNav";
import { IUser, UserRoleLabel, UserRoleType } from "interfaces/user";
import { ReadManyUsersDTO } from "pages/api/admin/users/readMany";
import { USER_PAGE_SIZE, UI_PAGE_SIZE } from "../constants";

interface UserDashboardProps {
  userRole: UserRoleType | null;
  phrase: string;
}

/*
 * Takes in what page of the users dashboard you want to be displayed
 * Returns an array of pageNum and startIndex
 * pageNum is what page of the backend that you want to load
 * startIndex is what subsection of the backend page you want to grab (value can be 0, 1 or 2)
 * Note: assumes USER_PAGE_SIZE is 3x larger than UI_PAGE_SIZE
 */
const getBackendPageNumber = (uiPage: number): number[] => {
  const pageNum = Math.floor((uiPage * UI_PAGE_SIZE) / USER_PAGE_SIZE);
  const startIndex = UI_PAGE_SIZE * (uiPage % 3);
  return [pageNum, startIndex];
};

const UserDashboardItem: React.FunctionComponent<{ user: IUser }> = ({
  user: { id, name, email, image, phoneNumber, defaultRole },
}) => {
  return (
    <Link href={`user/${id}`}>
      <div className="flex flex-row justify-between text-sm h-16 items-center py-10 hover:bg-hover border-unselected border-opacity-50 border-b">
        {/* TODO: FIX PADDING ABOVE */}
        <div className="flex flex-row justify-between self-center">
          <div className="w-10 h-10 mr-4 bg-placeholder rounded-full">
            <img src={image || "/placeholder-profile.png"} alt="" />
            {/* Not being used right now because seed data doesn't have images */}
          </div>
          <div className="w-32">
            <p className="font-semibold">{name}</p>
            <p>{UserRoleLabel[defaultRole.type]}</p>
          </div>
        </div>
        <p className="self-center">{email}</p>
        <p className="self-center">{phoneNumber}</p>
      </div>
    </Link>
  );
};

// TODO: Responsive Spacing
const UserDashboard: React.FunctionComponent<UserDashboardProps> = ({
  userRole,
  phrase,
}) => {
  const [users, setUsers] = useState<IUser[]>();
  const [index, setIndex] = useState(0);
  const [uiPage, setUIPage] = useState(0);
  const [numUIPages, setNumUIPages] = useState(0);
  const [pageCache, setPageCache] = useState<Record<number, IUser[]>>({});

  useEffect(() => {
    setPageCache({});
    setUIPage(0);
  }, [userRole, phrase]);

  useEffect(() => {
    const getUsers = async (pageNumber: number): Promise<void> => {
      if (pageNumber in pageCache) {
        // Page already in cache; no need to make a request!
        setUsers(pageCache[pageNumber]);
      } else {
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
        setUsers(data.users);
        setNumUIPages(Math.ceil(data.total / UI_PAGE_SIZE));
        setPageCache({
          ...pageCache,
          [pageNumber]: data.users,
        });
      }
    }; // TODO: error handling
    const updateUIPage = (): void => {
      const [backendPage, startIndex] = getBackendPageNumber(uiPage);
      setIndex(startIndex);
      getUsers(backendPage);
    };
    updateUIPage();
  }, [uiPage, pageCache, userRole, phrase]);
  return (
    <div>
      <div className="flex flex-row justify-between text-sm text-center text-unselected tracking-wide mt-10">
        <p>Name</p>
        <p>Email</p>
        <p>Phone</p>
      </div>
      <hr className="border-unselected border-opacity-50" />
      <img src="" alt="" />
      {users?.slice(index, index + UI_PAGE_SIZE).map((user) => (
        <UserDashboardItem user={user} />
      ))}
      <PageNav
        currentPage={uiPage + 1}
        numPages={numUIPages}
        onPrevPage={() => {
          setUIPage(uiPage - 1);
        }}
        onNextPage={() => {
          setUIPage(uiPage + 1);
        }}
        prevDisabled={uiPage <= 0}
        nextDisabled={uiPage >= numUIPages - 1}
      />
    </div>
  );
};

export default UserDashboard;
