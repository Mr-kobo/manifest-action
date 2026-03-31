import { ZodArray, ZodObject, ZodRawShape } from "zod";

export default (rules: ZodObject<ZodRawShape> | ZodArray<any>) => {

    const validForm = (data: any): any => {
        try {
            return rules.parse(data);
        } catch (err: any) {
            return err.issues;
        }
    }

    return {
        validForm
    }
}