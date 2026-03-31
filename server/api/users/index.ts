import hooks from "./hooks";
import { Users } from "~~/schemas/auth/user.schema";
import { User } from "~~/models/auth/user.model";

export default useRest(Users, User, hooks);