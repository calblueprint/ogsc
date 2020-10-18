import { routeByMethod } from "../../helpers";
import deleteHandler from "./delete";
import readOneHandler from "./readOne";
import updateHandler from "./update";

export default routeByMethod({
  GET: readOneHandler,
  DELETE: deleteHandler,
  PATCH: updateHandler,
});
