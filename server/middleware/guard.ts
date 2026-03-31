import rules from '../guard.config';

/**
 * Call useGuard for all rules defined in guard.config.ts and apply them
 */
export default defineEventHandler(async (event) => { 
    await useGuard(event, rules); 
});
