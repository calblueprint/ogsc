import { routeByMethod } from "../helpers";
import deleteOneAbsenceHandler from "./delete";
import updateOneAbsenceHandler from "./update";

export default routeByMethod({
  PATCH: updateOneAbsenceHandler,
  DELETE: deleteOneAbsenceHandler,
});
