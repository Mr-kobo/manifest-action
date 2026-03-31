import { z, ZodError } from 'zod';
import useZodI18n from './use-zod-i18n.js';

export default (rules: any | undefined) => {
    const { t, locale } = useI18n();
    const { getMessage } = useZodI18n();

    const errorToText = (error: ZodError | string) : string => {
        if(typeof error === 'string'){
            if(error.indexOf('E11000 duplicate key error') !== -1) return t('error.duplicate');
            if(error.indexOf('[ERR]') !== -1) return error.replace('[ERR]','');
            const errors = error.split('##');
            const text: string[] = [];
            errors.forEach(err => {
                text.push(t(err))
            })
            return text.join(', ');
        }
        else if(error.message && error.message.startsWith('i18n.')){
            const msges = error.message.split("_");
            const msge = msges[0];
            msges.shift();
            return t(msge.replace('i18n.',''), msges );
        } else return getMessage(error)
    }

    const validField = (field: string, data: any) => {
        try{
            rules.shape[field].parse(data[field]);
        }catch (err: any){
            let returnedError: any = [];
            err.issues.forEach((issue: any) => {
                returnedError.push(errorToText(issue))
            });
            return returnedError.join(', ');
        }
    }

    const checkBackendReturn = (data: any): {[ket: string] : string} => {
        let errors: {[key: string] : string} = {};
        if(typeof data === 'string'){
            errors['form'] = errorToText(data);
        } else if(data.length > 0){
            data.forEach( (issue: any) => {
                errors[(issue.path[0] as string)] = errorToText(issue);
            });
        }
        return errors;
    }

    return {
        validField,
        checkBackendReturn,
        errorToText
    }
}