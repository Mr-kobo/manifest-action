import { Nitro } from "nitropack";
import mongoose from "mongoose";
import isBuildingOrGenerating from "~/utils/is-building";

export default async (_nitroApp: Nitro) => {
	if (isBuildingOrGenerating) {
		console.log("\x1b[36m%s\x1b[0m", "[NITRO] Skipping mongoose initialization..");
		return;
	}
	try {
		const config = useRuntimeConfig();
		console.log("\x1b[36m%s\x1b[0m", "[NITRO] Initializing mongoose..");	
		await mongoose.connect(config.mongodb);
		console.log("\x1b[32m%s\x1b[0m", "[NITRO] Mongoose initialized and connected.");
	} catch (e) {
		console.error("\x1b[31m%s\x1b[0m", "[NITRO][ERROR] ", e);
	}
};
