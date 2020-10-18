import { routeByMethod } from "../../helpers";
import createHandler from "./create";
import readManyHandler from "./readMany";

export default routeByMethod({
  GET: readManyHandler,
  POST: createHandler,
});
