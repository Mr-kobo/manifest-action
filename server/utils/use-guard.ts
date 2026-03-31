import { H3Event } from 'h3';
import _ from 'lodash';
import { ZodObject } from "zod";
import { BadRequest, Forbidden, MethodNotAllowed, NotAuthenticated } from '~/models/core/errors.model';
import useBackValidation from '~~/composables/use-back-validation';
import { User } from "~~/models/auth/user.model";

export interface IGuard {
    path?: string,
    methods?: string[],
    predicate?: () => Promise<boolean>,
    validator?: ZodObject<any>,
    auth?: boolean,
    profiles?: string[],
    power?: number,
    throw?: boolean,
}

/**
 * useGuard : throw error if a request don't request a given configuration
 */
export default async (event: H3Event, guards?: IGuard[] ) => {
    if (!guards) {
        guards = [{ auth: true }]
    }

    const session: any = await useServerSession(event);
    event.context.user = session ? new User({ ...session.user }) : null;
    event.context.authenticated = session !== null;
    const { user, authenticated } = event.context;

    // possible to deal with array of array
    guards = _.flatten(guards);

    for (let guard of guards) {

        const { pathname } = getRequestURL(event);

        // ignore guards were path are specified and different
        if (guard.path && guard.path !== pathname) {
            return true;
        }

        // ignore guards where method is specified and different
        if (guard.methods && !guard.methods.includes(getMethod(event)) && guard.methods[0] !== "*") {
            return true;
        }

        // Check for authenticated Error
        if (guard.auth || !_.isEmpty(guard.profiles)) {
            // check if Auth 401
            if (!authenticated) {
                if (guard.throw !== false) throw new NotAuthenticated();
                else return false;
            }
        }

        // Check for profile 403
        if (guard.profiles && _.isArray(guard.profiles)) {
            if (!authenticated || !user) {
                if (guard.throw !== false) throw new NotAuthenticated();
                else return false;
            }
            const checkProfileOfUser = user.role!.hasProfile(guard.profiles);
            if (!checkProfileOfUser.success) {
                console.log("Error guard profiles", guard.profiles, user?.role?.profiles);
                if (guard.throw !== false) throw new Forbidden({ message: checkProfileOfUser.message });
                else return false;
            }
        }

        if (guard.power) {
            if (!authenticated || !user) {
                if (guard.throw !== false) throw new NotAuthenticated();
                else return false;
            }
            const checkPowerOfUser = user.role!.hasPower(guard.power);
            if (session && !checkPowerOfUser.success) {
                console.log("Error guard power", guard.power, user?.role?.power);
                if (guard.throw !== false) throw new Forbidden({ message: checkPowerOfUser.message });
                return false;
            }
        }

        // Check for data validation or 400
        if (guard.validator) {
            const validation = await checkDataValidation(event, guard.validator);
            if (!(_.isBoolean(validation) && validation)) {
                if (guard.throw !== false) throw new BadRequest({ message: "error.form", data: validation });
                else return false;
            }
        }

        // Check if there is a custom predicate or 405
        if (guard.predicate) {
            const r = await guard.predicate();
            if (!r) {
                if (guard.throw !== false) throw new MethodNotAllowed({ message: "error.predicate" });
                else return false;
            }
        }
    }

    async function checkDataValidation(event: H3Event, validator: ZodObject<any>): Promise<boolean | { errors: any; }> {
        const { validForm } = useBackValidation(validator);
        if (_.isArray(await readBody(event))) {
            const entities = await readBody(event);
            for (let entity of entities) {
                const formErrors = await validForm(entity);
                if (_.isArray(formErrors)) return { errors: formErrors };
            }
            return true;
        }
        const data = { ...await readBody(event), ...getRouterParams(event) };
        const formErrors = await validForm(data);
        if (_.isArray(formErrors)) return { errors: formErrors };
        return true;
    }

    // Passed all tests
    return true;
};