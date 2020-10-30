// import { User } from "@prisma/client";
// import { useEffect, useState } from "react";

// const AdminNavbar: React.FunctionComponent = () => {
//   const [title, setTitle] = useState("All Users");
//   const Button = (category: string): unknown => {
//     return (
//       <button
//         type="button"
//         className={
//           title === category
//             ? "bg-gray-200 py-3 px-8 rounded-full font-bold tracking-wide"
//             : "py-3 px-8 rounded-full text-gray-500 tracking-wide"
//         }
//         onClick={() => {
//           setTitle(category);
//         }}
//       >
//         {category}
//       </button>
//     );
//   };

//   const raw = '{\n    "id": 9\n}';

//   const [users, setUsers] = useState();

//   const getUsers: void = async (id: string) => {
//     const response = await fetch("http://localhost:3000/api/users", {
//       method: "GET",
//       body: id,
//       redirect: "follow",
//     });
//     const user = await response.text();
//     // setUsers(user);
//   };

//   useEffect(() => {
//     getUsers();
//   }, []);

//   const UserDashboard: React.FunctionComponent = () => {
//     return (
//       <div>
//         <h1>Title</h1>
//         <p>Calories</p>
//         <img src="" alt="" />
//       </div>
//     );
//   };

//   return (
//     <div>
//       <div className="flex flex-row justify-between text-sm text-center">
//         {Button("All Roles")}
//         {Button("Admin")}
//         {Button("Players")}
//         {Button("Mentors")}
//         {Button("Donors")}
//         {Button("Parents")}
//       </div>
//       {/* TODO: Need to add dashboard components corresponding to each tab */}
//       UserDashboard
//     </div>
//   );
// };

// const AdminView: React.FunctionComponent = () => (
//   <div className="flex mt-20 flex-wrap space-y-6 flex-col mx-16">
//     <div className="header flex">
//       <div className="player-info grid grid-rows-1">
//         <p className="pt-6 text-3xl font-display font-medium">All Users</p>
//       </div>
//     </div>
//     {AdminNavbar({})}
//     <hr />
//   </div>
// );

// export default AdminView;
import DashboardLayout from "components/DashboardLayout";
import { useState } from "react";

const AdminNavbar: React.FunctionComponent = () => {
  const [title, setTitle] = useState("All Users");
  const Button = (category: string): unknown => {
    return (
      <button
        type="button"
        className={
          title === category
            ? "bg-button py-3 px-8 rounded-full font-bold tracking-wide"
            : "py-3 px-8 rounded-full text-unselected tracking-wide"
        }
        onClick={() => {
          setTitle(category);
        }}
      >
        {category}
      </button>
    );
  };
  return (
    <div>
      <div className="flex flex-row justify-between text-sm text-center">
        {Button("All Roles")}
        {Button("Admin")}
        {Button("Players")}
        {Button("Mentors")}
        {Button("Donors")}
        {Button("Parents")}
      </div>
      {/* TODO: Need to add dashboard components corresponding to each tab here */}
    </div>
  );
};

const AdminView: React.FunctionComponent = () => (
  <DashboardLayout>
    <div className="flex mt-20 flex-wrap space-y-6 flex-col mx-16">
      <div className="header flex">
        <div className="player-info grid grid-rows-1">
          <p className="pt-6 text-3xl font-display font-medium">All Users</p>
        </div>
      </div>
      {AdminNavbar({})}
      <hr className="border-unselected border-opacity-50" />
    </div>
  </DashboardLayout>
);

export default AdminView;
