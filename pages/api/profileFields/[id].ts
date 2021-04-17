import { routeByMethod } from "../helpers";
import deleteOneProfileFieldHandler from "./delete";
import updateOneProfileFieldHandler from "./update";

export default routeByMethod({
  PATCH: updateOneProfileFieldHandler,
  DELETE: deleteOneProfileFieldHandler,
});
