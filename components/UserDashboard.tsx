import { useState, useEffect } from "react";
import PageNav from "components/PageNav";
import { ViewingPermission } from "@prisma/client";
import { USER_PAGE_SIZE, UI_PAGE_SIZE } from "../constants";
import { RoleLabel } from "../interfaces";

interface UserDashboardValues {
  id: number;
  name: string;
  email: string;
  image: string;
  phoneNumber: string;
  viewerPermissions: ViewingPermission[];
  role: string | undefined;
}

interface UserDashboardProps {
  userRole: string;
  phrase: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  image: string;
  phoneNumber: string;
  role: string | undefined;
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

const UserDashboardItem: React.FunctionComponent<User> = ({
  id,
  name,
  email,
  image,
  phoneNumber,
  role,
}) => {
  return (
    <a href={`user/${id.toString()}?role=${role}`}>
      <div className="flex flex-row justify-between text-sm h-16 items-center py-10 hover:bg-hover">
        {/* TODO: FIX PADDING ABOVE */}
        <div className="flex flex-row justify-between self-center">
          <div className="w-10 h-10 mr-4 bg-placeholder rounded-full">
            <img src={image} alt="" />{" "}
            {/* Not being used right now because seed data doesn't have images */}
          </div>
          <div className="w-32">
            <p className="font-semibold">{name}</p>
            <p>{role}</p>
          </div>
        </div>
        <p className="self-center">{email}</p>
        <p className="self-center">{phoneNumber}</p>
      </div>
      <hr className="border-unselected border-opacity-50" />
    </a>
  );
};

// TODO: Responsive Spacing
const UserDashboard: React.FunctionComponent<UserDashboardProps> = ({
  userRole,
  phrase,
}) => {
  const [users, setUsers] = useState<UserDashboardValues[]>();
  const [index, setIndex] = useState(0);
  const [uiPage, setUIPage] = useState(0);
  const [numUIPages, setNumUIPages] = useState(0);
  const [pageCache, setPageCache] = useState<
    Record<number, UserDashboardValues[]>
  >({});

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
          `/api/admin/users?pageNumber=${pageNumber}&role=${userRole}&search=${phrase}`,
          {
            method: "GET",
            headers: { "content-type": "application/json" },
            redirect: "follow",
          }
        );
        const data = await response.json();
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
        <UserDashboardItem
          id={user.id}
          name={user.name}
          email={user.email}
          image={user.image}
          phoneNumber={user.phoneNumber}
          role={
            user.viewerPermissions[0].relationship_type
              ? RoleLabel[user.viewerPermissions[0].relationship_type]
              : "Unknown User Role"
          }
        />
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
