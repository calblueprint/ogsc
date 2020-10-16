import { createHmac } from "crypto";

const hash = (password: string): string => {
  return createHmac("sha256", password).digest("hex");
};

export default hash;
