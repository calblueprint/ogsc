/* eslint-disable no-console */
import fetch from "node-fetch";

if (!process.env.HEROKU_APP_NAME) {
  console.log(
    "This script is intended to be used with Heroku Review Apps only. No $HEROKU_APP_NAME environment variable was detected, so this script will exit."
  );
  process.exit(0);
}

/**
 * Sends a request to Heroku Platform API to update the $NEXTAUTH_URL config var to one that
 * includes the $HEROKU_APP_NAME environment variable.
 */
export default async function setNextAuthUrl(): Promise<void> {
  const request = await fetch(
    `https://api.heroku.com/apps/${process.env.HEROKU_APP_NAME}/config-vars`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/vnd.heroku+json; version=3",
        Authorization: `Bearer ${process.env.HEROKU_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        NEXTAUTH_URL: `https://${process.env.HEROKU_APP_NAME}.herokuapp.com`,
      }),
    }
  );
  if (!request.ok) {
    const response = await request.json();
    throw new Error(`[${request.status}] ${response.message} ${response.url}`);
  }
}

setNextAuthUrl()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(`Setting $NEXTAUTH_URL failed: ${err.message}`);
  });
