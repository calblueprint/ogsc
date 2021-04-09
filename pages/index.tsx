import { useSession } from "next-auth/client";
import { useEffect } from "react";
import { UserRoleType } from "@prisma/client";
import { UserDTO } from "./api/admin/users/readOneEmail";

const Home: React.FC = () => {
  const [session, loading] = useSession();

  useEffect(() => {
    const fetchUserRole = async (): Promise<void> => {
      if (session) {
        const response = await fetch("/api/admin/users/readOneEmail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: session.user.email,
          } as UserDTO),
        });
        const data = await response.json();
        if (!response.ok) {
          window.location.replace("/auth/signin");
        }
        const role = data?.user.roles[0].type;
        if (role in UserRoleType) {
          window.location.replace(`/${role.toLowerCase()}/players`);
        }
      } else {
        window.location.replace("/auth/signin");
      }
    };
    if (!loading) {
      fetchUserRole();
    }
  }, [session, loading]);

  return (
    <div>
      <p>Loading...</p>
    </div>
  );
};

export default Home;
