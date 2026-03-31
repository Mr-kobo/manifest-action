import { emailValidator, identifierValidator, phoneValidator } from "~~/schemas/validators/login.schema";
import validator from "validator";
import _ from "lodash";
import { z } from "zod";
import { useWindowSize } from "@vueuse/core";
import { BadRequest } from "~/models/core/errors.model";

export default async (identifier: string, redirect?: string) => {
    const defaultRedirect = '/';

    const router = useRouter();
    const { signIn } = useAuth();
    // const { error: err } = useAlert();

    if (!identifierValidator.safeParse(identifier).success){
        throw new BadRequest('[PASSWDLESS] identifer invalid');
    }

    let provider = 'email';
    if (!emailValidator.safeParse(identifier).success && phoneValidator.safeParse(identifier).success){
        provider = 'sms'
    }

    const sign = await signIn(provider, { ...{ email: identifier }, redirect: false, callbackUrl: redirect || defaultRedirect });
    if (sign.error) {
        console.error(sign.error)
    }
    if (sign && sign.ok) {
        router.push({
            path: `/auth/verify/${provider}/${identifier}`,
            query: {
                callbackUrl: redirect || defaultRedirect
            }
        });
    }
    return sign;
}