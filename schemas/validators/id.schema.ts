import { Types } from "mongoose";
import { z } from "zod";
import isObjectId from '../../utils/is-object-id';


export const idValidator = z.string().or(z.custom<Types.ObjectId>((value: any) => {
  // console.log('valid', value)
  return isObjectId(value);
  // if(isObjectId(value)){
  //   return true;
  // } else {
  //   throw new z.ZodError([{
  //     message: 'i18n.zod.errors.not_id',
  //     fatal: true,
  //     code: 'custom',      
  //     path: [],
  //   }])
  // }
}));

export const dateValidator = z.date().or(z.string());