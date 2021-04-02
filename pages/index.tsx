import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { UserRoleType } from "interfaces";
import { UserDTO } from "./api/admin/users/readOneEmail";

const Home: React.FC = () => {
  const [session, loading] = useSession();
  const router = useRouter();

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
          router.push("/auth/signin");
        }
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

  return (
    <div>
      <p>Loading...</p>
    </div>
  );
};

export default Home;
