
/**
 * Check if the code is executed in the context of a nitro handler
 * @returns 
 */
export default function isNitro() {
    // process.server & .client are not defined outside of a .vue component
    // return process.server === undefined && process.client === undefined // don't work anymore in 3.6.x
    
    // solution de bourrin (mais ça fonctionne)
    try {
        useFetch;
        console.log('[IS NITRO]', false);
        return false
    } catch (err) {
        console.log('[IS NITRO]', true);
        return true
    }


    // don't work in PRODUCTION ENV (DOCKER)
    console.log('\x1b[36m%s\x1b[0m', '[IS NITRO] ', import.meta.nitro);
    return import.meta.nitro;

    if (!!process.env.SERVERLESS) {
        console.log('[IS NITRO] ', import.meta.nitro);
        return import.meta.nitro; // this one is equivalent as process.nitro but work with netlify
    } else {
        // DON'T WORK IN PRODUCTION ENV
        console.log('PROCESS', import.meta.nitro);
        if (process) {
            const { nitro } = process || {};
            // replaced by process.nitro, true when called in a handler
            console.log('[IS NITRO] ', nitro);
            return nitro;
        } else {
            console.log('[IS NITRO] ', false);
            return false;
        }
    }
}