import { routeByMethod } from "../helpers";
import readOneHandler from "./readOne";
import updateHandler from "./update";

export default routeByMethod({
  GET: readOneHandler,
  PATCH: updateHandler,
});
