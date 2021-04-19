import { routeByMethod } from "../helpers";
import createManyAbsencesHandler from "./createMany";

export default routeByMethod({
  POST: createManyAbsencesHandler,
});
