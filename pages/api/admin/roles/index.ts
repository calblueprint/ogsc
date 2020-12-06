import { routeByMethod } from "../../helpers";
import createHandler from "./create";

export default routeByMethod({
  POST: createHandler,
});
