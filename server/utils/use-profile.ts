import { AppPermissions } from '~/app.config';
import { H3Event } from 'h3';
import _ from 'lodash';
import { NotAuthenticated } from '~/models/core/errors.model';

/**
 * Check if the user présent in event.context has the required profile to do the operation.
 * Is Dependant of a logged user, need that useGuard if called before 
 */
export default (profiles: string | string[] | AppPermissions | AppPermissions[], event: H3Event ) => {

    const { user } = event.context;
    if (!user) {
        throw new NotAuthenticated();
    }

    // Check for profile 403
    return user.role!.hasProfile(profiles).success;
};