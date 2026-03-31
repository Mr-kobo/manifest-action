import { Nitro } from "nitropack";
import isBuildingOrGenerating from "~/utils/is-building";

export default async (_nitroApp: Nitro) => {
    if (isBuildingOrGenerating) {
        console.log("\x1b[36m%s\x1b[0m", "[NITRO] Skipping seeding..");
        return;
    }
    
    try {
        const config = useRuntimeConfig();
        if (process.env.SERVERLESS || !config.seeds.autoRun) {
            console.warn('\x1b[31m%s\x1b[0m', "[NITRO] skip seeding in serverless, trigger it manually with  : " + `${config.public.host}/api/_utils/seed?key=${config.seeds.secret}`);
            return; // disable seeding in serverless
        }
        if (config.seeds.autoRun) {
            await new Promise((res, rej) => setTimeout(res, 3000));
            await $fetch(`/api/_utils/seed?key=${config.seeds.secret}`);
        }
    } catch (e) {
        console.error("\x1b[31m%s\x1b[0m", "[NITRO][ERROR] ", e);
    }
};
