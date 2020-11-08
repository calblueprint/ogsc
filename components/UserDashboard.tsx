import { useState, useEffect } from "react";
import PageNav from "components/PageNav";
import { USER_PAGE_SIZE, UI_PAGE_SIZE } from "../constants";

interface User {
  name: string;
  email: string;
  image: string;
  phoneNumber: string;
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
  name,
  email,
  image,
  phoneNumber,
}) => {
  return (
    <div>
      <div className="flex flex-row justify-between text-sm h-16 items-center my-5">
        <div className="flex flex-row justify-between">
          <div className="w-10 h-10 mr-4 bg-placeholder rounded-full">
            <img src={image} alt="" />{" "}
            {/* Not being used right now because seed data doesn't have images */}
          </div>
          <div className="w-32">
            <p className="font-display">{name}</p>
            <p>User Role</p>
          </div>
        </div>
        <div className="w-56">
          <p>{email}</p>
        </div>
        <p>{phoneNumber}</p>
      </div>
      <hr className="border-unselected border-opacity-50" />
    </div>
  );
};

// TODO: Responsive Spacing
const UserDashboard: React.FunctionComponent = () => {
  const [users, setUsers] = useState<User[]>();
  const [index, setIndex] = useState(0);
  const [uiPage, setUIPage] = useState(0);
  const [numUIPages, setNumUIPages] = useState(0);
  const [pageCache, setPageCache] = useState<Record<number, User[]>>({});

  useEffect(() => {
    const getUsers = async (pageNumber: number): Promise<void> => {
      if (pageNumber in pageCache) {
        // Page already in cache; no need to make a request!
        setUsers(pageCache[pageNumber]);
      } else {
        const response = await fetch(
          `http://localhost:3000/api/admin/users?pageNumber=${pageNumber}`,
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
  }, [uiPage, pageCache]);
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
          name={user.name}
          email={user.email}
          image={user.image}
          phoneNumber={user.phoneNumber}
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
