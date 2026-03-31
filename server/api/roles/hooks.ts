import { H3Event } from 'h3';
import { disallow } from '~~/server/hooks/disallow.hook';

export default {
  before: {
    all: [useGuard],
    find: [
      async (event: H3Event) => {
        // Get only Roles based on your power equal or less
        const { user } = event.context;
        event.context.query = { power: { "$lte": user?.role?.power } };
      }
    ],
    get: [
      async (event: H3Event) => {
        // Get only Roles based on your power equal or less
        const { user } = event.context;
        event.context.query = { power: { "$lte": user?.role?.power } };     
      }
    ],
    post: [disallow],
    patch: [disallow],
    remove: [disallow]
  }
};