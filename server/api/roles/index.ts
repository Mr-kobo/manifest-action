import { Roles } from "~~/schemas/auth/role.schema";
import { Role } from "~~/models/auth/role.model";
import hooks from "./hooks";


export default useRest(Roles, Role, hooks);