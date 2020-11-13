// import Link from "next/link";
import { useRouter } from "next/router";
import DashboardLayout from "components/DashboardLayout";
import { User } from "@prisma/client";
import { useState, useEffect } from "react";

// const FirstPost: React.FunctionComponent = () => {
//   return (
//     <>
//       <h1>User Profile</h1>
//       <h2>
//         <Link href="/admin/users">
//           <a>Back to home</a>
//         </Link>
//       </h2>
//     </>
//   );
// };

const UserProfile: React.FunctionComponent = () => {
  const [user, setUser] = useState<User>();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const getUser = async (): Promise<void> => {
      const response = await fetch(
        `http://localhost:3000/api/admin/users/${id}`,
        {
          method: "GET",
          headers: { "content-type": "application/json" },
          redirect: "follow",
        }
      );
      const data = await response.json();
      setUser(data.user);
    };
    getUser();
  }, [id]);
  return (
    <DashboardLayout>
      <div>
        <div className="flex flex-row text-sm h-16 items-center py-10">
          <div className="w-10 h-10 mr-4 bg-placeholder rounded-full">
            {/* <img src={user?.image} alt="" />{" "} */}
          </div>
          <div>
            <p>{user?.name}</p>
            <p>Role</p>
          </div>
          <hr className="border-unselected border-opacity-50" />
        </div>
        <div>
          <h2>Basic Information</h2>
          <div className="flex flex-row justify-between">
            <p>Email Address</p>
            <p>{user?.email}</p>
          </div>
          <div className="flex flex-row justify-between">
            <p>Phone Number</p>
            <p>{user?.phoneNumber}</p>
          </div>
          <div className="flex flex-row justify-between">
            <p>User Role</p>
            <p>Role</p>
          </div>
          <h2>Mentor Information</h2>
          <div className="flex flex-row justify-between">
            <p>Email Address</p>
            <p>List</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;
