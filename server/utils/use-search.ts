import { H3Event, getQuery } from 'h3';
import _ from 'lodash';
import { DocumentArchiveStatus } from '~/models/auth/archive-status.model';
import { ArchivesStatus } from '~/schemas/auth/archives-status.schema';

/**
 * useSearch
 */
export default (fields: string[]) => {
    return async (event: H3Event) => {
        try {
            const query = getQuery(event);
            if (!_.isEmpty(query.__search)) {
                const search: string = query.__search as string;
                const $and:any = query.$and || [];
                const splitSearch = search.split(' ');
                for (const word of splitSearch) {
                    const $or = [];
                    for (const field of fields) {
                        $or.push({ [field]: new RegExp('.*' + word + '.*', 'i') });
                    }
                    if ($or.length) {
                        $and.push({ $or });
                    }
                }
                if ($and.length) {
                    query.$and = $and;
                }
            }
            if ('__search' in query) {
                delete query.__search;
            }
            event.context.query = query;

    } catch (err: any) {
        console.error('[HOOK ERROR][SEARCH]', err.message);
        }
        return event;
    };
};
