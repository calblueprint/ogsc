import { routeByMethod } from "../helpers";
import createManyProfileFieldsHandler from "./createMany";

export default routeByMethod({
  POST: createManyProfileFieldsHandler,
});
