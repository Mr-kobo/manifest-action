import { ZodEffects, ZodIssueCode, ZodObject, ZodString, number, z } from "zod";

export const passwordSchema = (params: any): any => {
    let stringObject: ZodString | ZodEffects<any, string, string> = z.string();
    if(params.minLength) stringObject = stringObject.min(params.minLength);
    if(params.maxLength) stringObject = stringObject.max(params.maxLength);
    if (params.numberSpecialChars && params.numberSpecialChars > 0) stringObject = stringObject.refine(val => (val && val.match(/[-`~!@#$%^&*()_=+[\]{}\\|;:'",.<>/?]/g) || []).length >= params.numberSpecialChars, { params: { code: ZodIssueCode.custom, i18n: { key: "zod.errors.specialchar", values: { number: params.numberSpecialChars } } } });
    if(params.numberCapitals && params.numberCapitals > 0) stringObject =  stringObject.refine(val => (val && val.match(/[A-Z]/g) || []).length >= params.numberCapitals, { params: { code: ZodIssueCode.custom, i18n: { key: "zod.errors.capitalchar", values: { number: params.numberCapitals }} }  });
    return stringObject;
} 

export interface IStrongPasswordStrength {
    minLength: number;
    maxLength?: number;
    numberSpecialChars?: number;
    numberCapitals?: number;
}
