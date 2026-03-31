import { Forbidden } from "~/models/core/errors.model";


export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const { seeds } = useRuntimeConfig();
    if(!query.key || query.key !== seeds.secret){
        throw new Forbidden({ message: 'Unauthorized call of the seeding utilitary' })
    }
    
    await useSeed()
    return 'done';
});
