import { useState, useEffect } from "react";
import { DEFAULT_PROFILE_PICTURE } from "../constants";

export default function useProfilePicture(id: number | undefined): string {
  const [profilePicture, setProfilePicture] = useState<string>(
    "/placeholder-profile.png"
  );

  useEffect(() => {
    async function fetchProfilePicture(): Promise<void> {
      if (id) {
        const response = await fetch(`/api/players/images/${id}`, {
          method: "GET",
          headers: { "content-type": "application/json" },
          redirect: "follow",
        });
        const data = await response.json();
        if (response.ok && data.userImage !== DEFAULT_PROFILE_PICTURE) {
          const response2 = await fetch(
            `/api/profilePicture?key=${data.userImage}`,
            {
              method: "GET",
              headers: { "content-type": "application/json" },
              redirect: "follow",
            }
          );
          if (response2.ok) {
            setProfilePicture((await response2.json()).url);
          }
        }
      }
    }
    fetchProfilePicture();
  });

  return profilePicture;
}
