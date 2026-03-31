
export default {
  before: {
    all: [useGuard],
    find: [
      useSearch(['id']),

    ],
    get: [],
    post: [],
    patch: [],
    remove: []
  }
};