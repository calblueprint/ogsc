import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { UserRoleType } from "interfaces";
import { UserDTO } from "./api/admin/users/readOneEmail";

// const Home: React.FC = () => <></>;

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   try {
//     const prisma = new PrismaClient();

//     const session = await getSession(context);
//     console.log(session);
//     // if (session && session.user) {
//     //   const user = await prisma.user.findOne({
//     //     where: { email: session.user.email },
//     //     include: { roles: true },
//     //   });
//     //   if (user && user.roles) {
//     //     return {
//     //       redirect: {
//     //         permanent: false,
//     //         destination: `/${user.roles[0].type.toLowerCase()}/invite`,
//     //       },
//     //     };
//     //   }
//     //   return {
//     //     notFound: true,
//     //   };
//     // }
//     // return {
//     //   redirect: {
//     //     permanent: false,
//     //     destination: "/",
//     //   },
//     // };
//   } catch (err) {
//     return {
//       redirect: {
//         permanent: false,
//         destination: "/auth/signin",
//       },
//     };
//   }

//   // const session = await getSession(context);
//   // if (!session) {
//   //   return {
//   //     redirect: {
//   //       permanent: false,
//   //       destination: "/auth/signin",
//   //     },
//   //   };
//   // }

//   // return null;
//   // try {
//   //   const session = await getSession(context);
//   //   if (!session) {
//   //     throw Error;
//   //   }
//   // } catch (e) {
//   //   return {
//   //     redirect: {
//   //       permanent: false,
//   //       destination: "/admin/invite",
//   //     },
//   //   };
//   // }
//   return { props: {} };
// };

const Home: React.FC = () => {
  const [session, loading] = useSession();
  const router = useRouter();

  console.log(session);
  useEffect(() => {
    const fetchUserRole = async (): Promise<void> => {
      if (session) {
        console.log(">>", session);
        const response = await fetch("/api/admin/users/readOneEmail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: session.user.email,
          } as UserDTO),
        });
        const data = await response.json();
        // if (!response.ok || !data.user) {
        //   console.log("bad");
        //   router.push("/auth/signin");
        // } else {
        //   setUserRole(data.user.roles[0].type);
        // }
        if (!response.ok) {
          router.push("/auth/signin");
        }
        console.log(data);
        const role = data?.user.roles[0].type;
        if (role in UserRoleType) {
          router.push(`/${role.toLowerCase()}/players`);
        }
      } else {
        router.push("/auth/signin");
      }
    };
    if (!loading) {
      fetchUserRole();
    }
  }, [session, router, loading]);

  // if (session && userRole) {
  //   router.push(`/${userRole.toLowerCase()}/invite`);
  // }

  return (
    <div>
      <p>Loading...</p>
    </div>
  );
  // if (loading) {
  //   return <p>Loading...</p>;
  // }
  // return null;
};

// const Home: React.FC = () => {
//   // export const getServerSideProps: GetServerSideProps = async (context) => {
//   const [session, loading] = useSession();

//   const [userRole, setUserRole] = useState<UserRoleType>();
//   const [updated, setUpdated] = useState<boolean>(false);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchUserRole = async (): Promise<void> => {
//       if (session) {
//         const response = await fetch("/api/admin/users/readOneEmail", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({
//             email: session.user.email,
//           } as UserDTO),
//         });
//         if (!response.ok) {
//           throw await response.json();
//         }
//         const user = await response.json();
//         console.log(user);
//         console.log(user?.user.roles[0].type);
//         setUserRole(user?.user.roles[0].type.toLowerCase());
//         setUpdated(true);
//         // const role = user?.user.roles[0].type;
//         // if (role in UserRoleType) {
//         //   router.push(`/${role.toLowerCase()}/invite`);
//         // } else {
//         //   router.push("/auth/signin");
//         // }
//       }
//     };
//     fetchUserRole();
//   }, [session]);

