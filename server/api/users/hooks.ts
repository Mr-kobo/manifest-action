import { H3Event } from 'h3';
import _ from 'lodash';

export default {
    options: {
        paginate: true,
    },
    before: {
        all: [],
        find: [useGuard],
        get: [useGuard],
        post: [],
        patch: [useGuard,
            async (event: H3Event) => {
                const { user } = event.context;
                event.context.id = user?._id;                
            },
            async (event: H3Event) => {
                if (event.context.id) {
                    // require a confirmation through main user's contact before updating thoses fields 
                    const { escaped } = await useRequireConfirmation(event, event.context.id, ['password']);        
                    event.context.data = _.assign({}, escaped, { _id: event.context.id as string });
                }
            },
        ],
        remove: [useGuard]
    },
    after: {
        all: [
            async (event: H3Event) => {
                event.context.result = useProtect(event.context.result, 'password', 'emailVerified');
            }
        ],
        patch: [],
        remove: []
    }
};