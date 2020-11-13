// import Link from "next/link";
import { useRouter } from "next/router";
import DashboardLayout from "components/DashboardLayout";
import { User } from "@prisma/client";
import { useState, useEffect } from "react";
import Icon from "components/Icon";

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
      <div className="mx-16">
        <div className="flex flex-row items-center pt-20 pb-12">
          <div className="w-24 h-24 mr-4 bg-placeholder rounded-full">
            {/* <img src={user?.image} alt="" />{" "} */}
          </div>
          <div>
            <p className="text-2xl">{user?.name}</p>
            <p className="text-sm">Role</p>
          </div>
        </div>
        <hr className="border-unselected border-opacity-50 pb-10" />
        <div className="justify-end flex-row flex">
          <button
            type="button"
            className="py-3 px-5 rounded-full font-bold tracking-wide bg-button h-10 items-center text-sm flex-row flex"
            // onClick={() => {
            //   setTitle(category);
            // }}
          >
            <Icon type="edit" />
            <p className="pl-2">Edit</p>
          </button>
        </div>
        <div>
          <div className="pb-16 pt-">
            <h2 className="text-lg pb-5">Basic Information</h2>
            <div className="flex flex-row text-sm pb-6">
              <p className="text-bluetitle mr-20 w-24">Email Address</p>
              <p>{user?.email}</p>
            </div>
            <div className="flex flex-row text-sm pb-6">
              <p className="text-bluetitle mr-20 w-24">Phone Number</p>
              <p>{user?.phoneNumber}</p>
            </div>
            <div className="flex flex-row text-sm">
              <p className="text-bluetitle mr-20 w-24">User Role</p>
              <p>Role</p>
            </div>
          </div>
          <h2 className="text-lg pb-5">Mentor Information</h2>
          <div className="flex flex-row text-sm">
            <p className="text-bluetitle mr-20 w-24">Menteed Players</p>
            <p>List</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;
