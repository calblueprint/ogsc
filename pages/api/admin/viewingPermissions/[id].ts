import { routeByMethod } from "../../helpers";
import deleteHandler from "./delete";
import readHandler from "./read";

export default routeByMethod({
  GET: readHandler,
  DELETE: deleteHandler,
});
