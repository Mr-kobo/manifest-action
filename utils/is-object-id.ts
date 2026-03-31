import _ from "lodash";
import { Types } from "mongoose";


export default function(val: string | Types.ObjectId){
  return val && /[a-fA-F0-9]{24}/.test(val.toString());
}