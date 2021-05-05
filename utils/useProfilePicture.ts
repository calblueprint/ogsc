// import { IPlayer } from "interfaces";
import { useState, useEffect } from "react";
// import { deserializeProfileFieldValue } from "./buildUserProfile";

// export default function useProfilePicture(player: IPlayer | null): string {
export default function useProfilePicture(id: number | undefined): string {
  const [profilePicture, setProfilePicture] = useState<string>(
    "/placeholder-profile.png"
  );

  useEffect(() => {
    async function fetchProfilePicture(): Promise<void> {
      // if (player) {
      //   const uploadedProfilePicture = deserializeProfileFieldValue(
      //     player.profile?.ProfilePicture?.current
      //   );
      //   if (uploadedProfilePicture) {
      //     const response = await fetch(
      //       `/api/profilePicture?key=${uploadedProfilePicture.key}`,
      //       {
      //         method: "GET",
      //         headers: { "content-type": "application/json" },
      //         redirect: "follow",
      //       }
      //     );
      //     if (response.ok) {
      //       setProfilePicture((await response.json()).url);
      //     }
      //   }
      // }
      if (id) {
        // debugger;
        // console.log(id);
        const response = await fetch(`/api/players/images/${id}`, {
          method: "GET",
          headers: { "content-type": "application/json" },
          redirect: "follow",
        });
        // console.log(response);
        if (response.ok) {
          setProfilePicture((await response.json()).url);
        }
      }
    }
    fetchProfilePicture();
  });

  return profilePicture;
}