//   useEffect(() => {
//     console.log(">>>>>>>", userRole?.toLowerCase());
//     // console.log(updated);
//     // if (updated) {
//     //   console.log(">>>>>>>", userRole);
//     //   router.push(`/${userRole.toLowerCase()}/invite`);
//     // } else {
//     //   router.push("/auth/signin");
//     // }
//     // if (userRole) {
//     //   console.log(">>>>>>>", userRole);
//     //   router.push(`/${userRole.toLowerCase()}/invite`);
//     // } else {
//     //   router.push("/auth/signin");
//     // }
//   }, [userRole]);

//   // }, [updated, userRole, router]);

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   console.log(session);
//   // console.log(userRole);
//   // console.log(session && userRole);

//   // if (session) {
//   //   console.log(session);
//   //   // console.log(`/${userRole}/invite`);
//   //   // const link = `/${userRole.toLowerCase()}/invite`;
//   //   // router.push(link);
//   //   router.push("/admin/invite");
//   //   // router.push(`/${userRole}/invite`);
//   //   // try {
//   //   //   const user = await prisma.user.findOne({
//   //   //     where: { email: session.user.email },
//   //   //     include: { roles: true },
//   //   //   });
//   //   //   console.log(user);
//   //   //   // user?.roles;
//   //   //   router.push("/admin/invite");
//   //   // } catch (err) {
//   //   //   router.push("/auth/signin");
//   //   // }
//   //   // return {
//   //   //   redirect: {
//   //   //     permanent: false,
//   //   //     destination: "/admin/invite",
//   //   //   },
//   //   // };
//   // } else {
//   //   router.push("/auth/signin");
//   // }
//   return null;
//   // return <p>not logged in...</p>;

//   // return (
//   //   <>
//   //     {!session && (
//   //       <>
//   //         Not signed in <br />
//   //         {/* <button onClick={signIn}>Sign in</button> */}
//   //       </>
//   //     )}
//   //     {session && (
//   //       <>
//   //         Signed in as {session.user.email} <br />
//   //         {/* <button onClick={signOut}>Sign out</button> */}
//   //       </>
//   //     )}
//   //   </>
//   // );
// };

// // export const getServerSideProps = withSession(async function ({
// //   req: ValidatedNextApiRequest<T>,
// //   res: NextApiResponse<R>,
// // }) {
// //   // Get the user's session based on the request
// //   const user = req.session.get('user')

// //   if (!user) {
// //     return {
// //       redirect: {
// //         destination: '/login',
// //         permanent: false,
// //       },
// //     }
// //   }

// /*
// const Home: React.FC = () => {
//   const session = useSessionInfo();
//   console.log(session); // .sessionType); // .toLowerCase());
//   return (
//     <div className={styles.container}>
//       <Head>
//         <title>Create Next App</title>
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <main className={styles.main}>
//         <h1 className={styles.title}>
//           Welcome to <a href="https://nextjs.org">Next.js!</a>
//         </h1>

//         <p className={styles.description}>
//           Get started by editing{" "}
//           <code className={styles.code}>pages/index.js</code>
//         </p>

//         <div className={styles.grid}>
//           <a href="https://nextjs.org/docs" className={styles.card}>
//             <h3>Documentation &rarr;</h3>
//             <p>Find in-depth information about Next.js features and API.</p>
//           </a>

//           <a href="https://nextjs.org/learn" className={styles.card}>
//             <h3>Learn &rarr;</h3>
//             <p>Learn about Next.js in an interactive course with quizzes!</p>
//           </a>

//           <a
//             href="https://github.com/vercel/next.js/tree/master/examples"
//             className={styles.card}
//           >
//             <h3>Examples &rarr;</h3>
//             <p>Discover and deploy boilerplate example Next.js projects.</p>
//           </a>

//           <a
//             href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//             className={styles.card}
//           >
//             <h3>Deploy &rarr;</h3>
//             <p>
//               Instantly deploy your Next.js site to a public URL with Vercel.
//             </p>
//           </a>
//         </div>
//       </main>

//       <footer className={styles.footer}>
//         <a
//           href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Powered by{" "}
//           <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
//         </a>
//       </footer>
//     </div>
//   );
// };
// */

export default Home;
