import { routeByMethod } from "../../../helpers";
import readOneHandler from "./readOne";

export default routeByMethod({
  GET: readOneHandler,
});
