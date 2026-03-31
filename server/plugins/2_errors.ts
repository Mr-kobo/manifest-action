

export default defineNitroPlugin((nitro) => {
    nitro.hooks.hook("error", async (error, { event }) => {
        console.error(`[APP ERROR] ${event?.path} :`, error);
    });
});